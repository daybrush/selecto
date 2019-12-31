import * as React from "react";
import VanillaSelecto, {
    CLASS_NAME,
    OPTIONS,
    SelectoOptions,
    PROPERTIES,
    SelectoProperties,
} from "selecto";
import { ref } from "framework-utils";
import { IObject } from "@daybrush/utils";

export default class Selecto extends React.PureComponent<Partial<SelectoOptions>> {
    private selecto!: VanillaSelecto;
    private selectionElement!: HTMLElement;
    public render() {
        return <div className={CLASS_NAME} ref={ref(this, "selectionElement")}></div>;
    }
    public componentDidMount() {
        const props = this.props;
        const options: Partial<SelectoOptions> = {};
        const events: IObject<any> = {};

        OPTIONS.forEach(name => {
            if (name in props) {
                (options as any)[name] = props[name];
            }
        });
        this.selecto = new VanillaSelecto({
            ...options,
            target: this.selectionElement,
        });
    }
    public componentDidUpdate(prevProps: Partial<SelectoProperties>) {
        const props = this.props;
        const selecto = this.selecto;

        PROPERTIES.forEach(name => {
            if (prevProps[name] !== props[name]) {
                (selecto as any)[name] = props[name];
            }
        });
    }
    public componentWillUnmount() {
        this.selecto.destroy();
    }
}
