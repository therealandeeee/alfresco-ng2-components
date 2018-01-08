var fs = require("fs");
var path = require("path");
var program = require("commander");

var remark = require("remark");
var parse = require("remark-parse");
var stringify = require("remark-stringify");


var src = fs.readFileSync("schemaTest.md", "utf8");

var tree = remark().parse(src);

// console.log(JSON.stringify(tree));


function seq(name, children) {
    return {
        "nodeType": "sequence",
        "name": name,
        "children": children
    }
}


function heading(name, level) {
    return {
        "nodeType": "heading",
        "name": name,
        "level": level
    }
}


function para(name) {
    return {
        "nodeType": "paragraph",
        "name": name
    }
}


var docSchema = seq([
    heading("Page title", 1),
    para("Brief description"),
    heading("Subsection", 2),
    para("Body text")
]);


function validate(tree, schema) {
    
}


var validators = {
    "sequence": vSequence,
    "heading": vHeading,
    "paragraph": vParagraph
}


function errorMessage(node, message) {
    console.log(`Error in node "${node.name}": ${message}`);
}

function vSequence(schNode, treeNode) {
    if (schNode.children.length !== treeNode.children.length) {
        errorMessage(schNode, "Tree sequence and schema sequence are not the same length");
        return false;
    }

    for (var i = 0; i < schNode.children.length; i++) {
        var schChild = schNode.children[i];
        var treeChild = treeNode.children[i];

        if (!validators[])
    }

    return true;
}