"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var ejs = require("ejs");
var remark = require("remark");
var replaceSection = require("mdast-zone");
var libNames = ["content-services", "core", "insights", "process-services"];
var templateName = path.resolve("tools", "doc", "templates", "mainIndex.ejs");
var indexMdFilePath = path.resolve("docs", "README.md");
function processDocs(mdCache, aggData, _errorMessages) {
    var classNames = Object.keys(aggData.classInfo);
    var contextObjects = {
        "content-services": new IndexTemplateContext(),
        "core": new IndexTemplateContext(),
        "insights": new IndexTemplateContext(),
        "process-services": new IndexTemplateContext()
    };
    classNames.forEach(function (className) {
        var classInfo = aggData.classInfo[className];
        if (classInfo.mdFilePath) {
            var classSourcePath = classInfo.sourcePath;
            var libMatch = classSourcePath.match(/lib\/(content-services|core|insights|process-services)/);
            if (libMatch) {
                var libName = libMatch[1];
                var classItem = aggData.classInfo[className];
                contextObjects[libName].add(classItem);
            }
        }
    });
    var indexFileText = fs.readFileSync(indexMdFilePath, "utf8");
    var indexFileTree = remark().parse(indexFileText);
    var templateSource = fs.readFileSync(templateName, "utf8");
    var template = ejs.compile(templateSource, {
        filename: templateName,
        cache: true
    });
    libNames.forEach(function (libName) {
        var currContext = contextObjects[libName];
        var mdText = template(currContext);
        var newSection = remark().parse(mdText.trim()).children;
        replaceSection(indexFileTree, libName, function (before, section, after) {
            newSection.unshift(before);
            newSection.push(after);
            return newSection;
        });
    });
    var newIndexText = remark().data("settings", { paddedTable: false }).stringify(indexFileTree);
    fs.writeFileSync(indexMdFilePath, newIndexText);
}
exports.processDocs = processDocs;
var IndexTemplateContext = /** @class */ (function () {
    function IndexTemplateContext() {
        this.components = [];
        this.directives = [];
        this.models = [];
        this.pipes = [];
        this.services = [];
        this.widgets = [];
        this.otherClasses = [];
        this.hasComponents = false;
        this.hasDirectives = false;
        this.hasModels = false;
        this.hasPipes = false;
        this.hasServices = false;
        this.hasWidgets = false;
        this.hasOtherClasses = false;
    }
    IndexTemplateContext.prototype.add = function (newItem) {
        switch (newItem.role) {
            case "component":
                this.components.push(newItem);
                this.hasComponents = true;
                break;
            case "directive":
                this.directives.push(newItem);
                this.hasDirectives = true;
                break;
            case "model":
                this.models.push(newItem);
                this.hasModels = true;
                break;
            case "pipe":
                this.pipes.push(newItem);
                this.hasPipes = true;
                break;
            case "service":
                this.services.push(newItem);
                this.hasServices = true;
                break;
            case "widget":
                this.widgets.push(newItem);
                this.hasWidgets = true;
                break;
            default:
                this.otherClasses.push(newItem);
                this.hasOtherClasses = true;
        }
    };
    return IndexTemplateContext;
}());
