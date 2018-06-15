"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var remark = require("remark");
var directive = require("mdast-comment-marker");
var unist = require("../unistHelpers");
var mdNav_1 = require("../mdNav");
var includesFolder = path.resolve("tools", "doc", "includes");
var dirHandlers = {
    "proptable": function (dirObj, aggData) {
        console.log(JSON.stringify(dirObj.parameters));
        if (dirObj.parameters["class"]) {
            return [unist.makeText("Prop table for " + dirObj.parameters["class"])];
        }
    },
    "croptable": function (dirObj, aggData) {
        if (dirObj.parameters["class"]) {
            return [unist.makeText("Crop table for " + dirObj.parameters["class"])];
        }
    },
    "include": function (dirObj, aggData) {
        var include = aggData.includes[dirObj.parameters["name"]];
        if (include) {
            var newSection = remark()
                .data("settings", { paddedTable: false, gfm: false })
                .parse(include).children;
            return newSection;
        }
        else {
            console.log("Error: Include \"" + dirObj.parameters["name"] + "\" not found");
        }
    }
};
function initPhase(aggData) {
    aggData.includes = {};
    var includeFiles = fs.readdirSync(path.resolve(includesFolder));
    includeFiles.forEach(function (file) {
        var includeName = path.basename(file, ".md");
        aggData.includes[includeName] = fs.readFileSync(path.resolve(includesFolder, file));
    });
}
exports.initPhase = initPhase;
function readPhase(tree, pathname, aggData) { }
exports.readPhase = readPhase;
function aggPhase(aggData) {
}
exports.aggPhase = aggPhase;
function updatePhase(tree, pathname, aggData) {
    applyDirectives(tree, aggData);
    return true;
}
exports.updatePhase = updatePhase;
function applyDirectives(tree, aggData) {
    var nav = new mdNav_1.MDNav(tree);
    var htmls = nav.findAll(function (h) { return h.type === "html" && directive(h); });
    var openDirective;
    var openDirPos = -1;
    htmls.forEach(function (html) {
        var dir = directive(html.item);
        if (dir) {
            if (openDirective) {
                if ((dir.name === openDirective.name) && (dir.attributes === "end")) {
                    console.log("Closing " + dir.name);
                    var replacements = dirHandlers[dir.name](openDirective, aggData);
                    if (replacements) {
                        (_a = tree.children).splice.apply(_a, [openDirPos + 1, html.pos - (openDirPos + 1)].concat(replacements));
                    }
                    openDirective = null;
                    openDirPos = -1;
                }
                else {
                    console.log("Error: Directive \"" + dir.name + "\" needs a matching \"" + dir.name + " end\"");
                }
            }
            else if (dirHandlers[dir.name]) {
                console.log(dir.attributes);
                if (dir.attributes !== "end") {
                    openDirective = dir;
                    openDirPos = html.pos;
                    console.log("Opening " + dir.name);
                }
                else {
                    console.log("Error: Directive \"" + dir.name + " end\" found before opening \"" + dir.name + "\"");
                }
            }
        }
        var _a;
    });
}
