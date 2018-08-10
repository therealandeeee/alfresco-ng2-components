import * as path from "path";
import * as fs from "fs";

import * as ejs from "ejs";

import * as remark from "remark";
import * as replaceZone from "mdast-zone";

import * as si from "../SourceInfoClasses";


let libNames = ["content-services", "core", "insights", "process-services"];
let templateName = path.resolve("tools", "doc", "templates", "mainIndex.ejs");

let indexMdFilePath = path.resolve("docs", "README.md");


export function processDocs(mdCache, aggData, _errorMessages) {
    let contextObjects = buildLibraryContextObjects(aggData)

    let indexFileText = fs.readFileSync(indexMdFilePath, "utf8");
    let indexFileTree = remark().parse(indexFileText);

    let templateSource = fs.readFileSync(templateName, "utf8");
    
    let template = ejs.compile(templateSource, {
        filename: templateName,
        cache: true
    });

    libNames.forEach(libName => {
        let currContext = contextObjects[libName];
        
        generateZoneFromTemplate(indexFileTree, libName, template, currContext);

        let subIndexFilePath = path.resolve("docs", libName, "README.md");
        let subIndexFileText = fs.readFileSync(subIndexFilePath, "utf8");
        let subIndexFileTree = remark().parse(subIndexFileText);
        
        currContext.urlPrefix = "../";

        generateZoneFromTemplate(subIndexFileTree, libName, template, currContext);

        let newSubIndexText = remark().data("settings", {paddedTable: false}).stringify(subIndexFileTree);
        fs.writeFileSync(subIndexFilePath, newSubIndexText);
    });

    /*
    let ugContextFileText = fs.readFileSync(path.resolve("docs", "user-guide", "summary.json"), "utf8");
    let ugContext = JSON.parse(ugContextFileText);

    let ugIndexFilePath = path.resolve("docs", "user-guide", "README.md");
*/

    let newIndexText = remark().data("settings", {paddedTable: false}).stringify(indexFileTree);
    fs.writeFileSync(indexMdFilePath, newIndexText);
}


class IndexTemplateContext {
    urlPrefix: string = "";
    components: si.ComponentInfo[] = [];
    directives: si.ComponentInfo[] = [];
    models: si.ComponentInfo[] = [];
    pipes: si.ComponentInfo[] = [];
    services:  si.ComponentInfo[] = [];
    widgets: si.ComponentInfo[] = [];
    otherClasses: si.ComponentInfo[] = [];

    hasComponents: boolean;
    hasDirectives: boolean;
    hasModels: boolean;
    hasPipes: boolean;
    hasServices: boolean;
    hasWidgets: boolean;
    hasOtherClasses: boolean;

    constructor() {
        this.hasComponents = false;
        this.hasDirectives = false;
        this.hasModels = false;
        this.hasPipes = false;
        this.hasServices = false;
        this.hasWidgets = false;
        this.hasOtherClasses = false;
    }

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
            
            case "service":
                this.services.push(newItem);
                this.hasServices = true;
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


function buildLibraryContextObjects(aggData) {
    let classNames = Object.keys(aggData.classInfo);

    let contextObjects = {
        "content-services": new IndexTemplateContext(),
        "core": new IndexTemplateContext(),
        "insights": new IndexTemplateContext(),
        "process-services": new IndexTemplateContext()
    };

    classNames.forEach(className => {
        let classInfo: si.ComponentInfo = aggData.classInfo[className];

        if (classInfo.mdFilePath) {
            let classSourcePath: string = classInfo.sourcePath;
            let libMatch = classSourcePath.match(/lib\/(content-services|core|insights|process-services)/);
            
            if (libMatch) {
                let libName = libMatch[1];
                let classItem = aggData.classInfo[className];
                contextObjects[libName].add(classItem);
            }
        }
    });

    return contextObjects;
}


function generateZoneFromTemplate(tree, zoneName, template, context) {
    let mdText = template(context);
    let newSection = remark().parse(mdText.trim()).children;

    replaceZone(tree, zoneName, (before, section, after) => {
        newSection.unshift(before);
        newSection.push(after);
        return newSection;
    });
}