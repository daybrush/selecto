const buildHelper = require("@daybrush/builder");


const defaultOptions = {
  sourcemap: true,
};
export default buildHelper([
  {
    ...defaultOptions,
    format: "es",
    input: "./src/index.ts",
    output: "./dist/selecto.esm.js",
    exports: "named",
  },
  {
    ...defaultOptions,
    format: "cjs",
    input: "./src/index.ts",
    output: "./dist/selecto.cjs.js",
    exports: "named",
  },
]);
