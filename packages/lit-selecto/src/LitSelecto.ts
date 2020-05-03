import { LitElement, html, customElement, property } from "lit-element";
import VanillaSelecto, { SelectoOptions, OPTIONS, OPTION_TYPES, EVENTS, PROPERTIES, SelectoMethods, METHODS } from "selecto";
import { Properties, withMethods, MethodInterface } from "framework-utils";
import { camelize } from "@daybrush/utils";

@Properties(OPTIONS as any, (prototype, name) => {
    property({ type: OPTION_TYPES[name] })(prototype, name);
})
@customElement("lit-selecto")
export class LitSelecto extends LitElement {
    @withMethods(METHODS as any, { click: "clickSelecto" })
    private selecto!: VanillaSelecto;
    public firstUpdated() {
        const options: Partial<SelectoOptions> = {};

        OPTIONS.forEach(name => {
            options[name as any] = this[name];
        });

        this.selecto = new VanillaSelecto({
            ...options,
            target: this,
            dragContainer: options.dragContainer || this.parentElement as any,
        });

        const selecto = this.selecto;

        EVENTS.forEach((name, i) => {
            selecto.on(name, e => {
                const result = this.dispatchEvent(new CustomEvent(camelize(`lit ${name}`), {
                    detail: { ...e },
                }));

                if (result === false) {
                    (e as any).stop();
                }
            });
        });
    }
    public updated(changedProperties) {
        const selecto = this.selecto;
        changedProperties.forEach((oldValue, propName) => {
            if (PROPERTIES.indexOf(propName)) {
                selecto[propName] = this[propName];
            }
        });
    }
    public disconnectedCallback() {
        super.disconnectedCallback();
        this.selecto.destroy();
    }
}
export interface LitSelecto extends SelectoOptions, MethodInterface<SelectoMethods, VanillaSelecto, LitSelecto> { }

declare global {
    interface HTMLElementTagNameMap {
        "lit-selecto": LitSelecto;
    }
}
