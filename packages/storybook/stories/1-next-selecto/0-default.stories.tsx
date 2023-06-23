import { SELECTO_PROPS } from "../../template/selectoProps";
import { add } from "../../template/story";


export default {
    title: "Selecto",
};

export const InfiniteViewer = add("Select in the inner scroll area.", {
    app: require("./ReactInnerScrollApp").default,
    path: require.resolve("./ReactInnerScrollApp"),
    argsTypes: SELECTO_PROPS,
});
