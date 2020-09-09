import builder from "@daybrush/builder";
const preact = require("rollup-plugin-preact");


const defaultOptions = {
    tsconfig: "tsconfig.build.json",
    external: {
        "@daybrush/utils": "utils",
        "gesto": "Gesto",
        "preact": "Preact",
        "preact/compat": "preact/compat",
        "preact-compat": "preact-compat",
        "css-styled": "css-styled",
        "preact-ruler": "preact-ruler",
        "framework-utils": "framework-utils",
        "selecto": "selecto",
        "@egjs/agent": "eg.Agent",
        "@egjs/children-differ": "eg.ChildrenDiffer",
    },
    exports: "named",
    plugins: [
        preact({
            noPropTypes: false,
            noEnv: false,
            noReactIs: false,
            usePreactX: true,
            aliasModules: {
                "react-ruler": "preact-ruler",
            },
        }),
    ],
    sourcemap: false,
};

export default builder([
    {
        ...defaultOptions,
        input: "src/preact-selecto/index.esm.ts",
        output: "./dist/selecto.esm.js",
        format: "es",
    },
    {
        ...defaultOptions,
        input: "src/preact-selecto/index.umd.ts",
        output: "./dist/selecto.cjs.js",
        format: "cjs",
        exports: "default",
    },
]);
