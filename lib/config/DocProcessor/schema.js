"use strict";
exports.__esModule = true;
var fs = require("fs");
var remark = require("remark");
var TreeNodeIterator = /** @class */ (function () {
    function TreeNodeIterator(tree) {
        this.tree = tree;
        this.pos = 0;
    }
    TreeNodeIterator.prototype.current = function () {
        return this.tree.children[this.pos];
    };
    TreeNodeIterator.prototype.advance = function () {
        this.pos++;
    };
    TreeNodeIterator.prototype.finished = function () {
        return this.pos >= this.tree.children.length;
    };
    TreeNodeIterator.prototype.copy = function () {
        return new TreeNodeIterator(this.tree);
    };
    TreeNodeIterator.prototype.assignFrom = function (other) {
        this.tree = other.tree;
        this.pos = other.pos;
    };
    return TreeNodeIterator;
}());
var ValException = /** @class */ (function () {
    function ValException(valName, errorMessage) {
        this.valName = valName;
        this.errorMessage = errorMessage;
    }
    ValException.prototype.toString = function () {
        return "Validation failed at \"" + this.valName + "\": " + this.errorMessage;
    };
    return ValException;
}());
var VSeq = /** @class */ (function () {
    function VSeq(name, elements) {
        this.elements = elements;
        this.name = name;
    }
    VSeq.prototype.validate = function (iter) {
        var savedIter = iter.copy();
        try {
            for (var i = 0; !iter.finished() && (i < this.elements.length); i++) {
                this.elements[i].validate(iter);
            }
        }
        catch (e) {
            iter.assignFrom(savedIter);
            throw e;
        }
    };
    return VSeq;
}());
var VOpt = /** @class */ (function () {
    function VOpt(name, childValidator) {
        this.childValidator = childValidator;
        this.name = name;
    }
    VOpt.prototype.validate = function (iter) {
        try {
            this.childValidator.validate(iter);
        }
        catch (e) {
        }
    };
    return VOpt;
}());
var VHeading = /** @class */ (function () {
    function VHeading(name, level) {
        this.level = level;
        this.name = name;
    }
    VHeading.prototype.validate = function (iter) {
        var node = iter.current();
        if (node.type !== "heading") {
            throw new ValException(this.name, "Found " + node.type + " where heading was expected");
        }
        else if (node.depth !== this.level) {
            throw new ValException(this.name, "Heading level was " + node.depth + " but " + this.level + " was expected");
        }
        iter.advance();
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
            throw new ValException(this.name, "Found " + node.type + " where paragraph was expected");
        }
        iter.advance();
    };
    return VParagraph;
}());
var VList = /** @class */ (function () {
    function VList(name, ordered) {
        if (ordered === void 0) { ordered = false; }
        this.ordered = ordered;
        this.name = name;
    }
    VList.prototype.validate = function (iter) {
        var node = iter.current();
        if (node.type !== "list") {
            throw new ValException(this.name, "Found " + node.type + " where list was expected");
        }
        else if (node.ordered && !this.ordered) {
            throw new ValException(this.name, "Ordered list was found but unordered list was expected");
        }
        else if (!node.ordered && this.ordered) {
            throw new ValException(this.name, "Unordered list was found but ordered list was expected");
        }
        iter.advance();
    };
    return VList;
}());
var MDValidator = /** @class */ (function () {
    function MDValidator(rootVal) {
        this.rootVal = rootVal;
    }
    MDValidator.prototype.validate = function (tree) {
        this.iter = new TreeNodeIterator(tree);
        this.rootVal.validate(this.iter);
    };
    return MDValidator;
}());
var src = fs.readFileSync("schemaTest.md", "utf8");
var tree = remark().parse(src);
//var iter = new TreeNodeIterator(tree);
var v = new MDValidator(new VSeq("Root", [
    new VHeading("Main title", 1),
    new VParagraph("Brief description"),
    new VOpt("", new VSeq("Contents section", [
        new VHeading("Contents heading", 2),
        new VList("Contents list")
    ])),
    new VHeading("Subheading", 2),
    new VParagraph("Body text")
]));
v.validate(tree);
//seq.validate(iter);
//console.log(JSON.stringify(tree));
