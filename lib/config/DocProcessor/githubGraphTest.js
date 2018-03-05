"use strict";
exports.__esModule = true;
var path = require("path");
var fs = require("fs");
var graphql_request_1 = require("graphql-request");
var remark = require("remark");
var frontMatter = require("remark-frontmatter");
var yaml = require("js-yaml");
var moment = require("moment");
var process = require("process");
var libsearch = require("./libsearch");
var stoplist_1 = require("./stoplist");
var adf20StartDate = "2017-11-20";
var rootFolder = ".";
var stoplistFilePath = path.resolve("config", "DocProcessor", "commitStoplist.json");
var srcData = {};
var stoplist = new stoplist_1.Stoplist(stoplistFilePath);
var docsFolderPath = path.resolve("..", "docs");
console.log("Compiling list of component sources...");
libsearch(srcData, path.resolve(rootFolder));
/*
let keys = Object.keys(srcData);

for (let i = 0; i < keys.length; i++) {
  console.log(keys[i]);
}
*/
var authToken = process.env.graphAuthToken;
var client = new graphql_request_1.GraphQLClient('https://api.github.com/graphql', {
    headers: {
        Authorization: 'Bearer ' + authToken
    }
});
var query = "query commitHistory($path: String) {\n  repository(name: \"alfresco-ng2-components\", owner: \"alfresco\") {\n    ref(qualifiedName: \"development\") {\n      target {\n        ... on Commit {\n          history(first: 15, path: $path) {\n            nodes {\n              pushedDate\n              message\n            }\n          }\n        }\n      }\n    }\n  }\n}";
var key = "document-list.component";
var vars = {
    "path": "lib/" + srcData[key].path
};
client.request(query, vars).then(function (data) {
    var nodes = data["repository"].ref.target.history.nodes;
    var mdFilePath = path.resolve(docsFolderPath, key + ".md");
    var mdText = fs.readFileSync(mdFilePath);
    var tree = remark().use(frontMatter, ["yaml"]).parse(mdText);
    var lastReviewDate = moment(adf20StartDate);
    if (tree.children[0].type == "yaml") {
        var metadata = yaml.load(tree.children[0].value);
        lastReviewDate = moment(metadata["Last reviewed"]);
    }
    var numUsefulCommits = 0;
    nodes.forEach(function (element) {
        if (!stoplist.isRejected(element.message)) {
            var abbr = element.message.substr(0, 15);
            console.log(element.pushedDate + ": " + abbr);
            var commitDate = moment(element.pushedDate);
            if (commitDate.isAfter(lastReviewDate)) {
                numUsefulCommits++;
            }
        }
    });
    console.log("Commits since review:" + numUsefulCommits);
});
