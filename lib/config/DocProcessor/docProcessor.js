var fs = require("fs");
var path = require("path");
var program = require("commander");

var remark = require("remark");
var parse = require("remark-parse");
var stringify = require("remark-stringify");

/*
var managetoc = require("./managetoc");
var sa = require("./seealso");
var index = require("./index");
*/

// "Aggregate" data collected over the whole file set.
var aggData = {};

var toolsFolderName = "tools";
var configFileName = "doctool.config.json";


function initPhase(aggData) {
    /*
    toolModules.seealso.initPhase(aggData);
    toolModules.index.initPhase(aggData);
    */

    toolList.forEach(toolName => {
        toolModules[toolName].initPhase(aggData);
    });
}


function readPhase(srcFolder, filenames, aggData) {
    for (var i = 0; i < filenames.length; i++) {
        var pathname = path.resolve(srcFolder, filenames[i]);
        
        var src = fs.readFileSync(pathname);
        var tree = remark().parse(src)

        toolList.forEach(toolName => {
            toolModules[toolName].readPhase(tree, pathname, aggData);
        });

        /*
        toolModules.seealso.readPhase(tree, pathname, aggData);
        toolModules.index.readPhase(tree, pathname, aggData);
        */
    }

    //console.log(JSON.stringify(aggData.mdFileData));
}


function aggPhase(aggData) {
    toolList.forEach(toolName => {
        toolModules[toolName].aggPhase(aggData);
    });

    /*
    toolModules.seealso.aggPhase(aggData);
    toolModules.index.aggPhase(aggData);
    */
}


function updatePhase(srcFolder, destFolder, filenames, aggData) {
    for (var i = 0; i < filenames.length; i++) {
        var pathname = path.resolve(srcFolder, filenames[i]);
        
        var src = fs.readFileSync(pathname);
        var tree = remark().parse(src)

        //toolModules.seealso.updatePhase(tree, pathname, aggData);
        //managetoc(tree);

        toolList.forEach(toolName => {
            toolModules[toolName].updatePhase(tree, pathname, aggData);
        });
        
        fs.writeFileSync(path.resolve(destFolder, filenames[i]), remark().stringify(tree));

        /*
        if (filenames[i] === "data-column.component.md")
            console.log(JSON.stringify(tree));
        */
    }
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


function loadToolConfig(configFilePath) {
    var config = JSON.parse(fs.readFileSync(configFilePath));

    return config.enabledTools;
}


program
.usage("[options] <source> [dest]")
.parse(process.argv);

if (program.args.length === 0) {
    console.log("Error: source argument required");
    return 0;
}


var sourcePath = path.resolve(program.args[0]);
var sourceInfo = fs.statSync(sourcePath);

var destPath;
var destInfo;

if (program.args.length >= 2) {
    destPath = path.resolve(program.args[1]);
    destInfo = fs.statSync(sourcePath);
} else {
    destPath = sourcePath;
    destInfo = sourceInfo;
}

if (sourceInfo.isDirectory() && !destInfo.isDirectory()) {
    console.log("Error: if <source> argument is a directory then <dest> must also be a directory");
    return 0;
}


var toolModules = loadToolModules();
var toolList = loadToolConfig(path.resolve(__dirname, configFileName));


var files;

if (sourceInfo.isDirectory()) {
    files = fs.readdirSync(sourcePath);
} else if (sourceInfo.isFile()) {
    files = [ path.resolve(sourcePath, files[i]) ];
}

files = files.filter(filename => 
    (path.extname(filename) === ".md") &&
    (filename !== "README.md")
);

//files.forEach(element => console.log(element));

console.log("Initialising...");
initPhase(aggData);

console.log("Analysing Markdown files...");
readPhase(sourcePath, files, aggData);

console.log("Computing aggregate data...");
aggPhase(aggData);

console.log("Updating Markdown files...");
updatePhase(sourcePath, destPath, files, aggData);

//console.log(JSON.stringify(aggData.saUpdateGraph));



