var fs = require("fs");
var path = require("path");

var program = require("commander");
var lodash = require("lodash");
var jsyaml = require("js-yaml");

var remark = require("remark");
var parse = require("remark-parse");
var stringify = require("remark-stringify");
var frontMatter = require("remark-frontmatter");
var mdCompact = require("mdast-util-compact");
var mdToString = require("mdast-util-to-string");


var ngHelpers = require("./ngHelpers");
var si = require("./SourceInfoClasses");
var MDNav = require("./mdNav");
var unist = require("./unistHelpers");
var nameLookup = require("./NameLookup");


// "Aggregate" data collected over the whole file set.
var aggData = {};

var toolsFolderName = "tools";
var configFileName = "doctool.config.json";
var defaultFolder = path.resolve("docs");
var sourceInfoFolder = path.resolve("docs", "sourceinfo");

var libFolders = ["core", "content-services", "process-services", "insights"];

var excludePatterns = [
    "**/*.spec.ts"
];


function updatePhase(mdCache, aggData) {
    var errorMessages;

    toolList.forEach(toolName => {
        errorMessages = [];
        console.log(`Tool: ${toolName}`);
        toolModules[toolName].processDocs(mdCache, aggData, errorMessages);
    });

    var classNames = Object.keys(mdCache);
    

    for (var i = 0; i < classNames.length; i++) {
        var className = classNames[i];
        var tree = mdCache[className].mdOutTree;
        var original = mdCache[className].mdInTree;
        var pathname = mdCache[className].pathname;

        if (program.json) {
            let filename = path.basename(pathname);

            console.log(`\nFile "${filename}" before processing:`);
            console.log(JSON.stringify(original));
            console.log(`\nFile "${filename}" after processing:`);
            console.log(JSON.stringify(tree));
        }

        if (!lodash.isEqual(tree, original)) {
            if (program.verbose) {
                console.log(`Modified: ${pathname}`);
            }

            fs.writeFileSync(pathname, remark().use(frontMatter, {type: 'yaml', fence: '---'}).data("settings", {paddedTable: false, gfm: false}).stringify(tree));
        }
    }
}


function deepCopy(obj) {
    // Despite how it looks, this technique is apparently quite efficient
    // because the JSON routines are implemented in C code and faster
    // than the equivalent JavaScript loops ;-)
    return JSON.parse(JSON.stringify(obj));
}


function minimiseTree(tree) {
    let minPropsTree = JSON.parse(JSON.stringify(tree, (key, value) => key === "position" ? undefined : value));
    mdCompact(minPropsTree);
    return minPropsTree;
}


function loadToolModules() {
    var mods = {};
    var toolsFolderPath = path.resolve(__dirname, toolsFolderName);
    var modFiles = fs.readdirSync(toolsFolderPath);

    for (var i = 0; i < modFiles.length; i++) {
        var modPath = path.resolve(toolsFolderPath, modFiles[i])

        if (path.extname(modPath) === ".js") {
            var toolName = path.basename(modPath, ".js");
            mods[toolName] = require(modPath);
        }
    }

    return mods;
}


function loadConfig() {
    var configFilePath = path.resolve(__dirname, configFileName)
    return JSON.parse(fs.readFileSync(configFilePath));
}


function getAllDocFilePaths(docFolder, files) {
    var items = fs.readdirSync(docFolder);

    for (var i = 0; i < items.length; i++) {
        var itemPath = path.resolve(docFolder, items[i]);
        var itemInfo = fs.statSync(itemPath);

        if (itemInfo.isFile()){
            files.push(itemPath);
        } else if (itemInfo.isDirectory()) {
            getAllDocFilePaths(itemPath, files);
        }
    }
}


function initMdCache(filenames, aggData) {
    var mdCache = {};

    for (var i = 0; i < filenames.length; i++) {
        var pathname = filenames[i];
        var className = ngHelpers.ngNameToClassName(path.basename(pathname, ".md"), config["typeNameExceptions"]);
        mdCache[className] = {};

        var src = fs.readFileSync(pathname);
        var tree = remark().use(frontMatter, ["yaml"]).parse(src);
        mdCache[className].mdInTree = minimiseTree(tree);
        mdCache[className].mdOutTree = minimiseTree(tree);
        mdCache[className].pathname = pathname;
    }

    return mdCache;
}



function initClassInfo(aggData, mdCache) {
    var yamlFilenames = fs.readdirSync(path.resolve(sourceInfoFolder));

    aggData.classInfo = {};

    yamlFilenames.forEach(yamlFilename => {
        var classYamlText = fs.readFileSync(path.resolve(sourceInfoFolder, yamlFilename), "utf8");
        var classYaml = jsyaml.safeLoad(classYamlText);
        
        var className = classYaml.items[0].name;

        if (program.verbose) {
            console.log(className);
        }

        var classInfo = new si.ComponentInfo(classYaml);
        aggData.classInfo[className] = classInfo;

        classInfo.displayName = aggData.nameLookup.classToDisplayName(className);

        var classMD = mdCache[className];

        if (classMD) {
            var mdPath = classMD.pathname.replace(/\\/g, "/");
            classInfo.mdFilePath = mdPath.substring(mdPath.indexOf("docs/") + 5);
            nav = new MDNav.MDNav(classMD.mdInTree);
            var briefDescNode = nav.paragraph();

            if (briefDescNode.item) {
                var briefDescMDTree = unist.makeRoot([briefDescNode.item]);
                classInfo.briefDesc = mdToString(briefDescMDTree).replace(/[\r\n]+/, " ").trim();//remark().stringify(briefDescMDTree).replace(/[\r\n]+/, " ").trim();
            }

            var metadataNode = nav.yaml();
            
            if (metadataNode.item) {
                var yamlText = metadataNode.value;
                classInfo.metadata = jsyaml.load(yamlText);
            }
        }
    });
}




program
.usage("[options] <source>")
.option("-p, --profile [profileName]", "Select named config profile", "default")
.option("-j, --json", "Output JSON data for Markdown syntax tree")
.option("-v, --verbose", "Log doc files as they are processed")
.option("-t, --timing", "Output time taken for run")
.parse(process.argv);

var startTime;

if (program.timing) {
    startTime = process.hrtime();
}

var sourcePath;

if (program.args.length === 0) {
    sourcePath = defaultFolder;
} else {
    sourcePath = path.resolve(program.args[0]);
}

var sourceInfo = fs.statSync(sourcePath);

var toolModules = loadToolModules();

var config = loadConfig();
aggData['config'] = config;
aggData["nameLookup"] = new nameLookup.NameLookup(config.typeNameExceptions);

var toolList;

if (config.profiles[program.profile]){
    toolList = config.profiles[program.profile];
    var toolListText = toolList.join(", ");
    console.log(`Using '${program.profile}' profile: ${toolListText}`);
} else {
    console.log(`Aborting: unknown profile '${program.profile}`);
    return 0;
}

var files = [];

if (sourceInfo.isDirectory()) {
    getAllDocFilePaths(sourcePath, files);
} else if (sourceInfo.isFile()) {
    files = [ sourcePath ];
}

files = files.filter(filename => 
    (filename !== undefined) &&
    (path.extname(filename) === ".md") &&
    (filename !== "README.md")
);


var mdCache = initMdCache(files, aggData);

console.log("Loading source data...");

initClassInfo(aggData, mdCache);

console.log("Updating Markdown files...");
updatePhase(mdCache, aggData);

if (program.timing) {
    var endTime = process.hrtime(startTime);
    console.log(`Run complete in ${endTime[0]} sec`);
}