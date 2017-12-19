var fs = require("fs");
var path = require("path");

var heading = require('mdast-util-heading-range');

var unist = require("../unistHelpers");
var ngHelpers = require("../ngHelpers");


module.exports = {
    "initPhase": initPhase,
    "readPhase": readPhase,
    "aggPhase": aggPhase,
    "updatePhase": updatePhase
}


var docsFolderPath = path.resolve("..", "docs");
var docDataFileName = path.resolve(docsFolderPath, "documentation.json");


function initPhase(aggData) {
    var docData = JSON.parse(fs.readFileSync(path.resolve('..', docsFolderPath, docDataFileName)));
    aggData.classNameDict = buildClassNameDict(docData);
}


function readPhase(tree, pathname, aggData) {

}


function aggPhase(aggData) {

}


function updatePhase(tree, pathname, aggData) {
    var currFileName = path.basename(pathname);

    if (currFileName.match(/component/)) {
        var className = fixCompodocFilename(currFileName);

        var classDocs = aggData.classNameDict[className];

        if (classDocs) {
            if (classDocs.inputsClass && classDocs.inputsClass.length > 0) {
                var propsTable = makePropsTable(classDocs.inputsClass);

                heading(tree, "Properties", (before, section, after) => {
                    return [before, propsTable, after];
                });
                
                //console.log(JSON.stringify(propsTable));
            }

            if (classDocs.outputsClass && classDocs.outputsClass.length > 0) {
                var eventsTable = makeEventsTable(classDocs.outputsClass);
                
                heading(tree, "Events", (before, section, after) => {
                    return [before, eventsTable, after];
                });
                //var eventsTable = makeEventsTable(classDocs.outputsClass);
            }
        }
    }
}


function buildClassNameDict(mainData) {
    var result = {};

    for (var i = 0; i < mainData.components.length; i++) {
        result[mainData.components[i].name] = mainData.components[i];
    }

    return result;
}


function makePropsTable(props) {
    if (props.length === 0) {
        return null;
    }

    var rows = [];
    
    for (var i = 0; i < props.length; i++) {
        var pName = props[i].name;
        var pType = props[i].type;
        var pDefault = props[i].defaultValue || '';
        var pDesc = props[i].description;

        if (pDesc) {
            pDesc = pDesc.trim().replace(/[\n\r]+/, ' ');
        }

        var cells = [
            unist.makeTableCell([unist.makeText(pName)]),
            unist.makeTableCell([unist.makeText(pType)]),
            unist.makeTableCell([unist.makeText(pDefault)]),
            unist.makeTableCell([unist.makeText(pDesc)])
        ];

        rows.push(unist.makeTableRow(cells));
    }

    return unist.makeTable([null, null, null, null], rows);
}


function makeEventsTable(events) {
    if (events.length === 0) {
        return null;
    }

    var rows = [];
    
    for (var i = 0; i < events.length; i++){
        var eName = events[i].name;
        var eType = events[i].type;
        var eDesc = events[i].description;

        if (eDesc) {
            eDesc = eDesc.trim().replace(/[\n\r]+/, ' ');
        }

        var cells = [
            unist.makeTableCell([unist.makeText(eName)]),
            unist.makeTableCell([unist.makeText(eType)]),
            unist.makeTableCell([unist.makeText(eDesc)])
        ];

        rows.push(unist.makeTableRow(cells));
    }

    return unist.makeTable([null, null, null], rows);
}


function initialCap(str) {
    return str[0].toUpperCase() + str.substr(1);
}


function fixCompodocFilename(rawName) {
	var name = rawName.replace(/\]|\(|\)/g, '');
	
    var fileNameSections = name.split('.');
    var compNameSections = fileNameSections[0].split('-');
    
    var outCompName = '';
    
    for (var i = 0; i < compNameSections.length; i++) {
        outCompName = outCompName + initialCap(compNameSections[i]);
    }
    
    var itemTypeIndicator = '';
    
    if (fileNameSections.length > 1) {
        itemTypeIndicator = initialCap(fileNameSections[1]);
    }
	
    var finalName = outCompName + itemTypeIndicator;
	
    return finalName;
}
