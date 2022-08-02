const ts = require("typescript");
const path = require("path");
const { writeFileSync } = require("fs");
const { OPTIONS, EVENTS } = require("../packages/selecto/dist/selecto.cjs");

const staticConsts = {
  "ANGULAR_SELECTO_INPUTS": OPTIONS,
  "ANGULAR_SELECTO_OUTPUTS": EVENTS,
};
const paths = [
  path.resolve(__dirname, "../packages/ngx-selecto/projects/ngx-selecto/src/public-api.ts"),
]

const program = ts.createProgram(paths, {
  target: ts.ScriptTarget.ES5,
  module: ts.ModuleKind.CommonJS
});

let checker = program.getTypeChecker();
let replacers = [];

function visit(node) {
  if (node.kind === ts.SyntaxKind.FirstStatement) {
    node.declarationList.declarations.forEach(subNode => visit(subNode));
  }
  if (node.kind === ts.SyntaxKind.VariableDeclaration) {
    const symbol = checker.getSymbolAtLocation(node.name);
    const propertyName = symbol.escapedName;
    if (staticConsts[propertyName]) {

        const value = JSON.stringify(staticConsts[propertyName]);
      replacers.push({
        range: [node.name.end, node.initializer.end],
        text: `: ${value} = ${value}`,
      });
    }
  }
}

// Visit every sourceFile in the program
for (const sourceFile of program.getSourceFiles()) {
  if (sourceFile.isDeclarationFile) {
    continue;
  }
  replacers = [];
  ts.forEachChild(sourceFile, visit);

  let source = sourceFile.text;
  replacers.sort((a, b) => {
    return b.range[0] - a.range[0];
  });
  replacers.forEach(({ range, text }) => {
    source = `${source.substring(0, range[0])}${text}${source.substring(range[1])}`;
  });
  if (replacers.length) {
    writeFileSync(sourceFile.fileName, source, { encoding: "utf8" });
  }
}
