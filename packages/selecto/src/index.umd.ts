import Selecto, * as modules from "./index";

for (const name in modules) {
    (Selecto as any)[name] = modules[name];
}

export default Selecto;
