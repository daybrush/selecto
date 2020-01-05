import VanillaSelecto, { SelectoOptions, OPTIONS, OPTION_TYPES, EVENTS, PROPERTIES } from 'selecto';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { CreateElement, VNodeData } from 'vue';
import { Properties } from 'framework-utils';


@Properties(OPTIONS as any, (prototype, name) => {
    Prop({ type: (OPTION_TYPES as any)[name], required: false })(prototype, name);
})
@Component({})
export default class VueSelecto extends Vue {
    private selecto!: VanillaSelecto;
    public render(h: CreateElement) {
        return h('div', {});
    }
    public mounted() {
        const options: Partial<SelectoOptions> = {};

        OPTIONS.forEach((name) => {
            options[name] = this.$props[name];
        });

        this.selecto = new VanillaSelecto({
            ...options,
            target: this.$refs.target as any,
        });

        const selecto = this.selecto;

        EVENTS.forEach((name, i) => {
            selecto.on(name, (e) => {
                this.$emit(name, { ...e });
            });
        });
    }
    public updated() {
    }
    public beforeDestroy() {
        this.selecto.destroy();
    }
}
