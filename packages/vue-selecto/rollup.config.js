const buildHelper = require("@daybrush/builder");


const defaultOptions = {
    sourcemap: true,
    input: "./src/index.ts",
    exports: "named",
};
export default buildHelper([
    {
        ...defaultOptions,
        format: "es",
        output: "./dist/selecto.esm.js",
    },
    {
        ...defaultOptions,
        format: "cjs",
        output: "./dist/selecto.cjs.js",
    },
]);
