const fs = require("fs");
const wastParser = require("@webassemblyjs/wast-parser");

const source = fs.readFileSync("./src/webGL/math.wat", "utf8");

const ast = wastParser.parse(source);
console.log(source);
console.log(ast);
