import * as fs from "fs";
import * as remark from "remark";


class TreeNodeIterator {
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

    copy() {
        return new TreeNodeIterator(this.tree);
    }

    assignFrom(other: TreeNodeIterator) {
        this.tree = other.tree;
        this.pos = other.pos;
    }
}


class ValException {
    valName: string;
    errorMessage: string;

    constructor(valName: string, errorMessage: string) {
        this.valName = valName;
        this.errorMessage = errorMessage;
    }

    toString() {
        return `Validation failed at "${this.valName}": ${this.errorMessage}`;
    }
}


interface Validator {
    name: string;

    validate(iter: TreeNodeIterator);
}


class VSeq implements Validator {
    name: string;

    constructor(name: string, private elements: Validator[]) {
        this.name = name;
    }

    validate(iter: TreeNodeIterator) {
        let savedIter = iter.copy();
        try {
            for (var i = 0; !iter.finished() && (i < this.elements.length); i++) {
                this.elements[i].validate(iter);
            }
        } catch (e) {
            iter.assignFrom(savedIter);
            throw e;
        }
    }
}


class VOpt implements Validator {
    name: string;

    constructor(name: string, private childValidator: Validator) {
        this.name = name;
    }

    validate(iter: TreeNodeIterator) {
        try {
            this.childValidator.validate(iter);
        } catch (e) {

        }
    }
}

class VHeading implements Validator {
    name: string;

    constructor(name: string, private level: number) {
        this.name = name;
    }

    validate(iter: TreeNodeIterator) {
        let node = iter.current();

        if (node.type !== "heading") {
            throw new ValException(this.name, `Found ${node.type} where heading was expected`);
        } else if (node.depth !== this.level) {
            throw new ValException(this.name, `Heading level was ${node.depth} but ${this.level} was expected`);
        }
        
        iter.advance();
    }
}


class VParagraph implements Validator {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    validate(iter: TreeNodeIterator) {
        let node = iter.current();

        if (node.type !== "paragraph") {
            throw new ValException(this.name, `Found ${node.type} where paragraph was expected`);
        }

        iter.advance();
    }
}


class VList implements Validator {
    name: string;

    constructor(name: string, private ordered: boolean = false) {
        this.name = name;
    }

    validate(iter: TreeNodeIterator) {
        let node = iter.current();

        if (node.type !== "list") {
            throw new ValException(this.name, `Found ${node.type} where list was expected`);
        } else if (node.ordered && !this.ordered) {
            throw new ValException(this.name, `Ordered list was found but unordered list was expected`);
        } else if (!node.ordered && this.ordered) {
            throw new ValException(this.name, `Unordered list was found but ordered list was expected`);
        }

        iter.advance();
    }
}


class MDValidator {
    iter: TreeNodeIterator;

    constructor(private rootVal: Validator) {}

    validate(tree: any) {
        this.iter = new TreeNodeIterator(tree);
        this.rootVal.validate(this.iter);
    }
}


var src = fs.readFileSync("schemaTest.md", "utf8");

var tree = remark().parse(src);

//var iter = new TreeNodeIterator(tree);

let v = new MDValidator(
    new VSeq("Root", [
        new VHeading("Main title", 1),
        new VParagraph("Brief description"),
        new VOpt("",
            new VSeq("Contents section", [
                new VHeading("Contents heading", 2),
                new VList("Contents list")
            ])
        ),
        new VHeading("Subheading", 2),
        new VParagraph("Body text")
    ])
);

v.validate(tree);
//seq.validate(iter);

//console.log(JSON.stringify(tree));



