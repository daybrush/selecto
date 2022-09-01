import EventEmitter from "@scena/event-emitter";
import Gesto, { OnDrag, OnDragStart } from "gesto";
import { InjectResult } from "css-styled";
import { Properties } from "framework-utils";
import {
    isObject,
    camelize,
    IObject,
    addEvent,
    removeEvent,
    isArray,
    isString,
    between,
    splitUnit,
} from "@daybrush/utils";
import { diff } from "@egjs/children-differ";
import DragScroll from "@scena/dragscroll";
import KeyController, { getCombi } from "keycon";
import {
    getAreaSize,
    getOverlapPoints,
    isInside,
    fitPoints,
} from "overlap-area";
import { getDistElementMatrix, calculateMatrixDist, createMatrix } from "css-to-mat";
import {
    createElement,
    h,
    getClient,
    diffValue,
    getRect,
    getDefaultElementRect,
    passTargets,
    elementFromPoint,
    filterDuplicated,
} from "./utils";
import {
    SelectoOptions,
    SelectoProperties,
    OnDragEvent,
    SelectoEvents,
    Rect,
    BoundContainer,
    InnerGroup,
} from "./types";
import { PROPERTIES, injector, CLASS_NAME } from "./consts";

/**
 * Selecto.js is a component that allows you to select elements in the drag area using the mouse or touch.
 * @sort 1
 * @extends EventEmitter
 */
