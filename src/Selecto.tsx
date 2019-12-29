import Component from "@egjs/component";
import Dragger, { OnDragStart, OnDrag, OnDragEnd } from "@daybrush/drag";
import styled, { InjectResult } from "css-styled";
import { Properties } from "framework-utils";
import { isObject } from "@daybrush/utils";
import ChildrenDiffer, { diff, ChildrenDiffResult } from "@egjs/children-differ";
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
    private differ = new ChildrenDiffer<HTMLElement | SVGElement>();
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
            selectByClick: true,
            selectOutside: false,
            hitRate: 100,
            continueSelect: false,
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
    private hitTest(
        selectRect: Rect,
        clientX: number,
        clientY: number,
        targets: Array<HTMLElement | SVGElement>,
        rects: Rect[],
    ) {
        const selectByClick = this.options.selectByClick;
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
            const isStart
                = rectLeft <= clientX
                && clientX <= rectRight
                && rectTop <= clientY
                && clientY <= rectBottom;
            const rectSize = (rectRight - rectLeft) * (rectBottom - rectTop);
            const testLeft = Math.max(rectLeft, left);
            const testRight = Math.min(rectRight, right);
            const testTop = Math.max(rectTop, top);
            const testBottom = Math.min(rectBottom, bottom);

            if (selectByClick && isStart) {
                passedTargets.push(targets[i]);
                return;
            }
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
        const selectableTargets: Array<HTMLElement | SVGElement> = [];

        this.options.selectableTargets.forEach(target => {
            if (isObject(target)) {
                selectableTargets.push(target);
            } else {
                const elements = [].slice.call(document.querySelectorAll(target));

                elements.forEach(el => {
                    selectableTargets.push(el);
                });
            }
        });

        return selectableTargets;
    }
    private getSelectedTargets(passedTargets: Array<HTMLElement | SVGElement>) {
        const {
            list,
            prevList,
            added,
            removed,
        } = diff(this.selectedTargets, passedTargets) as ChildrenDiffResult<HTMLElement | SVGElement>;

        return added.map(index => list[index]).concat(removed.map(index => prevList[index]));
    }
    private onDragStart = ({ datas, clientX, clientY }: OnDragStart) => {
        const selectableTargets = this.getSelectableTargets();
        const selectableRects =  selectableTargets.map(target => {
            const rect = target.getBoundingClientRect();
            const { left, top, width, height } = rect;

            return {
                left,
                top,
                right: left + width,
                bottom: top + height,
            };
        });
        datas.selectableTargets = selectableTargets;
        datas.selectableRects = selectableRects;
        datas.startSelectedTargets = this.selectedTargets;

        let firstPassedTargets = this.hitTest({
            left: clientX,
            top: clientY,
            right: clientX,
            bottom: clientY,
        }, clientX, clientY, selectableTargets, selectableRects);

        if (!this.options.continueSelect) {
            this.selectedTargets = [];
        } else {
            firstPassedTargets = this.getSelectedTargets(firstPassedTargets);
        }
        this.select(firstPassedTargets);
        datas.startX = clientX;
        datas.startY = clientY;
        datas.selectedTargets = firstPassedTargets;
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
        }, datas.startX, datas.startY, datas.selectableTargets, datas.selectableRects);
        const selectedTargets = this.getSelectedTargets(passedTargets);

        this.select(selectedTargets);
        datas.selectedTargets = selectedTargets;
    }
    private select(selectedTargets: Array<HTMLElement | SVGElement>) {
        const {
            added,
            removed,
            prevList,
            list,
        } = this.differ.update(selectedTargets);

        if (added.length || removed.length) {
            this.trigger("select", {
                selected: selectedTargets,
                added: added.map(index => list[index]),
                removed: removed.map(index => prevList[index]),
            });
        }
    }
    private onDragEnd = (e: OnDragEnd) => {
        this.target.style.cssText += "display: none;";
        this.selectedTargets = e.datas.selectedTargets;
    }

}

export default interface Selecto extends Component, SelectoProperties { }
