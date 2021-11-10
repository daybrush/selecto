import Selecto from "./Selecto.svelte";
import { METHODS } from "selecto";

export default /*#__PURE__*/ (() => {
    const prototype = Selecto.prototype;

    if (!prototype) {
        return Selecto;
    }
    METHODS.forEach(name => {
        prototype[name] = function (...args) {
            const self = this.getInstance();
            const result = self[name](...args);

            if (result === self) {
                return this;
            } else {
                return result;
            }
        };
    });
    return Selecto;
})();
