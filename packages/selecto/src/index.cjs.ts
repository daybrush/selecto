import Selecto, * as modules from "./index";

for (const name in modules) {
    (Selecto as any)[name] = (modules as any)[name];
}

module.exports = Selecto;
export * from "./index";
export default Selecto;
