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


var docsFolderPath = path.resolve("..", "docs");
var docDataFileName = path.resolve(docsFolderPath, "documentation.json");


function initPhase(aggData) {
    var docData = JSON.parse(fs.readFileSync(path.resolve('..', docDataFilePath, docDataFileName)));
    aggData.classNameDict = buildClassNameDict(docData);
}


function readPhase(tree, pathname, aggData) {

}


function aggPhase(aggData) {

}


function updatePhase(tree, pathname, aggData) {

}