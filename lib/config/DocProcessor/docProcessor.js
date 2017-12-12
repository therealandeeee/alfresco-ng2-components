var fs = require("fs");
var path = require("path");
var program = require("commander");

var remark = require("remark");
var parse = require("remark-parse");
var stringify = require("remark-stringify");

var managetoc = require("./managetoc");
var sa = require("./seealso");


// "Aggregate" data collected over the whole file set.
var aggData = {};


function initPhase(aggData) {
    sa.initPhase(aggData);
}


function readPhase(srcFolder, filenames, aggData) {

    for (var i = 0; i < filenames.length; i++) {
        var pathname = path.resolve(srcFolder, filenames[i]);
        
        var src = fs.readFileSync(pathname);
        var tree = remark().parse(src)

        sa.readPhase(tree, pathname, aggData);
    }
}


function aggPhase(aggData) {
    sa.aggPhase(aggData);
}


function updatePhase(srcFolder, destFolder, filenames, aggData) {
    for (var i = 0; i < filenames.length; i++) {
        console.log(filenames[i]);
        var pathname = path.resolve(srcFolder, filenames[i]);
        
        var src = fs.readFileSync(pathname);
        var tree = remark().parse(src)

        sa.updatePhase(tree, pathname, aggData);
        //managetoc(tree);
        fs.writeFileSync(path.resolve(destFolder, filenames[i]), remark().stringify(tree));
    }
}


program
.usage('<source> [<dest>]')
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

var files;

if (sourceInfo.isDirectory()) {
    files = fs.readdirSync(sourcePath);
    
    /*
    files = [
        "accordion.component.md",
        "data-column.component.md",
        "document-list.component.md"
    ];
    */

} else if (sourceInfo.isFile()) {
    files = [ path.resolve(sourcePath, files[i]) ];
}

files = files.filter(filename => 
    (path.extname(filename) === ".md") &&
    (filename !== "README.md")
);

//files.forEach(element => console.log(element));

initPhase(aggData);
readPhase(sourcePath, files, aggData);
aggPhase(aggData);
updatePhase(sourcePath, destPath, files, aggData);

console.log(JSON.stringify(aggData.saUpdateGraph));



