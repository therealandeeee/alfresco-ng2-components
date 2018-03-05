import * as path from "path";
import * as fs from "fs";

import { GraphQLClient } from "graphql-request";
import * as remark from "remark";
import * as frontMatter from "remark-frontmatter";
import * as yaml from "js-yaml";
import * as moment from "moment";

import * as process from "process"
import * as libsearch from "./libsearch";
import { Stoplist } from "./stoplist";


const adf20StartDate = "2017-11-20";

const rootFolder = ".";
const stoplistFilePath = path.resolve("config", "DocProcessor", "commitStoplist.json");

let srcData = {};
let stoplist = new Stoplist(stoplistFilePath);

let docsFolderPath = path.resolve("..", "docs");

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

let key = "document-list.component";

let vars = {
  "path": "lib/" + srcData[key].path
};

client.request(query, vars).then(data => {
    let nodes = data["repository"].ref.target.history.nodes;

    let mdFilePath = path.resolve(docsFolderPath, key + ".md");

    let mdText = fs.readFileSync(mdFilePath);
    let tree = remark().use(frontMatter, ["yaml"]).parse(mdText);

    let lastReviewDate = moment(adf20StartDate);

    if (tree.children[0].type == "yaml") {
      let metadata = yaml.load(tree.children[0].value);
      lastReviewDate = moment(metadata["Last reviewed"]);
    }

    let numUsefulCommits = 0;

    nodes.forEach(element => {
      if (!stoplist.isRejected(element.message)) {
        let abbr = element.message.substr(0, 15);
        console.log(`${element.pushedDate}: ${abbr}`);

        let commitDate = moment(element.pushedDate);

        if (commitDate.isAfter(lastReviewDate)) {
          numUsefulCommits++;
        }
      }
    });

    console.log("Commits since review:" + numUsefulCommits);
});

