const buildHelper = require("@daybrush/builder");
const vuePlugin = require("rollup-plugin-vue");

const defaultOptions = {
    sourcemap: true,
    input: "./src/index.ts",
    exports: "named",
    plugins: [
        vuePlugin(),
    ]
};
export default buildHelper([
    {
        ...defaultOptions,
        format: "es",
        output: "./dist/selecto.esm.js",
    },
    {
        ...defaultOptions,
        input: "./src/index.umd.ts",
        exports: "default",
        format: "cjs",
        output: "./dist/selecto.cjs.js",
    },
]);
