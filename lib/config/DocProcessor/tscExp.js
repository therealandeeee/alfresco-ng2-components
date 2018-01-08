"use strict";
exports.__esModule = true;
var ts = require("typescript");
var fs = require("fs");
var program = require("commander");
program.parse(process.argv);
var src = fs.readFileSync(program.args[0], "utf8");
var tsProg = ts.createProgram(program.args, {
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
});
var sourceFiles = tsProg.getSourceFiles();
var checker = tsProg.getTypeChecker();
for (var i = 0; i < sourceFiles.length; i++) {
    if (!sourceFiles[i].isDeclarationFile)
        ts.forEachChild(sourceFiles[i], visit);
}
function visit(node) {
    if (!isNodeExported(node))
        return;
    if (ts.isClassDeclaration(node) && node.name) {
        var classDec = node;
        var sourceFile = classDec.getSourceFile();
        console.log(classDec.name.escapedText + " props:");
        for (var i = 0; i < classDec.members.length; i++) {
            var member = classDec.members[i];
            if (ts.isPropertyDeclaration(member)) {
                var prop = member;
                var mods = ts.getCombinedModifierFlags(prop);
                var nonPrivate = (mods & ts.ModifierFlags.Private) === 0;
                var memSymbol = checker.getSymbolAtLocation(prop.name);
                if (nonPrivate && memSymbol) {
                    var name_1 = memSymbol.getName();
                    var initializer = "";
                    if (prop.initializer) {
                        initializer = prop.initializer.getText(sourceFile);
                    }
                    if (prop.decorators) {
                        var deco = prop.decorators[0].getText(sourceFile);
                        if (deco.match(/@Input/)) {
                            var doc = ts.displayPartsToString(memSymbol.getDocumentationComment());
                            var propType = checker.typeToString(checker.getTypeOfSymbolAtLocation(memSymbol, memSymbol.valueDeclaration));
                            console.log("| " + name_1 + " | " + propType + " | " + initializer + " | " + doc + " |");
                        }
                    }
                }
            }
        }
    }
}
function isNodeExported(node) {
    return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile);
}
