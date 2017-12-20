"use strict";
exports.__esModule = true;
var fs = require("fs");
var remark = require("remark");
var TreeIterator = /** @class */ (function () {
    function TreeIterator(tree) {
        this.tree = tree;
        this.pos = 0;
    }
    TreeIterator.prototype.current = function () {
        return this.tree.children[this.pos];
    };
    TreeIterator.prototype.advance = function () {
        this.pos++;
    };
    TreeIterator.prototype.finished = function () {
        return this.pos >= this.tree.children.length;
    };
    return TreeIterator;
}());
var ValResult = /** @class */ (function () {
    function ValResult(succeeded, errorMessage) {
        this.succeeded = succeeded;
        this.errorMessage = errorMessage;
    }
    return ValResult;
}());
var ValException = /** @class */ (function () {
    function ValException(valName, errorMessage) {
        this.valName = valName;
        this.errorMessage = errorMessage;
    }
    return ValException;
}());
var VSeq = /** @class */ (function () {
    function VSeq(name, elements) {
        this.elements = elements;
        this.name = name;
    }
    VSeq.prototype.validate = function (iter) {
        var i = 0;
        while (!iter.finished() && (i < this.elements.length)) {
            var node = iter.current();
            var v = this.elements[i];
            var res = v.validate(iter);
            if (res.succeeded) {
                i++;
            }
            else {
                console.log(res.errorMessage);
                return res;
            }
        }
        return new ValResult(true, "");
    };
    return VSeq;
}());
var VHeading = /** @class */ (function () {
    function VHeading(name, level) {
        this.level = level;
        this.name = name;
    }
    VHeading.prototype.validate = function (iter) {
        var node = iter.current();
        if (node.type !== "heading") {
            return new ValResult(false, "Found " + node.type + " where heading was expected");
        }
        else if (node.depth !== this.level) {
            return new ValResult(false, "Heading level was " + node.depth + " but " + this.level + " was expected");
        }
        else {
            iter.advance();
            return new ValResult(true, "");
        }
    };
    return VHeading;
}());
var VParagraph = /** @class */ (function () {
    function VParagraph(name) {
        this.name = name;
    }
    VParagraph.prototype.validate = function (iter) {
        var node = iter.current();
        if (node.type !== "paragraph") {
            return new ValResult(false, "Found " + node.type + " where paragraph was expected");
        }
        else {
            iter.advance();
            return new ValResult(true, "");
        }
    };
    return VParagraph;
}());
var src = fs.readFileSync("schemaTest.md", "utf8");
var tree = remark().parse(src);
var iter = new TreeIterator(tree);
var seq = new VSeq("Root", [
    new VHeading("Main title", 1),
    new VParagraph("Brief description"),
    new VHeading("Subheading", 2),
    new VParagraph("Body text")
]);
seq.validate(iter);
//console.log(JSON.stringify(tree));
