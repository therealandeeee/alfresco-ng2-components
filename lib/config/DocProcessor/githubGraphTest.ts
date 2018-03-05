import * as path from "path";

import { GraphQLClient } from "graphql-request";
import * as process from "process"
import * as libsearch from "./libsearch";


const rootFolder = ".";
var srcData = {};

console.log("Compiling list of component sources...");
libsearch(srcData, path.resolve(rootFolder));

/*
let keys = Object.keys(srcData);

for (let i = 0; i < keys.length; i++) {
  console.log(keys[i]);
}
*/

const authToken = process.env.graphAuthToken;

const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    Authorization: 'Bearer ' + authToken
  }
});

const query = `query commitHistory($path: String) {
  repository(name: "alfresco-ng2-components", owner: "alfresco") {
    ref(qualifiedName: "development") {
      target {
        ... on Commit {
          history(first: 15, path: $path) {
            nodes {
              pushedDate
              message
            }
          }
        }
      }
    }
  }
}`;


let vars = {
  "path": "lib/" + srcData["document-list.component"].path
};

client.request(query, vars).then(data => {
    let nodes = data["repository"].ref.target.history.nodes;

    nodes.forEach(element => {
      let abbr = element.message.substr(0, 15);
      console.log(`${element.pushedDate}: ${abbr}`);
    });
});
