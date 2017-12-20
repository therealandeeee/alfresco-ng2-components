import * as fs from "fs";
import * as remark from "remark";


class TreeIterator {
    tree: any;
    pos: number;

    constructor(tree: any) {
        this.tree = tree;
        this.pos = 0;
    }

    current(): any {
        return this.tree.children[this.pos];
    }

    advance() {
        this.pos++;
    }

    finished(): boolean {
        return this.pos >= this.tree.children.length;
    }
}


class ValResult {
    succeeded: boolean;
    errorMessage: string;

    constructor(succeeded: boolean, errorMessage: string) {
        this.succeeded = succeeded;
        this.errorMessage = errorMessage;
    }
}


class ValException {
    valName: string;
    errorMessage: string;

    constructor(valName: string, errorMessage: string) {
        this.valName = valName;
        this.errorMessage = errorMessage;
    }
}


interface Validator {
    name: string;

    validate(iter: TreeIterator): ValResult;
}


class VSeq implements Validator {
    name: string;

    constructor(name: string, private elements: Validator[]) {
        this.name = name;
    }

    validate(iter: TreeIterator): ValResult {
        let i = 0;

        while (!iter.finished() && (i < this.elements.length)) {
            let node = iter.current();
            let v = this.elements[i];

            let res = v.validate(iter);

            if (res.succeeded) {
                i++;
            } else {
                console.log(res.errorMessage);
                return res;
            }
        }

        return new ValResult(true, "");
    }
}


class VHeading implements Validator {
    name: string;

    constructor(name: string, private level: number) {
        this.name = name;
    }

    validate(iter: TreeIterator): ValResult {
        let node = iter.current();

        if (node.type !== "heading") {
            return new ValResult(false, `Found ${node.type} where heading was expected`);
        } else if (node.depth !== this.level) {
            return new ValResult(false, `Heading level was ${node.depth} but ${this.level} was expected`);
        } else {
            iter.advance();
            return new ValResult(true, "");
        }
    }
}


class VParagraph implements Validator {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    validate(iter: TreeIterator): ValResult {
        let node = iter.current();

        if (node.type !== "paragraph") {
            return new ValResult(false, `Found ${node.type} where paragraph was expected`);
        } else {
            iter.advance();
            return new ValResult(true, "");
        }
    }
}

var src = fs.readFileSync("schemaTest.md", "utf8");

var tree = remark().parse(src);

var iter = new TreeIterator(tree);

var seq = new VSeq("Root", [
    new VHeading("Main title", 1),
    new VParagraph("Brief description"),
    new VHeading("Subheading", 2),
    new VParagraph("Body text")
]);

seq.validate(iter);

//console.log(JSON.stringify(tree));



