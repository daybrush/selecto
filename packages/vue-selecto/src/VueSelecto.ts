import VanillaSelecto, {
    SelectoOptions,
    OPTIONS,
    EVENTS,
    PROPERTIES,
    CLASS_NAME,
    METHODS,
    SelectoProperties,
    SelectoMethods
} from "selecto";
import { Component, Vue, Prop } from "vue-property-decorator";
import { CreateElement } from "vue";
import { Properties, withMethods, MethodInterface } from "framework-utils";
import { isUndefined, IObject } from "@daybrush/utils";

const watches: IObject<any> = {};

PROPERTIES.forEach(name => {
    watches[name] = function(this: VueSelecto, val: any) {
        this.updateProperty(name, val);
    };
});

@Component({ name: "selecto", watch: watches })
@Properties(OPTIONS as any, (prototype, name) => {
    Prop()(prototype, name);
})
export default class VueSelecto extends Vue {
    @withMethods(METHODS as any)
    private selecto!: VanillaSelecto;
    public render(h: CreateElement) {
        return h("div", {
            class: CLASS_NAME,
            ref: "target"
        });
    }
    public mounted() {
        const props = this.$props;
        const options: Partial<SelectoOptions> = {};

        OPTIONS.forEach(name => {
            const value = props[name];
            if (!isUndefined(value)) {
                options[name] = value;
            }
        });

        this.selecto = new VanillaSelecto({
            ...options,
            target: this.$refs.target as any
        });

        const selecto = this.selecto;

        EVENTS.forEach((name, i) => {
            selecto.on(name, e => {
                this.$emit(name, { ...e });
            });
        });
    }
    public updateProperty(name: string, value: any) {
        const selecto = this.selecto;

        (selecto as any)[name] = value;
    }
    public beforeDestroy() {
        this.selecto.destroy();
    }
}

export default interface VueSelecto
    extends SelectoProperties,
        MethodInterface<SelectoMethods, VanillaSelecto, VueSelecto> {}
