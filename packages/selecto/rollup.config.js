
import builder from "@daybrush/builder";

export default builder([
    {
        name: "Selecto",
        input: "src/index.umd.ts",
        output: "./dist/selecto.js",
        resolve: true,
    },
    {
        name: "Selecto",
        input: "src/index.umd.ts",
        output: "./dist/selecto.min.js",
        resolve: true,
        uglify: true,

    },
    {
        input: "src/index.ts",
        output: "./dist/selecto.esm.js",
        exports: "named",
        format: "es",
    },
    {
        input: "src/index.cjs.ts",
        output: "./dist/selecto.cjs.js",
        exports: "named",
        format: "cjs",
    },
]);
