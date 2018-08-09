import * as path from "path";
import * as fs from "fs";

import * as ejs from "ejs";

import * as remark from "remark";
import * as replaceSection from "mdast-util-heading-range";


import * as si from "../SourceInfoClasses";


let libNames = ["content-services", "core", "insights", "process-services"];
let templateName = path.resolve("tools", "doc", "templates", "mainIndex.ejs");

let indexMdFilePath = path.resolve("docs", "README.md");



export function processDocs(mdCache, aggData, _errorMessages) {
    let classNames = Object.keys(aggData.classInfo);

    let contextObjects = {
        "content-services": new IndexTemplateContext(),
        "core": new IndexTemplateContext(),
        "insights": new IndexTemplateContext(),
        "process-services": new IndexTemplateContext()
    };

    classNames.forEach(className => {
        let classSourcePath: string = mdCache[className].pathname.replace(/\\/, "/");
        console.log(classSourcePath);
        let libName = classSourcePath.match(/lib\/(content-services|core|insights|process-services)/)[0];
        console.log(libName);
        let classItem = aggData.classInfo[className];
        contextObjects[libName].add(classItem);
    });

    let indexFileText = fs.readFileSync(indexMdFilePath, "utf8");
    let indexFileTree = remark().parse(indexFileText);

    let templateSource = fs.readFileSync(templateName, "utf8");
    let template = ejs.compile(templateSource, {});

    libNames.forEach(libName => {
        let currContext = contextObjects[libName];
        let mdText = template(currContext);
        let newSection = remark().parse(mdText.trim()).children;

        replaceSection(indexFileTree, libName, (before, section, after) => {
            newSection.unshift(before);
            newSection.push(after);
            return newSection;
        });
    });

    let newIndexText = remark().data("settings", {paddedTable: false}).stringify(indexFileTree);
    fs.writeFileSync(indexMdFilePath, newIndexText);
}


class IndexTemplateContext {
    components: si.ComponentInfo[];
    directives: si.ComponentInfo[];
    models: si.ComponentInfo[];
    pipes: si.ComponentInfo[];
    widgets: si.ComponentInfo[];
    otherClasses: si.ComponentInfo[];

    hasComponents: boolean;
    hasDirectives: boolean;
    hasModels: boolean;
    hasPipes: boolean;
    hasWidgets: boolean;
    hasOtherClasses: boolean;

    add(newItem: si.ComponentInfo) {
        switch (newItem.role) {
            case "component":
                this.components.push(newItem);
                this.hasComponents = true;
                break;

            case "directive":
                this.directives.push(newItem);
                this.hasDirectives = true;
                break;

            case "model":
                this.models.push(newItem);
                this.hasModels = true;
                break;
            
            case "pipe":
                this.pipes.push(newItem);
                this.hasPipes = true;
                break;
            
            case "widget":
                this.widgets.push(newItem);
                this.hasWidgets = true;
                break;
            
            default:
                this.otherClasses.push(newItem);
                this.hasOtherClasses = true;
        }
    }
}