import Component from "@egjs/component";
import Dragger from "@daybrush/drag";
import { SelectoOptions } from "./types";

export default class Selecto extends Component {
    constructor(
        private container: HTMLElement,
        public options: Partial<SelectoOptions> = {},
    ) {
        super();
    }
}
