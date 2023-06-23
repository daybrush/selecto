import { SELECTO_PROPS } from "../../template/selectoProps";
import { add } from "../../template/story";


export default {
    title: "Selecto With Moveable",
};

export const MoveableChangeMoveableTargets = add("Change the Moveable targets by selecting it.", {
    app: require("./ReactMoveableApp").default,
    path: require.resolve("./ReactMoveableApp"),
    argsTypes: SELECTO_PROPS,
});


export const MoveablRealTimeTargets = add("Select Moveable targets in real time.", {
    app: require("./ReactMoveableRealTimeApp").default,
    path: require.resolve("./ReactMoveableRealTimeApp"),
    argsTypes: SELECTO_PROPS,
});



export const MoveablGroupUnGroupTargets = add("Select Moveable targets with Group & Ungroup", {
    app: require("./ReactMoveableGroupUngroupApp").default,
    path: require.resolve("./ReactMoveableGroupUngroupApp"),
});
