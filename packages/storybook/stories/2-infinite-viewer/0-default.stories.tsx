import { SELECTO_PROPS } from "../../template/selectoProps";
import { add } from "../../template/story";


export default {
    title: "Selecto with Infinite Viewer",
};

export const InfiniteViewer = add("Select in the Infinite Scroll Viewer.", {
    app: require("./ReactInfiniteViewerApp").default,
    path: require.resolve("./ReactInfiniteViewerApp"),
    argsTypes: SELECTO_PROPS,
});
