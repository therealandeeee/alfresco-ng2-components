import * as ngHelpers from "./ngHelpers";

export class NameLookup {
    classToDocExceptions = {};
    docToClassExceptions = {};

    constructor(config: any) {
        let docNames = Object.keys(config);

        docNames.forEach(docName => {
            this.docToClassExceptions[docName] = config[docName];
            this.classToDocExceptions[config[docName]] = docName;
        });
    }


    classToDocName(className: string) {
        if (this.classToDocExceptions[className]) {
            return this.classToDocExceptions[className];
        } else {
            return ngHelpers.kebabifyClassName(className);
        }
    }


    docToClassName(docName: string) {
        let docRootName = docName;

        if (docRootName.endsWith(".md")) {
            docRootName = docRootName.substring(0, docRootName.length - 3);
        }

        return ngHelpers.ngNameToClassName(docRootName, this.docToClassExceptions);
    }

    classToDisplayName(className: string) {
        if (this.classToDocExceptions[className]) {
            return ngHelpers.ngNameToDisplayName(this.classToDocExceptions[className]);
        } else {
            return ngHelpers.ngNameToDisplayName(ngHelpers.kebabifyClassName(className));
        }
    }


    docToDisplayName(docName: string) {
        return ngHelpers.ngNameToDisplayName(docName);
    }
}