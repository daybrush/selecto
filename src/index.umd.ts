import Selecto, * as modules from "./Selecto";

for (const name in modules) {
    (Selecto as any)[name] = modules[name];
}

export default Selecto;
