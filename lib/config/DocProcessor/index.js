var fs = require("fs");
var path = require("path");

var unist = require("./unistHelpers");
var ngHelpers = require("./ngHelpers");


module.exports = {
    "initPhase": initPhase,
    "readPhase": readPhase,
    "aggPhase": aggPhase,
    "updatePhase": updatePhase
}

var angFilenameRegex = /([a-zA-Z0-9\-]+)\.((component)|(directive)|(model)|(pipe)|(service)|(widget))\.ts/;
var searchFolderOmitRegex = /(config)|(mock)|(i18n)|(assets)|(styles)/;

var undocStoplistFileName = path.resolve('..', 'docs', 'undocStoplist.json');
var rootFolder = ".";

var maxBriefDescLength = 180;

var adfLibNames = ["core", "content-services", "insights", "process-services"];


function initPhase(aggData) {
    aggData.stoplist = makeStoplist(undocStoplistFileName);    
    aggData.srcData = {};
    aggData.mdFileDesc = [];

    searchLibraryRecursive(aggData.srcData, path.resolve(rootFolder));

   // console.log(JSON.stringify(aggData.srcData));
}


function readPhase(tree, pathname, aggData) {
    var itemName = path.basename(pathname, ".md");

    // Look for the first paragraph in the file by skipping other items.
    // Should usually be a position 1 in the tree.
    var s;
    var briefDesc;

    for (
        s = 0;
        (s < tree.children.length) && !unist.isParagraph(tree.children[s]);
        s++
    );

    if (s < tree.children.length) {
        briefDesc = tree.children[s].children[0].value;

        if (!briefDesc)
            briefDesc = "";

        if (briefDesc.length > maxBriefDescLength) {
            // If brief description is too long then try to truncate it
            // to the first sentence and warn the user.
            briefDesc = briefDesc.substr(0, briefDesc.indexOf(". ") + 1);

            console.log(`Warning: brief description of '${itemName}' exceeds ${maxBriefDescLength} characters. Truncating to first sentence.`);
        }
    }

    aggData.mdFileDesc[itemName] = briefDesc;
}

function aggPhase(aggData) {
    var sections = prepareIndexSections(aggData);

    console.log(JSON.stringify(sections));
}


function updatePhase(tree, pathname, aggData) {
}


// Create a stoplist of regular expressions.
function makeStoplist(slFilePath) {
    var listExpressions = JSON.parse(fs.readFileSync(slFilePath, 'utf8'));
    
    var result = [];
    
    for (var i = 0; i < listExpressions.length; i++) {
        result.push(new RegExp(listExpressions[i]));
    }
    
    return result;
}

// Check if an item is covered by the stoplist and reject it if so.
function rejectItemViaStoplist(stoplist, itemName) {
    for (var i = 0; i < stoplist.length; i++) {
        if (stoplist[i].test(itemName)) {
            return true;
        }
    }
    
    return false;
}


//  Search source folders for .ts files to discover all components, directives, etc.
function searchLibraryRecursive(srcData, folderPath) {
    var items = fs.readdirSync(folderPath);
    
    for (var i = 0; i < items.length; i++) {
        var itemPath = path.resolve(folderPath, items[i]);
        var info = fs.statSync(itemPath);
        
        if (info.isFile() && (items[i].match(angFilenameRegex))) {
            var nameNoSuffix = path.basename(items[i], '.ts');
            
            var displayPath = itemPath.replace(/\\/g, '/');
            displayPath = displayPath.substr(displayPath.indexOf("lib") + 4);

            // Type == "component", "directive", etc.
            var itemType = nameNoSuffix.split('.')[1];
            
            srcData[nameNoSuffix] = { "path": displayPath, "type": itemType };            
        } else if (info.isDirectory() && !items[i].match(searchFolderOmitRegex)) {
            searchLibraryRecursive(srcData, itemPath);
        }
    }
}


function prepareIndexSections(aggData) {
    var srcNames = Object.keys(aggData.srcData);
    
    var sections = initEmptySections();

    for (var i = 0; i < srcNames.length; i++) {
        var itemName = srcNames[i];

        if (rejectItemViaStoplist(aggData.stoplist, itemName)) {
            continue;
        }

        var srcData = aggData.srcData[itemName];
        var libName = srcData.path.substr(0, srcData.path.indexOf("/"));

        var briefDesc = aggData.mdFileDesc[itemName];

        var displayName = ngHelpers.ngNameToDisplayName(itemName);

        if (briefDesc) {
            if (!sections[libName][srcData.type].documented) {
                sections[libName][srcData.type].documented = [];
            }

            sections[libName][srcData.type].documented.push({
                "displayName": displayName,
                "mdName": itemName + ".md",
                "srcPath": srcData.path,
                "briefDesc": briefDesc
            });
        } else {
            if (!sections[libName][srcData.type].undocumented) {
                sections[libName][srcData.type].undocumented = [];
            }

            sections[libName][srcData.type].undocumented.push({
                "displayName": displayName,
                "mdName": itemName + ".md",
                "srcPath": srcData.path
            });
        }
    }

    return sections;
}


function initEmptySections() {
    var result = {};

    for (var l = 0; l < adfLibNames.length; l++) {
        var lib = result[adfLibNames[l]] = {};

        for (var c = 0; c < ngHelpers.classTypes.length; c++) {
            var classType = lib[ngHelpers.classTypes[c]] = {};

            classType.undocumented = [];
            classType.documented = [];
        }
    }

    return result;
}


function buildMDDocumentedSection(docItems) {
    var listItems = [];

    for (var i = 0; i < docItems.length; i++) {
        listItems.push(makeMDDocumentedListItem(docItems[i]));
    }
}



function makeMDDocumentedListItem(docItem) {
    var mdFileLink = unist.makeLink(unist.makeText(docItem.displayName), docItem.mdName);
    var srcFileLink = unist.makeLink(unist.makeText("Source"), docItem.srcPath);
    var desc = unist.makeText(docItem.briefDesc);

    var para = unist.makeParagraph([
        mdFileLink, unist.makeText("("), srcFileLink, unist.makeText(") "), desc 
    ]);

    return unist.makeListItem(para);
}