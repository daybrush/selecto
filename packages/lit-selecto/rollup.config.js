const buildHelper = require("@daybrush/builder");

const defaultOptions = {
  input: "./src/index.ts",
  tsconfig: "tsconfig.build.json",
  sourcemap: true,
};
export default buildHelper([
  {
    ...defaultOptions,
    format: "es",
    output: "./dist/selecto.esm.js",
    exports: "named",
  },
  {
    ...defaultOptions,
    format: "cjs",
    output: "./dist/selecto.cjs.js",
    exports: "named",
  },
  {
    ...defaultOptions,
    format: "umd",
    name: "UMD",
    output: "./dist/selecto.umd.js",
    exports: "named",
    resolve: true,
  },
]);
