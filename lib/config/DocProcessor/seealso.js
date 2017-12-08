var path = require("path");
var getSection = require("mdast-util-heading-range");

var unist = require("./unistHelpers");

var seeAlsoHeading = "see also";    // Deliberately lowercase because we use caseless comparison.

module.exports = {
    "getSeeAlsoInfo": getSeeAlsoInfo,
}

function getSeeAlsoInfo(tree, pathname, aggData) {
    var saHeadingOffset = findSeeAlsoSection(tree);
    
    var saNode = [];

    if (saHeadingOffset !== -1) {
        // Skip over non-list parts.
        var s;

        for (
            s = saHeadingOffset;
            (s < tree.children.length) && !unist.isListUnordered(tree.children[s]);
            s++
        );

        if ((s < tree.children.length) && unist.isListUnordered(tree.children[s])) {
            var list = tree.children[s];

            for (var i = 0; i < list.children.length; i++) {
                var itemLink = getItemLinkInfo(list.children[i]);
    
                if (itemLink) {
                    saNode.push(itemLink);
                }
            }
        }
    }

    aggData.saGraph[path.basename(pathname, ".md")] = saNode;
}


function findSeeAlsoSection(tree) {
    var i;

    for (i = 0; i < tree.children.length; i++) {
        var child = tree.children[i];

        if (unist.isHeading(child) && (child.children[0].value.toLowerCase() === seeAlsoHeading))
            return i;
    }

    return -1;
}


function getItemLinkInfo(listItem) {
    var linkTarget = listItem.children[0].children[0].url;

    if (linkTarget.startsWith("http:") ||
        linkTarget.startsWith("#") ||
        !linkTarget.endsWith(".md"))
        return null;
    else
        return path.basename(linkTarget, ".md");
}

