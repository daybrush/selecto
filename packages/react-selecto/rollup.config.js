import builder from "@daybrush/builder";

const defaultOptions = {
    tsconfig: "tsconfig.build.json",
};

export default builder([
    {
        ...defaultOptions,
        input: "src/react-selecto/index.ts",
        output: "./dist/selecto.esm.js",
        format: "es",
        exports: "named",
    },
    {
        ...defaultOptions,
        input: "src/react-selecto/index.umd.ts",
        output: "./dist/selecto.cjs.js",
        format: "cjs",
        exports: "default",
    },
]);
