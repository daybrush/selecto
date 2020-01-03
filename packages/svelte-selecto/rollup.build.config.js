import buildHelper from "@daybrush/builder";
import svelte from 'rollup-plugin-svelte';

const defaultOptions = {
    tsconfig: "",
    input: './src/svelte-selecto/index.ts',
    commonjs: true,
    external: {
        "svelte": "svelte",
    },
    plugins: [
        svelte(),
    ],
}
export default buildHelper([
    {
        ...defaultOptions,
        output: "dist/selecto.cjs.js",
        format: "cjs",
    },
    {
        ...defaultOptions,
        output: "dist/selecto.esm.js",
        format: "es",
    },
]);
