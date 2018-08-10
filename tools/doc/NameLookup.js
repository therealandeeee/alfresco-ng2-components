"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ngHelpers = require("./ngHelpers");
var NameLookup = /** @class */ (function () {
    function NameLookup(config) {
        var _this = this;
        this.classToDocExceptions = {};
        this.docToClassExceptions = {};
        var docNames = Object.keys(config);
        docNames.forEach(function (docName) {
            _this.docToClassExceptions[docName] = config[docName];
            _this.classToDocExceptions[config[docName]] = docName;
        });
    }
    NameLookup.prototype.classToDocName = function (className) {
        if (this.classToDocExceptions[className]) {
            return this.classToDocExceptions[className];
        }
        else {
            return ngHelpers.kebabifyClassName(className);
        }
    };
    NameLookup.prototype.docToClassName = function (docName) {
        var docRootName = docName;
        if (docRootName.endsWith(".md")) {
            docRootName = docRootName.substring(0, docRootName.length - 3);
        }
        return ngHelpers.ngNameToClassName(docRootName, this.docToClassExceptions);
    };
    NameLookup.prototype.classToDisplayName = function (className) {
        if (this.classToDocExceptions[className]) {
            return ngHelpers.ngNameToDisplayName(this.classToDocExceptions[className]);
        }
        else {
            return ngHelpers.ngNameToDisplayName(ngHelpers.kebabifyClassName(className));
        }
    };
    NameLookup.prototype.docToDisplayName = function (docName) {
        return ngHelpers.ngNameToDisplayName(docName);
    };
    return NameLookup;
}());
exports.NameLookup = NameLookup;
