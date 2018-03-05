"use strict";
exports.__esModule = true;
var path = require("path");
var graphql_request_1 = require("graphql-request");
var process = require("process");
var libsearch = require("./libsearch");
var rootFolder = ".";
var srcData = {};
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
console.log("Path: " + srcData["document-list.component"].path);
//"lib/content-services/document-list/components/document-list.component.ts"
var vars = {
    "path": "lib/" + srcData["document-list.component"].path
};
client.request(query, vars).then(function (data) {
    var nodes = data["repository"].ref.target.history.nodes;
    nodes.forEach(function (element) {
        var abbr = element.message.substr(0, 15);
        console.log(element.pushedDate + ": " + abbr);
    });
});
