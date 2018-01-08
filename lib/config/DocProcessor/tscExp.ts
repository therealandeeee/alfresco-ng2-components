import * as ts from "typescript";
import * as fs from "fs";
import * as program from "commander";

program.parse(process.argv);

let src = fs.readFileSync(program.args[0], "utf8");

let tsProg = ts.createProgram(program.args, {
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
});


let sourceFiles = tsProg.getSourceFiles();
let checker = tsProg.getTypeChecker();


for (var i = 0; i < sourceFiles.length; i++) {
    if (!sourceFiles[i].isDeclarationFile)
        ts.forEachChild(sourceFiles[i], visit);
}


function visit(node: ts.Node) {
    if (!isNodeExported(node))
        return;
    
    if (ts.isClassDeclaration(node) && node.name) {
        let classDec: ts.ClassDeclaration = node;
        let sourceFile = classDec.getSourceFile();

        console.log(`${classDec.name.escapedText} props:`);

        for (var i = 0; i < classDec.members.length; i++) {
            let member = classDec.members[i];

            if (ts.isPropertyDeclaration(member)) {
                let prop: ts.PropertyDeclaration = member;

                let mods = ts.getCombinedModifierFlags(prop);
                let nonPrivate = (mods & ts.ModifierFlags.Private) === 0;
                let memSymbol = checker.getSymbolAtLocation(prop.name);
                
                if (nonPrivate && memSymbol) {
                    let name = memSymbol.getName();
                    let initializer = "";
                    
                    if (prop.initializer) {
                        initializer = prop.initializer.getText(sourceFile);
                    }
                    
                    if (prop.decorators) {
                        let deco = prop.decorators[0].getText(sourceFile);
                    
                        if (deco.match(/@Input/)) {
                            let doc = ts.displayPartsToString(memSymbol.getDocumentationComment());
                            let propType = checker.typeToString(checker.getTypeOfSymbolAtLocation(memSymbol, memSymbol.valueDeclaration!));
                            console.log(`| ${name} | ${propType} | ${initializer} | ${doc} |`);
                        }
                    }
                }
            }
        }
    }
}




function isNodeExported(node: ts.Node): boolean {
    return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
}