@Properties(PROPERTIES as any, (prototype, property) => {
    const attributes: IObject<any> = {
        enumerable: true,
        configurable: true,
        get() {
            return this.options[property];
        },
    };
    const getter = camelize(`get ${property}`);
    if (prototype[getter]) {
        attributes.get = function get() {
            return this[getter]();
        };
    } else {
        attributes.get = function get() {
            return this.options[property];
        };
    }
    const setter = camelize(`set ${property}`);
    if (prototype[setter]) {
        attributes.set = function set(value) {
            this[setter](value);
        };
    } else {
        attributes.set = function set(value) {
            this.options[property] = value;
        };
    }
    Object.defineProperty(prototype, property, attributes);
})
class Selecto extends EventEmitter<SelectoEvents> {
    public options: SelectoOptions;
    private target!: HTMLElement | SVGElement;
    private dragContainer!: Element | Window | Element[];
    private container!: HTMLElement;
    private gesto!: Gesto;
    private injectResult!: InjectResult;
    private selectedTargets: Array<HTMLElement | SVGElement> = [];
    private dragScroll: DragScroll = new DragScroll();
    private keycon!: KeyController;
    private _keydownContinueSelect: boolean;
    private _keydownContinueSelectWithoutDeselection: boolean;
    /**
     *
     */
    constructor(options: Partial<SelectoOptions> = {}) {
        super();
        this.target = options.portalContainer;
        let container = options.container;
        this.options = {
            portalContainer: null,
            container: null,
            dragContainer: null,
            selectableTargets: [],
            selectByClick: true,
            selectFromInside: true,
            clickBySelectEnd: false,
            hitRate: 100,
            continueSelect: false,
            continueSelectWithoutDeselect: false,
            toggleContinueSelect: null,
            toggleContinueSelectWithoutDeselect: null,
            keyContainer: null,
            scrollOptions: undefined,
            checkInput: false,
            preventDefault: false,
            boundContainer: false,
            preventDragFromInside: true,
            dragCondition: null,
            rootContainer: null,
            getElementRect: getDefaultElementRect,
            cspNonce: "",
            ratio: 0,
            ...options,
        };
        const portalContainer = this.options.portalContainer;

        if (portalContainer) {
            container = portalContainer.parentElement;
        }
        this.container = container || document.body;
        this.initElement();
        this.initDragScroll();
        this.setKeyController();
    }
    /**
     * You can set the currently selected targets.
     *
     */
    public setSelectedTargets(
        selectedTargets: Array<HTMLElement | SVGElement>
    ): this {
        this.selectedTargets = selectedTargets;

        return this;
    }
    /**
     * You can get the currently selected targets.
     */
    public getSelectedTargets(): Array<HTMLElement | SVGElement> {
        return this.selectedTargets;
    }
    /**
     * `OnDragStart` is triggered by an external event.
     * @param - external event
     * @example
     * import Selecto from "selecto";
     *
     * const selecto = new Selecto();
     *
     * window.addEventListener("mousedown", e => {
     *   selecto.triggerDragStart(e);
     * });
     */
    public triggerDragStart(e: MouseEvent | TouchEvent) {
        this.gesto.triggerDragStart(e);
        return this;
    }
    /**
     * Destroy elements, properties, and events.
     */
    public destroy(): void {
        this.off();
        this.keycon && this.keycon.destroy();
        this.gesto.unset();
        this.injectResult.destroy();
        removeEvent(document, "selectstart", this._onDocumentSelectStart);

        this.keycon = null;
        this.gesto = null;
        this.injectResult = null;
        this.target = null;
        this.container = null;
        this.options = null;
    }
    public getElementPoints(target: HTMLElement | SVGElement) {
        const getElementRect = this.getElementRect || getDefaultElementRect;
        const info = getElementRect(target);
        const points = [info.pos1, info.pos2, info.pos4, info.pos3];

        if (getElementRect !== getDefaultElementRect) {
            const rect = target.getBoundingClientRect();

            return fitPoints(points, rect);
        }
        return points;
    }
    /**
     * Get all elements set in `selectableTargets`.
     */
    public getSelectableElements() {
        const selectableElements: Array<HTMLElement | SVGElement> = [];

        this.options.selectableTargets.forEach((target) => {
            if (isObject(target)) {
                selectableElements.push(target);
            } else {
                const elements = [].slice.call(
                    document.querySelectorAll(target)
                );

                elements.forEach((el) => {
                    selectableElements.push(el);
                });
            }
        });

        return selectableElements;
    }
    /**
     * If scroll occurs during dragging, you can manually call this method to check the position again.
     */
    public checkScroll() {
        if (!this.gesto.isFlag()) {
            return;
        }
        const scrollOptions = this.scrollOptions;

        // If it is a scrolling position, pass drag
        scrollOptions?.container && this.dragScroll.checkScroll({
            inputEvent: this.gesto.getCurrentEvent(),
            ...scrollOptions,
        });
    }
    /**
     * Find for selectableTargets again during drag event
     */
    public findSelectableTargets(data: any = this.gesto.getEventData()) {
        const selectableTargets = this.getSelectableElements();
        const selectablePoints = selectableTargets.map(
            (target) => this.getElementPoints(target),
        );
        data.selectableTargets = selectableTargets;
        data.selectablePoints = selectablePoints;
        this._refreshGroups(data);
    }
    /**
     * External click or mouse events can be applied to the selecto.
     * @params - Extenal click or mouse event
     * @params - Specify the clicked target directly.
     */
    public clickTarget(
        e: MouseEvent | TouchEvent,
        clickedTarget?: Element
    ): this {
        const { clientX, clientY } = getClient(e);
        const dragEvent = {
            data: {
                selectFlag: false,
            },
            clientX,
            clientY,
            inputEvent: e,
            isClick: true,
            stop: () => {
                return false;
            },
        } as any;
        if (this._onDragStart(dragEvent, clickedTarget)) {
            this._onDragEnd(dragEvent);
        }
        return this;
    }
    private setKeyController() {
        const { keyContainer, toggleContinueSelect, toggleContinueSelectWithoutDeselect } = this.options;

        if (this.keycon) {
            this.keycon.destroy();
            this.keycon = null;
        }
        if (toggleContinueSelect || toggleContinueSelectWithoutDeselect) {
            this.keycon = new KeyController(keyContainer || window);
            this.keycon
                .keydown(this._onKeyDown)
                .keyup(this._onKeyUp)
                .on("blur", this._onBlur);
        }
    }
    private setKeyEvent() {
        const { toggleContinueSelect, toggleContinueSelectWithoutDeselect } = this.options;
        if ((!toggleContinueSelect && !toggleContinueSelectWithoutDeselect) || this.keycon) {
            return;
        }
        this.setKeyController();
    }
    // with getter, setter property
    private setKeyContainer(keyContainer: HTMLElement | Document | Window) {
        const options = this.options;

        diffValue(options.keyContainer, keyContainer, () => {
            options.keyContainer = keyContainer;

            this.setKeyController();
        });
    }
    private getContinueSelect() {
        const {
            continueSelect,
            toggleContinueSelect,
        } = this.options;

        if (!toggleContinueSelect || !this._keydownContinueSelect) {
            return continueSelect;
        }
        return !continueSelect;
    }
    private getContinueSelectWithoutDeselect() {
        const {
            continueSelectWithoutDeselect,
            toggleContinueSelectWithoutDeselect,
        } = this.options;

        if (!toggleContinueSelectWithoutDeselect || !this._keydownContinueSelectWithoutDeselection) {
            return continueSelectWithoutDeselect;
        }
        return !continueSelectWithoutDeselect;
    }
    private setToggleContinueSelect(
        toggleContinueSelect: string[][] | string[] | string
    ) {
        const options = this.options;

        diffValue(options.toggleContinueSelect, toggleContinueSelect, () => {
            options.toggleContinueSelect = toggleContinueSelect;

            this.setKeyEvent();
        });
    }
    private setToggleContinueSelectWithoutDeselect(
        toggleContinueSelectWithoutDeselect: string[][] | string[] | string
    ) {
        const options = this.options;

        diffValue(options.toggleContinueSelectWithoutDeselect, toggleContinueSelectWithoutDeselect, () => {
            options.toggleContinueSelectWithoutDeselect = toggleContinueSelectWithoutDeselect;

            this.setKeyEvent();
        });
    }
    private setPreventDefault(value: boolean) {
        this.gesto.options.preventDefault = value;
    }
    private setCheckInput(value: boolean) {
        this.gesto.options.checkInput = value;
    }
    private initElement() {
        this.target = createElement(
            (<div className={CLASS_NAME}></div>) as any,
            this.target,
            this.container
        );

        const target = this.target;

        const {
            dragContainer,
            checkInput,
            preventDefault,
            preventClickEventOnDragStart,
            preventClickEventOnDrag,
            preventRightClick = true,
        } = this.options;
        this.dragContainer =
            typeof dragContainer === "string"
                ? [].slice.call(document.querySelectorAll(dragContainer))
                : dragContainer || (this.target.parentNode as any);
        this.gesto = new Gesto(this.dragContainer, {
            checkWindowBlur: true,
            container: window,
            checkInput,
            preventDefault,
            preventClickEventOnDragStart,
            preventClickEventOnDrag,
            preventRightClick,
        }).on({
            dragStart: this._onDragStart,
            drag: this._onDrag,
            dragEnd: this._onDragEnd,
        });
        addEvent(document, "selectstart", this._onDocumentSelectStart);

        this.injectResult = injector.inject(target, {
            nonce: this.options.cspNonce,
        });
    }
    private hitTest(
        selectRect: Rect,
        clientX: number,
        clientY: number,
        data: any,
    ) {
        const { hitRate, selectByClick } = this.options;
        const { left, top, right, bottom } = selectRect;
        const innerGroups: Record<string | number, Record<string | number, InnerGroup>> = data.innerGroups;
        const innerWidth = data.innerWidth;
        const innerHeight = data.innerHeight;
        const rectPoints = [
            [left, top],
            [right, top],
            [right, bottom],
            [left, bottom],
        ];
        const isHit = (points: number[][]) => {
            const inArea = isInside([clientX, clientY], points);

            if (selectByClick && inArea) {
                return true;
            }
            const overlapPoints = getOverlapPoints(rectPoints, points);

            if (!overlapPoints.length) {
                return false;
            }
            const overlapSize = getAreaSize(overlapPoints);
            const targetSize = getAreaSize(points);

            const hitRateValue = splitUnit(`${hitRate}`);

            if (hitRateValue.unit === "px") {
                return overlapSize >= hitRateValue.value;
            } else {
                const rate = between(
                    Math.round((overlapSize / targetSize) * 100),
                    0,
                    100
                );

                return rate >= Math.min(100, hitRateValue.value);
            }
        };
        if (!innerGroups) {
            const selectableTargets: Array<HTMLElement | SVGElement> = data.selectableTargets;
            const selectablePoints: number[][][] = data.selectablePoints;

            return selectableTargets.filter((_, i) => {
                return isHit(selectablePoints[i]);
            });
        }
        let selectedTargets: Array<HTMLElement | SVGElement> = [];
        const minX = Math.floor(left / innerWidth);
        const maxX = Math.floor(right / innerWidth);
        const minY = Math.floor(top / innerHeight);
        const maxY = Math.floor(bottom / innerHeight);

        for (let x = minX; x <= maxX; ++x) {
            const yGroups = innerGroups[x];

            if (!yGroups) {
                continue;
            }
            for (let y = minY; y <= maxY; ++y) {
                const group = yGroups[y];

                if (!group) {
                    continue;
                }
                const { points, targets } = group;

                points.forEach((nextPoints, i) => {
                    if (isHit(nextPoints)) {
                        selectedTargets.push(targets[i]);
                    }
                });
            }
        }
        return filterDuplicated(selectedTargets);
    }
    private initDragScroll() {
        this.dragScroll
            .on("scroll", ({ container, direction }) => {
                this.emit("scroll", {
                    container,
                    direction,
                });
            })
            .on("move", ({ offsetX, offsetY, inputEvent }) => {
                const gesto = this.gesto;

                if (!gesto || !gesto.isFlag()) {
                    return;
                }

                const data = this.gesto.getEventData();
                const boundArea = data.boundArea;

                data.startX -= offsetX;
                data.startY -= offsetY;
                data.selectablePoints.forEach((points: number[][]) => {
                    points.forEach((pos) => {
                        pos[0] -= offsetX;
                        pos[1] -= offsetY;
                    });
                });
                this._refreshGroups(data);

                boundArea.left -= offsetX;
                boundArea.right -= offsetX;
                boundArea.top -= offsetY;
                boundArea.bottom -= offsetY;

                this.gesto.scrollBy(
                    offsetX,
                    offsetY,
                    inputEvent.inputEvent,
                    false
                );
                this._checkSelected(this.gesto.getCurrentEvent());
            });
    }
    private _select(
        prevSelectedTargets: Array<HTMLElement | SVGElement>,
        selectedTargets: Array<HTMLElement | SVGElement>,
        rect: Rect,
        e: OnDragEvent,
        isStart?: boolean
    ) {
        const inputEvent = e.inputEvent;
        const data = e.data;
        const { added, removed, prevList, list } = diff(
            prevSelectedTargets,
            selectedTargets
        );

        this.selectedTargets = selectedTargets;

        if (isStart) {
            /**
             * When the select(drag) starts, the selectStart event is called.
             * @memberof Selecto
             * @event selectStart
             * @param {Selecto.OnSelect} - Parameters for the selectStart event
             * @example
             * import Selecto from "selecto";
             *
             * const selecto = new Selecto({
             *   container: document.body,
             *   selectByClick: true,
             *   selectFromInside: false,
             * });
             *
             * selecto.on("selectStart", e => {
             *   e.added.forEach(el => {
             *     el.classList.add("selected");
             *   });
             *   e.removed.forEach(el => {
             *     el.classList.remove("selected");
             *   });
             * }).on("selectEnd", e => {
             *   e.afterAdded.forEach(el => {
             *     el.classList.add("selected");
             *   });
             *   e.afterRemoved.forEach(el => {
             *     el.classList.remove("selected");
             *   });
             * });
             */
            this.emit("selectStart", {
                selected: selectedTargets,
                added: added.map((index) => list[index]),
                removed: removed.map((index) => prevList[index]),
                rect,
                inputEvent,
                data: data.data,
            });
        }
        if (added.length || removed.length) {
            /**
             * When the select in real time, the select event is called.
             * @memberof Selecto
             * @event select
             * @param {Selecto.OnSelect} - Parameters for the select event
             * @example
             * import Selecto from "selecto";
             *
             * const selecto = new Selecto({
             *   container: document.body,
             *   selectByClick: true,
             *   selectFromInside: false,
             * });
             *
             * selecto.on("select", e => {
             *   e.added.forEach(el => {
             *     el.classList.add("selected");
             *   });
             *   e.removed.forEach(el => {
             *     el.classList.remove("selected");
             *   });
             * });
             */
            this.emit("select", {
                selected: selectedTargets,
                added: added.map((index) => list[index]),
                removed: removed.map((index) => prevList[index]),
                rect,
                inputEvent,
                data: data.data,
            });
        }
    }
    private _selectEnd(
        startSelectedTargets: Array<HTMLElement | SVGElement>,
        startPassedTargets: Array<HTMLElement | SVGElement>,
        rect: Rect,
        e: OnDragEvent,
    ) {
        const { inputEvent, isDouble, data } = e;
        const { added, removed, prevList, list } = diff(
            startSelectedTargets,
            this.selectedTargets
        );
        const {
            added: afterAdded,
            removed: afterRemoved,
            prevList: afterPrevList,
            list: afterList,
        } = diff(startPassedTargets, this.selectedTargets);
        const type = inputEvent && inputEvent.type;
        const isDragStart = type === "mousedown" || type === "touchstart";

        /**
         * When the select(dragEnd or click) ends, the selectEnd event is called.
         * @memberof Selecto
         * @event selectEnd
         * @param {Selecto.OnSelectEnd} - Parameters for the selectEnd event
         * @example
         * import Selecto from "selecto";
         *
         * const selecto = new Selecto({
         *   container: document.body,
         *   selectByClick: true,
         *   selectFromInside: false,
         * });
         *
         * selecto.on("selectStart", e => {
         *   e.added.forEach(el => {
         *     el.classList.add("selected");
         *   });
         *   e.removed.forEach(el => {
         *     el.classList.remove("selected");
         *   });
         * }).on("selectEnd", e => {
         *   e.afterAdded.forEach(el => {
         *     el.classList.add("selected");
         *   });
         *   e.afterRemoved.forEach(el => {
         *     el.classList.remove("selected");
         *   });
         * });
         */
        this.emit("selectEnd", {
            selected: this.selectedTargets,
            added: added.map((index) => list[index]),
            removed: removed.map((index) => prevList[index]),
            afterAdded: afterAdded.map((index) => afterList[index]),
            afterRemoved: afterRemoved.map((index) => afterPrevList[index]),
            isDragStart,
            isClick: !!e.isClick,
            isDouble: !!isDouble,
            rect,
            inputEvent,
            data: data.data,
        });
    }
    private _onDragStart = (e: OnDragStart, clickedTarget?: Element) => {
        const { data, clientX, clientY, inputEvent } = e;
        const {
            selectFromInside,
            selectByClick,
            rootContainer,
            boundContainer,
            preventDragFromInside = true,
            clickBySelectEnd,
            dragCondition,
        } = this.options;

        if (dragCondition && !dragCondition(e)) {
            e.stop();
            return;
        }
        data.data = {};
        data.innerWidth = window.innerWidth;
        data.innerHeight = window.innerHeight;
        this.findSelectableTargets(data);
        data.startSelectedTargets = this.selectedTargets;
        data.scaleMatrix = createMatrix();
        data.containerX = 0;
        data.containerY = 0;


        let boundArea = {
            left: -Infinity,
            top: -Infinity,
            right: Infinity,
            bottom: Infinity,
        };
        if (rootContainer) {
            const containerRect = this.container.getBoundingClientRect();

            data.containerX = containerRect.left;
            data.containerY = containerRect.top;
            data.scaleMatrix = getDistElementMatrix(this.container, rootContainer);
        }

        if (boundContainer) {
            const boundInfo: Required<BoundContainer> =
                isObject(boundContainer) && "element" in boundContainer
                    ? {
                        left: true,
                        top: true,
                        bottom: true,
                        right: true,
                        ...boundContainer,
                    }
                    : {
                        element: boundContainer,
                        left: true,
                        top: true,
                        bottom: true,
                        right: true,
                    };
            const boundElement = boundInfo.element;
            let rectElement: HTMLElement;

            if (boundElement) {
                if (isString(boundElement)) {
                    rectElement = document.querySelector(boundElement);
                } else if (boundElement === true) {
                    rectElement = this.container;
                } else {
                    rectElement = boundElement;
                }
                const rect = rectElement.getBoundingClientRect();

                if (boundInfo.left) {
                    boundArea.left = rect.left;
                }
                if (boundInfo.top) {
                    boundArea.top = rect.top;
                }
                if (boundInfo.right) {
                    boundArea.right = rect.right;
                }
                if (boundInfo.bottom) {
                    boundArea.bottom = rect.bottom;
                }
            }
        }

        data.boundArea = boundArea;

        const hitRect = {
            left: clientX,
            top: clientY,
            right: clientX,
            bottom: clientY,
            width: 0,
            height: 0,
        };
        let firstPassedTargets: Array<HTMLElement | SVGElement> = [];

        if (!selectFromInside || (selectByClick && !clickBySelectEnd)) {
            const pointTarget = this._findElement(
                clickedTarget || elementFromPoint(clientX, clientY),
                data.selectableTargets,
            );
            firstPassedTargets = pointTarget ? [pointTarget] : [];
        }
        const hasInsideTargets = firstPassedTargets.length > 0;
        const isPreventSelect = !selectFromInside && hasInsideTargets;

        // prevent drag from inside when selectByClick is false
        if (isPreventSelect && !selectByClick) {
            e.stop();
            return false;
        }

        const type = inputEvent.type;
        const isTrusted = type === "mousedown" || type === "touchstart";
        /**
         * When the drag starts (triggers on mousedown or touchstart), the dragStart event is called.
         * Call the stop () function if you have a specific element or don't want to raise a select
         * @memberof Selecto
         * @event dragStart
         * @param {OnDragStart} - Parameters for the dragStart event
         * @example
         * import Selecto from "selecto";
         *
         * const selecto = new Selecto({
         *   container: document.body,
         *   selectByClick: true,
         *   selectFromInside: false,
         * });
         *
         * selecto.on("dragStart", e => {
         *   if (e.inputEvent.target.tagName === "SPAN") {
         *     e.stop();
         *   }
         * }).on("select", e => {
         *   e.added.forEach(el => {
         *     el.classList.add("selected");
         *   });
         *   e.removed.forEach(el => {
         *     el.classList.remove("selected");
         *   });
         * });
         */
        const result =
            !(e as any).isClick && isTrusted
                ? this.emit("dragStart", { ...e, data: data.data })
                : true;

        if (!result) {
            e.stop();
            return false;
        }

        if (this.continueSelect) {
            firstPassedTargets = passTargets(
                this.selectedTargets,
                firstPassedTargets,
                this.continueSelectWithoutDeselect,
            );
            data.startPassedTargets = this.selectedTargets;
        } else {
            data.startPassedTargets = [];
        }
        this._select(
            this.selectedTargets,
            firstPassedTargets,
            hitRect,
            e,
            true
        );
        data.startX = clientX;
        data.startY = clientY;
        data.selectFlag = false;
        data.preventDragFromInside = false;

        const offsetPos = calculateMatrixDist(data.scaleMatrix, [
            clientX - data.containerX,
            clientY - data.containerY,
        ]);
        data.boundsArea = this.target.style.cssText += `position: ${rootContainer ? "absolute" : "fixed"};`
            + `left:0px;top:0px;`
            + `transform: translate(${offsetPos[0]}px, ${offsetPos[1]}px)`;

        if (isPreventSelect && selectByClick && !clickBySelectEnd) {
            inputEvent.preventDefault();

            // prevent drag from inside when selectByClick is true and force call `selectEnd`
            if (preventDragFromInside) {
                this._selectEnd(
                    data.startSelectedTargets,
                    data.startPassedTargets,
                    hitRect,
                    e
                );
                data.preventDragFromInside = true;
            }
        } else {
            data.selectFlag = true;
            if (type === "touchstart") {
                inputEvent.preventDefault();
            }
            const { scrollOptions } = this.options;
            if (scrollOptions && scrollOptions.container) {
                this.dragScroll.dragStart(e, scrollOptions);
            }
            if (clickBySelectEnd) {
                data.selectFlag = false;
                e.preventDrag();
            }
        }
        return true;
    };
    private _checkSelected(e: any, rect = getRect(e, this.options.ratio)) {
        const { data, inputEvent } = e;
        const { top, left, width, height } = rect;
        const selectFlag = data.selectFlag;
        const {
            containerX,
            containerY,
            scaleMatrix,
        } = data;
        const offsetPos = calculateMatrixDist(scaleMatrix, [
            left - containerX,
            top - containerY,
        ]);
        const offsetSize = calculateMatrixDist(scaleMatrix, [
            width,
            height,
        ]);
        let prevSelectedTargets: Array<HTMLElement | SVGElement> = [];
        let selectedTargets: Array<HTMLElement | SVGElement> = [];
        if (selectFlag) {
            this.target.style.cssText +=
                `display: block;` +
                `left:0px;top:0px;` +
                `transform: translate(${offsetPos[0]}px, ${offsetPos[1]}px);` +
                `width:${offsetSize[0]}px;height:${offsetSize[1]}px;`;

            const passedTargets = this.hitTest(
                rect,
                data.startX,
                data.startY,
                data,
            );
            prevSelectedTargets = this.selectedTargets;
            selectedTargets = passTargets(
                data.startPassedTargets,
                passedTargets,
                this.continueSelect && this.continueSelectWithoutDeselect,
            );

            this.selectedTargets = selectedTargets;
        }
        /**
         * When the drag, the drag event is called.
         * Call the stop () function if you have a specific element or don't want to raise a select
         * @memberof Selecto
         * @event drag
         * @param {OnDrag} - Parameters for the drag event
         * @example
         * import Selecto from "selecto";
         *
         * const selecto = new Selecto({
         *   container: document.body,
         *   selectByClick: true,
         *   selectFromInside: false,
         * });
         *
         * selecto.on("drag", e => {
         *   e.stop();
         * }).on("select", e => {
         *   e.added.forEach(el => {
         *     el.classList.add("selected");
         *   });
         *   e.removed.forEach(el => {
         *     el.classList.remove("selected");
         *   });
         * });
         */
        const result = this.emit("drag", {
            ...e,
            data: data.data,
            isSelect: selectFlag,
            rect,
        });
        if (result === false) {
            this.target.style.cssText += "display: none;";
            e.stop();
            return;
        }

        if (selectFlag) {
            this._select(prevSelectedTargets, selectedTargets, rect, e);
        }
    }
    private _onDrag = (e: OnDrag) => {
        if (e.data.selectFlag) {
            const scrollOptions = this.scrollOptions;

            // If it is a scrolling position, pass drag
            if (scrollOptions?.container && this.dragScroll.drag(e, scrollOptions)) {
                return;
            }
        }
        this._checkSelected(e);
    };
    private _onDragEnd = (e: OnDragEvent) => {
        const { data, inputEvent } = e;
        const rect = getRect(e, this.options.ratio);
        const selectFlag = data.selectFlag;

        /**
         * When the drag ends (triggers on mouseup or touchend after drag), the dragEnd event is called.
         * @memberof Selecto
         * @event dragEnd
         * @param {OnDragEnd} - Parameters for the dragEnd event
         */
        if (inputEvent) {
            this.emit("dragEnd", {
                isDouble: !!e.isDouble,
                isClick: !!e.isClick,
                isDrag: false,
                isSelect: selectFlag,
                ...e,
                data: data.data,
                rect,
            });
        }
        this.target.style.cssText += "display: none;";
        if (selectFlag) {
            data.selectFlag = false;
            this.dragScroll.dragEnd();
        } else if (this.selectByClick && this.clickBySelectEnd) {
            // only clickBySelectEnd
            const pointTarget = this._findElement(
                elementFromPoint(e.clientX, e.clientY),
                data.selectableTargets,
            );
            this._select(this.selectedTargets, pointTarget ? [pointTarget] : [], rect, e);
        }
        if (!data.preventDragFromInside) {
            this._selectEnd(
                data.startSelectedTargets,
                data.startPassedTargets,
                rect,
                e
            );
        }
    };
    private _sameCombiKey(e: any, keys: string | string[] | string[][], isKeyup?: boolean) {
        if (!keys) {
            return false;
        }
        const combi = getCombi(e.inputEvent, e.key);
        const nextKeys = [].concat(keys);
        const toggleKeys = isArray(nextKeys[0]) ? nextKeys : [nextKeys];

        if (isKeyup) {
            const singleKey = e.key;

            return toggleKeys.some((keys) =>
                keys.some((key) => key === singleKey)
            );
        }
        return toggleKeys.some((keys) =>
            keys.every((key) => combi.indexOf(key) > -1)
        );
    }
    private _onKeyDown = (e: any) => {
        const options = this.options;
        let isKeyDown = false;

        if (!this._keydownContinueSelect) {
            const result = this._sameCombiKey(e, options.toggleContinueSelect);

            this._keydownContinueSelect = result;
            isKeyDown = result;
        }
        if (!this._keydownContinueSelectWithoutDeselection) {
            const result = this._sameCombiKey(e, options.toggleContinueSelectWithoutDeselect);

            this._keydownContinueSelectWithoutDeselection = result;
            isKeyDown = isKeyDown || result;
        }
        if (!isKeyDown) {
            return;
        }
        /**
         * When you keydown the key you specified in toggleContinueSelect, the keydown event is called.
         * @memberof Selecto
         * @event keydown
         * @example
         * import Selecto from "selecto";
         *
         * const selecto = new Selecto({
         *   container: document.body,
         *   toggleContinueSelect: "shift";
         *   keyContainer: window,
         * });
         *
         * selecto.on("keydown", () => {
         *   document.querySelector(".button").classList.add("selected");
         * }).on("keyup", () => {
         *   document.querySelector(".button").classList.remove("selected");
         * }).on("select", e => {
         *   e.added.forEach(el => {
         *     el.classList.add("selected");
         *   });
         *   e.removed.forEach(el => {
         *     el.classList.remove("selected");
         *   });
         * });
         */
        this.emit("keydown", {
            keydownContinueSelect: this._keydownContinueSelect,
            keydownContinueSelectWithoutDeselection: this._keydownContinueSelectWithoutDeselection,
        });
    };
    private _onKeyUp = (e: any) => {
        const options = this.options;
        let isKeyUp = false;

        if (this._keydownContinueSelect) {
            const result = this._sameCombiKey(e, options.toggleContinueSelect, true);
            this._keydownContinueSelect = !result;

            isKeyUp = result;
        }
        if (this._keydownContinueSelectWithoutDeselection) {
            const result = this._sameCombiKey(e, options.toggleContinueSelectWithoutDeselect, true);
            this._keydownContinueSelectWithoutDeselection = !result;

            isKeyUp = isKeyUp || result;
        }
        if (!isKeyUp) {
            return;
        }

        /**
         * When you keyup the key you specified in toggleContinueSelect, the keyup event is called.
         * @memberof Selecto
         * @event keyup
         * @example
         * import Selecto from "selecto";
         *
         * const selecto = new Selecto({
         *   container: document.body,
         *   toggleContinueSelect: "shift";
         *   keyContainer: window,
         * });
         *
         * selecto.on("keydown", () => {
         *   document.querySelector(".button").classList.add("selected");
         * }).on("keyup", () => {
         *   document.querySelector(".button").classList.remove("selected");
         * }).on("select", e => {
         *   e.added.forEach(el => {
         *     el.classList.add("selected");
         *   });
         *   e.removed.forEach(el => {
         *     el.classList.remove("selected");
         *   });
         * });
         */
        this.emit("keyup", {
            keydownContinueSelect: this._keydownContinueSelect,
            keydownContinueSelectWithoutDeselection: this._keydownContinueSelectWithoutDeselection,
        });
    };
    private _onBlur = () => {
        if (this._keydownContinueSelect || this._keydownContinueSelectWithoutDeselection) {
            this._keydownContinueSelect = false;
            this._keydownContinueSelectWithoutDeselection = false;
            this.emit("keyup", {
                keydownContinueSelect: this._keydownContinueSelect,
                keydownContinueSelectWithoutDeselection: this._keydownContinueSelectWithoutDeselection,
            });
        }
    };
    private _onDocumentSelectStart = (e: any) => {
        if (!this.gesto.isFlag()) {
            return;
        }
        let dragContainer = this.dragContainer;

        if (dragContainer === window) {
            dragContainer = document.documentElement;
        }
        const containers =
            dragContainer instanceof Element
                ? [dragContainer]
                : ([].slice.call(dragContainer) as Element[]);
        const target = e.target;

        containers.some((container) => {
            if (container === target || container.contains(target)) {
                e.preventDefault();
                return true;
            }
        });
    };
    private _findElement(clickedTarget: Element | null, selectableTargets: Array<Element>): HTMLElement | SVGElement {
        let pointTarget = clickedTarget;

        while (pointTarget) {
            if (selectableTargets.indexOf(pointTarget) > -1) {
                break;
            }
            pointTarget = pointTarget.parentElement;
        }
        return pointTarget as any;
    }
    private _refreshGroups(data: any) {
        const innerWidth = data.innerWidth;
        const innerHeight = data.innerHeight;

        if (!innerWidth || !innerHeight) {
            data.innerGroups = null;
        } else {
            const selectableTargets: Array<HTMLElement | SVGElement> = data.selectableTargets;
            const selectablePoints: number[][][] = data.selectablePoints;
            const groups: Record<string | number, Record<string | number, InnerGroup>> = {};

            selectablePoints.forEach((points, i) => {
                let minX = Infinity;
                let maxX = -Infinity;
                let minY = Infinity;
                let maxY = -Infinity;

                points.forEach(pos => {
                    const x = Math.floor(pos[0] / innerWidth);
                    const y = Math.floor(pos[1] / innerHeight);

                    minX = Math.min(x, minX);
                    maxX = Math.max(x, maxX);
                    minY = Math.min(y, minY);
                    maxY = Math.max(y, maxY);
                });

                for (let x = minX; x <= maxX; ++x) {
                    for (let y = minY; y <= maxY; ++y) {
                        groups[x] = groups[x] || {};
                        groups[x][y] = groups[x][y] || {
                            points: [],
                            targets: [],
                        };

                        const { targets, points: groupPoints } = groups[x][y];

                        targets.push(selectableTargets[i]);
                        groupPoints.push(points);
                    }
                }
            });

            data.innerGroups = groups;
        }
    }
}

interface Selecto extends SelectoProperties { }

export default Selecto;
