import Component from "@egjs/component";
import Dragger from "@daybrush/drag";
import styled from "css-styled";
import { prefixNames, prefixCSS } from "framework-utils";
import { SelectoOptions } from "./types";

const injector = styled(``);
export default class Selecto extends Component {
    private target!: HTMLElement;
    private container!: HTMLElement;
    constructor(
        public options: Partial<SelectoOptions> = {},
    ) {
        super();
        this.target = options.target;
        this.container = options.container;
    }
    private initElement() {
        this.target = createElement("div", this.target, this.container);
        this.target.className = prefix()


        if (this.container) {

        }
    }
}
