import * as fs from "fs";
import * as path from "path";

import * as remark from "remark";
import * as stringify from "remark-stringify";
import * as directive from "mdast-comment-marker";

import * as unist from "../unistHelpers";
import { MDNav } from "../mdNav";


let includesFolder = path.resolve("tools", "doc", "includes");

let dirHandlers = {
    "proptable": function(dirObj, aggData) {
        console.log(JSON.stringify(dirObj.parameters));
        if (dirObj.parameters["class"]) {
            return [unist.makeText(`Prop table for ${dirObj.parameters["class"]}`)];
        }
    },
    "croptable": function(dirObj, aggData) {
        if (dirObj.parameters["class"]) {
            return [unist.makeText(`Crop table for ${dirObj.parameters["class"]}`)];
        }
    },
    "include": function(dirObj, aggData) {
        let include = aggData.includes[dirObj.parameters["name"]];

        if (include) {
            let newSection = remark()
            .data("settings", {paddedTable: false, gfm: false})
            .parse(include).children;

            return newSection;
        } else {
            console.log(`Error: Include "${dirObj.parameters["name"]}" not found`);
        }

    }
};


export function initPhase(aggData) {
    aggData.includes = {};

    let includeFiles = fs.readdirSync(path.resolve(includesFolder));

    includeFiles.forEach(file => {
        let includeName = path.basename(file, ".md");
        aggData.includes[includeName] = fs.readFileSync(path.resolve(includesFolder, file));
    });
}

export function readPhase(tree, pathname, aggData) {}


export function aggPhase(aggData) {

}


export function updatePhase(tree, pathname, aggData) {
    applyDirectives(tree, aggData);
    return true;
}


function applyDirectives(tree, aggData) {
    let nav = new MDNav(tree);

    let htmls = nav.findAll(h => h.type === "html" && directive(h));

    let openDirective;
    let openDirPos = -1;

    htmls.forEach(html => {
        let dir = directive(html.item);

        if (dir) {
            if (openDirective) {
                if ((dir.name === openDirective.name) && (dir.attributes === "end")) {
                    console.log(`Closing ${dir.name}`);
                    let replacements = dirHandlers[dir.name](openDirective, aggData);

                    if (replacements) {
                        tree.children.splice(openDirPos + 1, html.pos - (openDirPos + 1), ...replacements);
                    }

                    openDirective = null;
                    openDirPos = -1;
                } else {
                    console.log(`Error: Directive "${dir.name}" needs a matching "${dir.name} end"`);
                }
            } else if (dirHandlers[dir.name]) {
                console.log(dir.attributes);
                if (dir.attributes !== "end") {
                    openDirective = dir;
                    openDirPos = html.pos;
                    console.log(`Opening ${dir.name}`);
                } else {
                    console.log(`Error: Directive "${dir.name} end" found before opening "${dir.name}"`);
                }
            }
        }
    });
}