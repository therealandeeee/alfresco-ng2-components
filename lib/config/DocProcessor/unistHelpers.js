module.exports = {

    makeText: function (textVal) {
        return {
            "type": "text",
            "value": textVal
        };
    },

    makeHeading: function (caption, depth) {
        return {
            "type": "heading",
            "depth": depth,
            "children": [caption]
        };
    },

    makeLink: function (caption, url) {
        return {
            "type": "link",
            "url": url,
            "children": [ caption ]
        };
    },

    makeListItem: function (itemValue) {
        return {
            "type": "listItem",
            "loose": false,
            "children": [ itemValue ]
        };
    },

    makeListUnordered: function (itemsArray) {
        return {
            "type": "list",
            "ordered": false,
            "children": itemsArray,
            "loose": false
        };
    },

    isHeading: function (node) {
        return node.type === "heading";
    },

    isListUnordered: function (node) {
        return (node.type === "list") && !node.ordered;
    }
}