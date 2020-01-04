import { LitElement, html, customElement, property } from "lit-element";
import VanillaSelecto, { SelectoOptions, OPTIONS, CLASS_NAME, EVENTS, PROPERTIES } from "selecto";
import { Properties } from "framework-utils";

@Properties(OPTIONS as any, (prototype, name) => {
    const type = OPTION_TYPES[name];
    property()(prototype, name);
})
@customElement("lit-selecto")
export class LitSelecto extends LitElement {
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
                const result = this.dispatchEvent(new CustomEvent(name, {
                    detail: { ...e },
                }));

                console.log(result);
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

declare global {
    interface HTMLElementTagNameMap {
        "lit-selecto": LitSelecto;
    }
}
