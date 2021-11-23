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
} from "./utils";
import {
    SelectoOptions,
    SelectoProperties,
    OnDragEvent,
    SelectoEvents,
    Rect,
    BoundContainer,
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
    /**
     *
     */
    constructor(options: Partial<SelectoOptions> = {}) {
        super();
        this.target = options.target;
        this.container = options.container || document.body;
        this.options = {
            target: null,
            container: null,
            dragContainer: null,
            selectableTargets: [],
            selectByClick: true,
            selectFromInside: true,
            hitRate: 100,
            continueSelect: false,
            toggleContinueSelect: null,
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
    public setKeyContainer(keyContainer: HTMLElement | Document | Window) {
        const options = this.options;

        diffValue(options.keyContainer, keyContainer, () => {
            options.keyContainer = keyContainer;

            this.setKeyController();
        });
    }
    public setToggleContinueSelect(
        toggleContinueSelect: string[][] | string[] | string
    ) {
        const options = this.options;

        diffValue(options.toggleContinueSelect, toggleContinueSelect, () => {
            options.toggleContinueSelect = toggleContinueSelect;

            this.setKeyEvent();
        });
    }
    public setPreventDefault(value: boolean) {
        this.gesto.options.preventDefault = value;
    }
    public setCheckInput(value: boolean) {
        this.gesto.options.checkInput = value;
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
        removeEvent(document, "selectstart", this.onDocumentSelectStart);

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
     * Find for selectableTargets again during drag event
     */
    public findSelectableTargets(datas: any = this.gesto.getEventDatas()) {
        const selectableTargets = this.getSelectableElements();
        const selectablePoints = selectableTargets.map((target) =>
            this.getElementPoints(target)
        );
        datas.selectableTargets = selectableTargets;
        datas.selectablePoints = selectablePoints;
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
            datas: {
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
        if (this.onDragStart(dragEvent, clickedTarget)) {
            this.onDragEnd(dragEvent);
        }
        return this;
    }
    private setKeyController() {
        const { keyContainer, toggleContinueSelect } = this.options;

        if (this.keycon) {
            this.keycon.destroy();
            this.keycon = null;
        }
        if (toggleContinueSelect) {
            this.keycon = new KeyController(keyContainer || window);
            this.keycon
                .keydown(this.onKeyDown)
                .keyup(this.onKeyUp)
                .on("blur", this.onBlur);
        }
    }
    private setKeyEvent() {
        const { toggleContinueSelect } = this.options;
        if (!toggleContinueSelect || this.keycon) {
            return;
        }
        this.setKeyController();
    }
    private initElement() {
        this.target = createElement(
            (<div className={CLASS_NAME}></div>) as any,
            this.target,
            this.container
        );

        const target = this.target;

        const { dragContainer, checkInput, preventDefault } = this.options;
        this.dragContainer =
            typeof dragContainer === "string"
                ? [].slice.call(document.querySelectorAll(dragContainer))
                : this.options.dragContainer || (this.target.parentNode as any);
        this.gesto = new Gesto(this.dragContainer, {
            checkWindowBlur: true,
            container: window,
            checkInput,
            preventDefault,
        }).on({
            dragStart: this.onDragStart,
            drag: this.onDrag,
            dragEnd: this.onDragEnd,
        });
        addEvent(document, "selectstart", this.onDocumentSelectStart);

        this.injectResult = injector.inject(target, {
            nonce: this.options.cspNonce,
        });
    }
    private hitTest(
        selectRect: Rect,
        clientX: number,
        clientY: number,
        targets: Array<HTMLElement | SVGElement>,
        selectablePoints: number[][][]
    ) {
        const { hitRate, selectByClick } = this.options;
        const { left, top, right, bottom } = selectRect;
        const rectPoints = [
            [left, top],
            [right, top],
            [right, bottom],
            [left, bottom],
        ];
        return targets.filter((_, i) => {
            const points = selectablePoints[i];
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
            const rate = between(
                Math.round((overlapSize / targetSize) * 100),
                0,
                100
            );

            if (rate >= Math.min(100, hitRate)) {
                return true;
            }
            return false;
        });
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
                const datas = inputEvent.datas;
                const boundArea = datas.boundArea;

                datas.startX -= offsetX;
                datas.startY -= offsetY;
                datas.selectablePoints.forEach((points: number[][]) => {
                    points.forEach((pos) => {
                        pos[0] -= offsetX;
                        pos[1] -= offsetY;
                    });
                });

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

                inputEvent.distX += offsetX;
                inputEvent.distY += offsetY;
                this.check(inputEvent);
            });
    }
    private select(
        prevSelectedTargets: Array<HTMLElement | SVGElement>,
        selectedTargets: Array<HTMLElement | SVGElement>,
        rect: Rect,
        inputEvent: any,
        isStart?: boolean
    ) {
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
            });
        }
    }
    private selectEnd(
        startSelectedTargets: Array<HTMLElement | SVGElement>,
        startPassedTargets: Array<HTMLElement | SVGElement>,
        rect: Rect,
        e: OnDragEvent
    ) {
        const { inputEvent, isDouble } = e;
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
        });
    }
    private onDragStart = (e: OnDragStart, clickedTarget?: Element) => {
        const { datas, clientX, clientY, inputEvent } = e;
        const {
            continueSelect,
            selectFromInside,
            selectByClick,
            rootContainer,
            boundContainer,
            preventDragFromInside = true,
            dragCondition,
        } = this.options;

        if (dragCondition && !dragCondition(e)) {
            e.stop();
            return;
        }
        this.findSelectableTargets(datas);
        datas.startSelectedTargets = this.selectedTargets;
        datas.scaleMatrix = createMatrix();
        datas.containerX = 0;
        datas.containerY = 0;

        let boundArea = {
            left: -Infinity,
            top: -Infinity,
            right: Infinity,
            bottom: Infinity,
        };
        if (rootContainer) {
            const containerRect = this.container.getBoundingClientRect();

            datas.containerX = containerRect.left;
            datas.containerY = containerRect.top;
            datas.scaleMatrix = getDistElementMatrix(this.container, rootContainer);
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

        datas.boundArea = boundArea;

        const hitRect = {
            left: clientX,
            top: clientY,
            right: clientX,
            bottom: clientY,
            width: 0,
            height: 0,
        };
        let firstPassedTargets: Array<HTMLElement | SVGElement> = [];
        if (!selectFromInside || selectByClick) {
            let pointTarget = (clickedTarget ||
                document.elementFromPoint(clientX, clientY)) as
                | HTMLElement
                | SVGElement;

            while (pointTarget) {
                if (
                    datas.selectableTargets.indexOf(
                        pointTarget as HTMLElement | SVGElement
                    ) > -1
                ) {
                    break;
                }
                pointTarget = pointTarget.parentElement;
            }
            firstPassedTargets = pointTarget ? [pointTarget] : [];
        }
        const hasInsideTargets = firstPassedTargets.length > 0;
        const isPreventSelect = !selectFromInside && hasInsideTargets;

        if (isPreventSelect && !selectByClick) {
            e.stop();
            return false;
        }
        const type = inputEvent.type;
        const isTrusted = type === "mousedown" || type === "touchstart";
        /**
         * When the drag starts, the dragStart event is called.
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
                ? this.emit("dragStart", { ...e })
                : true;

        if (!result) {
            e.stop();
            return false;
        }

        if (!continueSelect) {
            datas.startPassedTargets = [];
        } else {
            firstPassedTargets = passTargets(
                this.selectedTargets,
                firstPassedTargets
            );
            datas.startPassedTargets = this.selectedTargets;
        }
        this.select(
            this.selectedTargets,
            firstPassedTargets,
            hitRect,
            inputEvent,
            true
        );
        datas.startX = clientX;
        datas.startY = clientY;
        datas.selectFlag = false;
        datas.preventDragFromInside = false;

        const offsetPos = calculateMatrixDist(datas.scaleMatrix, [
            clientX - datas.containerX,
            clientY - datas.containerY,
        ]);
        datas.boundsArea = this.target.style.cssText += `position: ${rootContainer ? "absolute" : "fixed"};`
            + `left:0px;top:0px;`
            + `transform: translate(${offsetPos[0]}px, ${offsetPos[1]}px)`;

        if (isPreventSelect && selectByClick) {
            inputEvent.preventDefault();

            if (preventDragFromInside) {
                this.selectEnd(
                    datas.startSelectedTargets,
                    datas.startPassedTargets,
                    hitRect,
                    e
                );
                datas.preventDragFromInside = true;
            }
        } else {
            datas.selectFlag = true;
            if (type === "touchstart") {
                inputEvent.preventDefault();
            }
            const { scrollOptions } = this.options;
            if (scrollOptions && scrollOptions.container) {
                this.dragScroll.dragStart(e, scrollOptions);
            }
        }
        return true;
    };
    private check(e: any, rect = getRect(e, this.options.ratio)) {
        const { datas, inputEvent } = e;
        const { top, left, width, height } = rect;
        const selectFlag = datas.selectFlag;
        const {
            containerX,
            containerY,
            scaleMatrix,
        } = datas;
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
                datas.startX,
                datas.startY,
                datas.selectableTargets,
                datas.selectablePoints
            );
            prevSelectedTargets = this.selectedTargets;
            selectedTargets = passTargets(
                datas.startPassedTargets,
                passedTargets
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
            isSelect: selectFlag,
            rect,
        });
        if (result === false) {
            this.target.style.cssText += "display: none;";
            e.stop();
            return;
        }

        if (selectFlag) {
            this.select(prevSelectedTargets, selectedTargets, rect, inputEvent);
        }
    }
    private onDrag = (e: OnDrag) => {
        if (e.datas.selectFlag) {
            const { scrollOptions } = this.options;
            if (scrollOptions && scrollOptions.container) {
                if (this.dragScroll.drag(e, scrollOptions)) {
                    return;
                }
            }
        }
        this.check(e);
    };
    private onDragEnd = (e: OnDragEvent) => {
        const { datas, inputEvent } = e;
        const rect = getRect(e, this.options.ratio);
        const selectFlag = datas.selectFlag;

        if (inputEvent && !e.isClick) {
            this.emit("dragEnd", {
                isDouble: !!e.isDouble,
                isDrag: false,
                isSelect: selectFlag,
                ...e,
                isClick: !!e.isClick,
                rect,
            });
        }
        this.target.style.cssText += "display: none;";
        if (selectFlag) {
            datas.selectFlag = false;
            this.dragScroll.dragEnd();
        }
        if (!datas.preventDragFromInside) {
            this.selectEnd(
                datas.startSelectedTargets,
                datas.startPassedTargets,
                rect,
                e
            );
        }
    };
    private sameCombiKey(e: any, isKeyup?: boolean) {
        const toggleContinueSelect = [].concat(
            this.options.toggleContinueSelect
        );
        const combi = getCombi(e.inputEvent, e.key);
        const toggleKeys = isArray(toggleContinueSelect[0])
            ? toggleContinueSelect
            : [toggleContinueSelect];

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
    private onKeyDown = (e: any) => {
        if (!this.sameCombiKey(e)) {
            return;
        }
        this.continueSelect = true;
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
        this.emit("keydown", {});
    };
    private onKeyUp = (e: any) => {
        if (!this.sameCombiKey(e, true)) {
            return;
        }
        this.continueSelect = false;
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
        this.emit("keyup", {});
    };
    private onBlur = () => {
        if (this.toggleContinueSelect && this.continueSelect) {
            this.continueSelect = false;
            this.emit("keyup", {});
        }
    };
    private onDocumentSelectStart = (e: any) => {
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
}

interface Selecto extends SelectoProperties { }

export default Selecto;
