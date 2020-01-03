
import builder from "@daybrush/builder";

export default builder([
    {
        name: "Selecto",
        input: "src/index.umd.ts",
        output: "./dist/selecto.js",
    },
    {
        name: "Selecto",
        input: "src/index.umd.ts",
        output: "./dist/selecto.min.js",
        uglify: true,

    },
    {
        name: "Selecto",
        input: "src/index.umd.ts",
        output: "./dist/selecto.pkgd.js",
        resolve: true,
    },
    {
        name: "Selecto",
        input: "src/index.umd.ts",
        output: "./dist/selecto.pkgd.min.js",
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
        input: "src/index.umd.ts",
        output: "./dist/selecto.cjs.js",
        exports: "default",
        format: "cjs",
    },
]);
