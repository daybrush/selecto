import Component from "@egjs/component";
import Dragger, { OnDragStart, OnDrag, OnDragEnd } from "@daybrush/drag";
import styled, { InjectResult } from "css-styled";
import { Properties } from "framework-utils";
import { isObject } from "@daybrush/utils";
import ChildrenDiffer, { diff } from "@egjs/children-differ";
import { createElement, h } from "./utils";
import { SelectoOptions, Rect, SelectoProperties } from "./types";
import { PROPERTIES } from "./consts";

const injector = styled(`
:host {
    position: absolute;
    display: none;
    border: 1px solid #4af;
    background: rgba(68, 170, 255, 0.5);
    z-index: 100;
}
`);

@Properties(PROPERTIES as any, (prototype, property) => {
    Object.defineProperty(prototype, property, {
        get() {
            return this.options[property];
        },
        set(value) {
            this.options[property] = value;
        },
        enumerable: true,
        configurable: true,
    });
})
export default class Selecto extends Component {
    public options: SelectoOptions;
    private target!: HTMLElement | SVGElement;
    private container!: HTMLElement;
    private dragger!: Dragger;
    private injectResult!: InjectResult;
    private selectedTargets: Array<HTMLElement | SVGElement> = [];
    constructor(
        options: Partial<SelectoOptions> = {},
    ) {
        super();
        this.target = options.target;
        this.container = options.container;
        this.options = {
            target: null,
            container: null,
            selectableTargets: [],
            selectAfterDrag: false,
            hitRate: 100,
            continueSelect: true,
            ...options,
        };
        this.initElement();
    }
    public destroy() {
        this.dragger.unset();
        this.injectResult.destroy();

        this.dragger = null;
        this.injectResult = null;
        this.target = null;
        this.container = null;
        this.options = null;
    }
    private initElement() {
        this.target = createElement(
            <div className={"selecto-selection " + injector.className}></div> as any,
            this.target,
            this.container,
        );

        const target = this.target;

        this.dragger = new Dragger(document.body, {
            container: window,
            dragstart: this.onDragStart,
            drag: this.onDrag,
            dragend: this.onDragEnd,
        });

        this.injectResult = injector.inject(target);
    }
    private hitTest(selectRect: Rect, targets: Array<HTMLElement | SVGElement>, rects: Rect[]) {
        const { left, top, right, bottom } = selectRect;
        const hitRate = this.options.hitRate;
        const passedTargets: Array<HTMLElement | SVGElement> = [];
        rects.forEach((rect, i) => {
            const {
                left: rectLeft,
                top: rectTop,
                right: rectRight,
                bottom: rectBottom,
            } = rect;
            const rectSize = (rectRight - rectLeft) * (rectBottom - rectTop);
            const testLeft = Math.max(rectLeft, left);
            const testRight = Math.min(rectRight, right);
            const testTop = Math.max(rectTop, top);
            const testBottom = Math.min(rectBottom, bottom);

            if (testRight < testLeft || testBottom < testTop) {
                return;
            }
            const rate = Math.round((testRight - testLeft) * (testBottom - testTop) / rectSize * 100);

            if (rate >= hitRate) {
                passedTargets.push(targets[i]);
            }
        });

        return passedTargets;
    }
    private getSelectableTargets() {
        const selectTargets: Array<HTMLElement | SVGElement> = [];

        this.options.selectableTargets.forEach(target => {
            if (isObject(target)) {
                selectTargets.push(target);
            } else {
                const elements = [].slice.call(document.querySelectorAll(target));

                elements.forEach(el => {
                    selectTargets.push(el);
                });
            }
        });

        return selectTargets;
    }
    private getSelectedTargets(passedTargets: Array<HTMLElement | SVGElement>) {
        const {
            list,
            prevList,
            added,
            removed,
        } = diff(this.selectedTargets, passedTargets);

        return added.map(index => list[index]).concat(removed.map(index => prevList[index]));
    }
    private onDragStart = ({ datas, clientX, clientY }: OnDragStart) => {
        const selectTargets = this.getSelectableTargets();

        if (!this.options.continueSelect) {
            this.selectedTargets = [];
        }
        datas.childrenDiffer = new ChildrenDiffer(this.selectedTargets);
        datas.selectTargets = selectTargets;
        datas.selectRects = selectTargets.map(target => {
            const rect = target.getBoundingClientRect();
            const { left, top, width, height } = rect;

            return {
                left,
                top,
                right: left + width,
                bottom: top + height,
            };
        });
        datas.startX = clientX;
        datas.startY = clientY;
        datas.selectedTargets = this.selectedTargets;
        this.target.style.cssText += `left:${clientX}px;top:${clientY}px`;
    }
    private onDrag = ({
        distX,
        distY,
        datas,
    }: OnDrag) => {
        const { startX, startY } = datas;
        const tx = Math.min(0, distX);
        const ty = Math.min(0, distY);
        const width = Math.abs(distX);
        const height = Math.abs(distY);

        this.target.style.cssText
            += `display: block;`
            + `transform: translate(${tx}px, ${ty}px);`
            + `width:${width}px;height:${height}px;`;

        const left = startX + tx;
        const top = startY + ty;
        const passedTargets = this.hitTest({
            left,
            top,
            right: left + width,
            bottom: top + height,
        }, datas.selectTargets, datas.selectRects);
        const selectedTargets = this.getSelectedTargets(passedTargets);

        const childrenDiffer: ChildrenDiffer = datas.childrenDiffer;
        const {
            added,
            removed,
            prevList,
            list,
        } = childrenDiffer.update(selectedTargets);

        if (added.length || removed.length) {
            this.trigger("select", {
                selected: selectedTargets,
                added: added.map(index => list[index]),
                removed: removed.map(index => prevList[index]),
            });
        }

        datas.selectedTargets = selectedTargets;
    }
    private onDragEnd = (e: OnDragEnd) => {
        this.target.style.cssText += "display: none;";
        this.selectedTargets = e.datas.selectedTargets;
    }

}

export default interface Selecto extends Component, SelectoProperties { }
