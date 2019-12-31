import builder from "@daybrush/builder";

const defaultOptions = {
    tsconfig: "tsconfig.build.json",
};

export default builder([
    {
        ...defaultOptions,
        input: "src/react-selecto/index.ts",
        output: "./dist/selecto.esm.js",
        visualizer: true,
        format: "es",
        exports: "default",
    },
    {
        ...defaultOptions,
        input: "src/react-selecto/index.umd.ts",
        output: "./dist/selecto.cjs.js",
        format: "cjs",
    },
]);
