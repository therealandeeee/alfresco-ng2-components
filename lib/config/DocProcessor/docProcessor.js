var fs = require("fs");
var path = require("path");
var program = require("commander");

var remark = require("remark");
var parse = require("remark-parse");
var stringify = require("remark-stringify");

var managetoc = require("./managetoc");
var sa = require("./seealso");


// "Aggregate" data collected over the whole file set.
var aggData = {
    saGraph: {}
};


function readPass(pathname, aggData) {
    var src = fs.readFileSync(pathname);
    
    var tree = remark().parse(src)

    sa.getSeeAlsoInfo(tree, pathname, aggData);
    //managetoc(tree);

    //fs.writeFileSync("dataColOut.md", remark().stringify(tree));
}


program
.usage('<sourceDir>')
.parse(process.argv);

if (program.args.length === 0) {
    console.log("Error: source directory argument required");
    return 0;
}

var sourcePath = path.resolve(program.args[0]);
var sourceInfo = fs.statSync(sourcePath);

if (sourceInfo.isDirectory()) {
    var files = fs.readdirSync(sourcePath);

    for (var i = 0; i < files.length; i++) {
        if (path.extname(files[i]) === ".md") {
            readPass(path.resolve(sourcePath, files[i]), aggData);
        }
    }
} else if (sourceInfo.isFile()) {
    if (path.extname(sourcePath) === ".md") {
        readPass(path.resolve(sourcePath), aggData);
    }
}

console.log(JSON.stringify(aggData.saGraph));



