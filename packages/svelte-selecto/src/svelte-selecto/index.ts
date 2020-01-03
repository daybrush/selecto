import Selecto from "./Selecto.svelte";
import { Properties } from "framework-utils";
import { METHODS } from "selecto";

export default /*#__PURE__*/ Properties(METHODS as any, (prototype, propertyName) => {
    // tslint:disable-next-line: only-arrow-functions
    prototype[propertyName] = function(...args: any[]) {
        const self = this.$$ctx.selecto;
        const result = self[name](...args);

        if (result === self) {
            return this;
        } else {
            return result;
        }
    };
})(Selecto.prototype);
