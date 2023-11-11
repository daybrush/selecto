import EventEmitter from "@scena/event-emitter";
import Gesto, { OnDrag } from "gesto";
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
    isFunction,
    getWindow,
    getDocument,
    isNode,
} from "@daybrush/utils";
import { diff } from "@egjs/children-differ";
import DragScroll from "@scena/dragscroll";
import KeyController, { KeyControllerEvent, getCombi } from "keycon";
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
    getLineSize,
} from "./utils";
import {
    SelectoOptions,
    SelectoProperties,
    OnDragEvent,
    SelectoEvents,
    Rect,
    BoundContainer,
    SelectedTargets,
    SelectedTargetsWithRect,
    InnerParentInfo,
    ElementType,
    OnDragStart,
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
        attributes.get = function() {
            return this[getter]();
        };
    } else {
        attributes.get = function() {
            return this.options[property];
        };
    }
    const setter = camelize(`set ${property}`);
    if (prototype[setter]) {
        attributes.set = function(value: any) {
            this[setter](value);
        };
    } else {
        attributes.set = function(value: any) {
            this.options[property] = value;
        };
    }
    Object.defineProperty(prototype, property, attributes);
})

class Selecto extends EventEmitter<SelectoEvents> {
    public options: SelectoOptions;
    private target!: ElementType;
    private dragContainer!: Element | Window | Element[];
    private container!: HTMLElement;
    private gesto!: Gesto;
    private injectResult!: InjectResult;
    private selectedTargets: ElementType[] = [];
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
            className: "",
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
            scrollOptions: null,
            checkInput: false,
            preventDefault: false,
            boundContainer: false,
            preventDragFromInside: true,
            dragCondition: null,
            rootContainer: null,
            checkOverflow: false,
            innerScrollOptions: false,
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
     * selectByClick, continueSelect, and continueSelectWithoutDeselect are not applied.
     */
    public setSelectedTargets(
        selectedTargets: ElementType[],
    ): SelectedTargets {
        const beforeSelected = this.selectedTargets;
        const { added, removed, prevList, list } = diff(
            beforeSelected,
            selectedTargets
        );
        this.selectedTargets = selectedTargets;

        return {
            added: added.map(index => list[index]),
            removed: removed.map(index => prevList[index]),
            beforeSelected,
            selected: selectedTargets,
        };
    }
    /**
     * You can set the currently selected targets by points
     * selectByClick, continueSelect, and continueSelectWithoutDeselect are not applied.
     */
    public setSelectedTargetsByPoints(
        point1: number[],
        point2: number[],
    ): SelectedTargetsWithRect {
        const left = Math.min(point1[0], point2[0]);
        const top = Math.min(point1[1], point2[1]);
        const right = Math.max(point1[0], point2[0]);
        const bottom = Math.max(point1[1], point2[1]);
        const rect: Rect = {
            left,
            top,
            right,
            bottom,
            width: right - left,
            height: bottom - top,
        };
        const data = { ignoreClick: true };

        this.findSelectableTargets(data);
        const selectedElements = this.hitTest(rect, data, true, null);
        const result = this.setSelectedTargets(selectedElements);

        return {
            ...result,
            rect,
        };
    }
    /**
     * Select target by virtual drag from startPoint to endPoint.
     * The target of inputEvent is null.
     */
    public selectTargetsByPoints(
        startPoint: number[],
        endPoint: number[],
    ) {
        const mousedown = new MouseEvent("mousedown", {
            clientX: startPoint[0],
            clientY: startPoint[1],
            cancelable: true,
            bubbles: true,
        });
        const mousemove = new MouseEvent("mousemove", {
            clientX: endPoint[0],
            clientY: endPoint[1],
            cancelable: true,
            bubbles: true,
        });
        const mouseup = new MouseEvent("mousemove", {
            clientX: endPoint[0],
            clientY: endPoint[1],
            cancelable: true,
            bubbles: true,
        });
        const gesto = this.gesto;
        const result = gesto.onDragStart(mousedown);

        if (result !== false) {
            gesto.onDrag(mousemove);
            gesto.onDragEnd(mouseup);
        }
    }
    /**
     * You can get the currently selected targets.
     */
    public getSelectedTargets(): ElementType[] {
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
    public destroy() {
        this.off();
        this.keycon && this.keycon.destroy();
        this.gesto.unset();
        this.injectResult.destroy();
        this.dragScroll.dragEnd();
        removeEvent(document, "selectstart", this._onDocumentSelectStart);

        if (!this.options.portalContainer) {
            this.target.parentElement?.removeChild(this.target);
        }


        this.keycon = null;
        this.gesto = null;
        this.injectResult = null;
        this.target = null;
        this.container = null;
        this.options = null;
    }
    public getElementPoints(target: ElementType) {
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
        const container = this.container;
        const selectableElements: ElementType[] = [];

        this.options.selectableTargets.forEach((target) => {
            if (isFunction(target)) {
                const result = target();

                if (result) {
                    selectableElements.push(...[].slice.call(result));
                }
            } else if (isNode(target)) {
                selectableElements.push(target);
            } else if (isObject(target)) {
                selectableElements.push(target.value || target.current);
            } else {
                const elements = [].slice.call(
                    (getDocument(container)).querySelectorAll(target)
                );

                selectableElements.push(...elements);
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
        const innerScrollOptions = this.gesto.getEventData().innerScrollOptions;
        const hasScrollOptions = innerScrollOptions || scrollOptions?.container;

        // If it is a scrolling position, pass drag
        if (hasScrollOptions) {
            this.dragScroll.checkScroll({
                inputEvent: this.gesto.getCurrentEvent(),
                ...(innerScrollOptions || scrollOptions),
            });
        }
    }
    /**
     * Find for selectableTargets again during drag event
     * You can update selectable targets during an event.
     */
    public findSelectableTargets(data: IObject<any> = this.gesto.getEventData()) {
        const selectableTargets = this.getSelectableElements();
        const selectablePoints = selectableTargets.map(
            (target) => this.getElementPoints(target),
        );

        data.selectableTargets = selectableTargets;
        data.selectablePoints = selectablePoints;
        data.selectableParentMap = null;

        const options = this.options;
        const hasIndexesMap = options.checkOverflow || options.innerScrollOptions;
        const doc = getDocument(this.container);

        if (hasIndexesMap) {
            const parentMap = new Map<Element, InnerParentInfo>();

            data.selectableInnerScrollParentMap = parentMap;
            data.selectableInnerScrollPathsList = selectableTargets.map((target, index) => {
                let parentElement = target.parentElement;

                let parents: Element[] = [];
                const paths: Element[] = [];

                while (parentElement && parentElement !== doc.body) {
                    let info: InnerParentInfo = parentMap.get(parentElement);

                    if (!info) {
                        const overflow = getComputedStyle(parentElement).overflow !== "visible";

                        if (overflow) {
                            const rect = getDefaultElementRect(parentElement);

                            info = {
                                parentElement,
                                indexes: [],
                                points: [rect.pos1, rect.pos2, rect.pos4, rect.pos3],
                                paths: [...paths],
                            };

                            parents.push(parentElement);
                            parents.forEach(prevParentElement => {
                                parentMap.set(prevParentElement, info);
                            });
                            parents = [];
                        }
                    }
                    if (info) {
                        parentElement = info.parentElement;

                        parentMap.get(parentElement).indexes.push(index);
                        paths.push(parentElement);
                    } else {
                        parents.push(parentElement);
                    }
                    parentElement = parentElement.parentElement;
                }

                return paths;
            });
        }

        if (!options.checkOverflow) {
            data.selectableInners = selectableTargets.map(() => true);
        }

        this._refreshGroups(data);

        return selectableTargets;
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
            isTrusted: false,
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
            this.keycon = new KeyController(keyContainer || getWindow(this.container));
            this.keycon
                .keydown(this._onKeyDown)
                .keyup(this._onKeyUp)
                .on("blur", this._onBlur);
        }
    }
    private setClassName(nextClassName: string) {
        this.options.className = nextClassName;
        this.target.setAttribute(`class`, `${CLASS_NAME} ${nextClassName || ""}`);
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
        const {
            dragContainer,
            checkInput,
            preventDefault,
            preventClickEventOnDragStart,
            preventClickEventOnDrag,
            preventClickEventByCondition,
            preventRightClick = true,
            className,
        } = this.options;
        const container = this.container;

        this.target = createElement(
            (<div className={`${CLASS_NAME} ${className || ""}`}></div>) as any,
            this.target,
            container,
        );


        const target = this.target;

        this.dragContainer =
            typeof dragContainer === "string"
                ? [].slice.call(getDocument(container).querySelectorAll(dragContainer))
                : dragContainer || (this.target.parentNode as any);
        this.gesto = new Gesto(this.dragContainer, {
            checkWindowBlur: true,
            container: getWindow(container),
            checkInput,
            preventDefault,
            preventClickEventOnDragStart,
            preventClickEventOnDrag,
            preventClickEventByCondition,
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
        data: any,
        isDrag: boolean,
        gestoEvent: any,
    ) {
        const { hitRate, selectByClick } = this.options;
        const { left, top, right, bottom } = selectRect;
        const innerGroups: Record<string | number, Record<string | number, number[]>> = data.innerGroups;
        const innerWidth = data.innerWidth;
        const innerHeight = data.innerHeight;
        const clientX = gestoEvent?.clientX;
        const clientY = gestoEvent?.clientY;
        const ignoreClick = data.ignoreClick;
        const rectPoints = [
            [left, top],
            [right, top],
            [right, bottom],
            [left, bottom],
        ];
        const isHit = (points: number[][], el: Element) => {
            const hitRateValue =
                typeof hitRate === "function"
                    ? splitUnit(`${hitRate(el)}`)
                    : splitUnit(`${hitRate}`);

            const inArea = ignoreClick
                ? false
                : isInside([clientX, clientY], points);

            if (!isDrag && selectByClick && inArea) {
                return true;
            }
            const overlapPoints = getOverlapPoints(rectPoints, points);

            if (!overlapPoints.length) {
                return false;
            }
            let overlapSize = getAreaSize(overlapPoints);

            // Line
            let targetSize = 0;

            if (overlapSize === 0 && getAreaSize(points) === 0) {
                targetSize = getLineSize(points);
                overlapSize = getLineSize(overlapPoints);
            } else {
                targetSize = getAreaSize(points);
            }


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
        const selectableTargets: ElementType[] = data.selectableTargets;
        const selectablePoints: number[][][] = data.selectablePoints;
        const selectableInners: boolean[] = data.selectableInners;

        if (!innerGroups) {
            return selectableTargets.filter((_, i) => {
                if (!selectableInners[i]) {
                    return false;
                }
                return isHit(selectablePoints[i], selectableTargets[i]);
            });
        }
        const selectedTargets: ElementType[] = [];
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
                group.forEach(index => {
                    const points = selectablePoints[index];
                    const inner = selectableInners[index];
                    const target = selectableTargets[index];

                    if (inner && isHit(points, target)) {
                        selectedTargets.push(target);
                    }
                });
            }
        }
        return filterDuplicated(selectedTargets);
    }
    private initDragScroll() {
        this.dragScroll
            .on("scrollDrag", ({ next }) => {
                next(this.gesto.getCurrentEvent());
            })
            .on("scroll", ({ container, direction }) => {
                const innerScrollOptions = this.gesto.getEventData().innerScrollOptions;

                if (innerScrollOptions) {
                    this.emit("innerScroll", {
                        container,
                        direction,
                    });
                } else {
                    this.emit("scroll", {
                        container,
                        direction,
                    });
                }
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

                const innerScrollOptions = this.gesto.getEventData().innerScrollOptions;
                const container = innerScrollOptions?.container;
                let isMoveInnerScroll = false;

                if (container) {
                    const parentMap: Map<Element, InnerParentInfo> = data.selectableInnerScrollParentMap;
                    const parentInfo = parentMap.get(container);

                    if (parentInfo) {
                        parentInfo.paths.forEach(scrollContainer => {
                            const containerInfo = parentMap.get(scrollContainer);

                            containerInfo.points.forEach(pos => {
                                pos[0] -= offsetX;
                                pos[1] -= offsetY;
                            });
                        });
                        parentInfo.indexes.forEach(index => {
                            data.selectablePoints[index].forEach((pos) => {
                                pos[0] -= offsetX;
                                pos[1] -= offsetY;
                            });
                        });
                        isMoveInnerScroll = true;
                    }
                }
                if (!isMoveInnerScroll) {
                    data.selectablePoints.forEach((points: number[][]) => {
                        points.forEach((pos) => {
                            pos[0] -= offsetX;
                            pos[1] -= offsetY;
                        });
                    });
                }
                this._refreshGroups(data);

                boundArea.left -= offsetX;
                boundArea.right -= offsetX;
                boundArea.top -= offsetY;
                boundArea.bottom -= offsetY;

                this.gesto.scrollBy(
                    offsetX,
                    offsetY,
                    inputEvent.inputEvent,
                    // false
                );
                this._checkSelected(this.gesto.getCurrentEvent());
            });
    }
    private _select(
        selectedTargets: ElementType[],
        rect: Rect,
        e: OnDragEvent,
        isStart?: boolean,
        isDragStartEnd = false,
    ) {
        const inputEvent = e.inputEvent;
        const data = e.data;
        const result = this.setSelectedTargets(selectedTargets);
        const { added, removed, prevList, list } = diff(
            data.startSelectedTargets,
            selectedTargets,
        );

        const startResult = {
            startSelected: prevList,
            startAdded: added.map(i => list[i]),
            startRemoved: removed.map(i => prevList[i]),
        };


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
                ...result,
                ...startResult,
                rect,
                inputEvent,
                data: data.data,
                isTrusted: e.isTrusted,
                isDragStartEnd,
            });
        }
        if (result.added.length || result.removed.length) {
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
                ...result,
                ...startResult,
                rect,
                inputEvent,
                data: data.data,
                isTrusted: e.isTrusted,
                isDragStartEnd,
            });
        }
    }
    private _selectEnd(
        startSelectedTargets: ElementType[],
        startPassedTargets: ElementType[],
        rect: Rect,
        e: OnDragEvent,
        isDragStartEnd: boolean = false,
    ) {
        const { inputEvent, isDouble, data } = e;
        const type = inputEvent && inputEvent.type;
        const isDragStart = type === "mousedown" || type === "touchstart";

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
            startSelected: startSelectedTargets,
            beforeSelected: startPassedTargets,
            selected: this.selectedTargets,
            added: added.map((index) => list[index]),
            removed: removed.map((index) => prevList[index]),
            afterAdded: afterAdded.map((index) => afterList[index]),
            afterRemoved: afterRemoved.map((index) => afterPrevList[index]),
            isDragStart: isDragStart && isDragStartEnd,
            isDragStartEnd: isDragStart && isDragStartEnd,
            isClick: !!e.isClick,
            isDouble: !!isDouble,
            rect,
            inputEvent,
            data: data.data,
            isTrusted: e.isTrusted,
        });
    }
    private _onDragStart = (e: OnDragStart<Gesto>, clickedTarget?: Element) => {
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
        const win = getWindow(this.container);
        data.innerWidth = win.innerWidth;
        data.innerHeight = win.innerHeight;
        this.findSelectableTargets(data);
        data.startSelectedTargets = this.selectedTargets;
        data.scaleMatrix = createMatrix();
        data.containerX = 0;
        data.containerY = 0;


        const container = this.container;
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
                    rectElement = getDocument(container).querySelector(boundElement);
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
        let firstPassedTargets: ElementType[] = [];

        // allow click on select
        const allowClickBySelectEnd = selectByClick && !clickBySelectEnd;
        let hasInsideTargets = false;

        if (!selectFromInside || allowClickBySelectEnd) {
            const pointTarget = this._findElement(
                clickedTarget || inputEvent.target, // elementFromPoint(clientX, clientY),
                data.selectableTargets,
            );

            hasInsideTargets = !!pointTarget;
            if (allowClickBySelectEnd) {
                firstPassedTargets = pointTarget ? [pointTarget] : [];
            }
        }
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
            !(e).isClick && isTrusted
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
            firstPassedTargets,
            hitRect,
            e,
            true,
            isPreventSelect && selectByClick && !clickBySelectEnd && preventDragFromInside,
        );
        data.startX = clientX;
        data.startY = clientY;
        data.selectFlag = false;
        data.preventDragFromInside = false;

        if (inputEvent.target) {
            const offsetPos = calculateMatrixDist(data.scaleMatrix, [
                clientX - data.containerX,
                clientY - data.containerY,
            ]);
            this.target.style.cssText += `position: ${rootContainer ? "absolute" : "fixed"};`
                + `left:0px;top:0px;`
                + `transform: translate(${offsetPos[0]}px, ${offsetPos[1]}px)`;
        }

        if (isPreventSelect && selectByClick && !clickBySelectEnd) {
            inputEvent.preventDefault();

            // prevent drag from inside when selectByClick is true and force call `selectEnd`
            if (preventDragFromInside) {
                this._selectEnd(
                    data.startSelectedTargets,
                    data.startPassedTargets,
                    hitRect,
                    e,
                    true,
                );
                data.preventDragFromInside = true;
            }
        } else {
            data.selectFlag = true;
            // why?
            // if (type === "touchstart") {
            //     inputEvent.preventDefault();
            // }
            const { scrollOptions, innerScrollOptions } = this.options;

            let isInnerScroll = false

            if (innerScrollOptions) {
                const inputEvent = e.inputEvent;
                const target = inputEvent.target;

                let innerScrollElement: HTMLElement | null = null;
                let parentElement = target;

                while (parentElement && parentElement !== getDocument(container).body) {

                    const overflow = getComputedStyle(parentElement).overflow !== "visible";

                    if (overflow) {
                        innerScrollElement = parentElement;
                        break;
                    }
                    parentElement = parentElement.parentElement;
                }
                if (innerScrollElement) {
                    data.innerScrollOptions = {
                        container: innerScrollElement,
                        checkScrollEvent: true,
                        ...(innerScrollOptions === true ? {} : innerScrollOptions),
                    };
                    this.dragScroll.dragStart(e, data.innerScrollOptions);

                    isInnerScroll = true;
                }
            }
            if (!isInnerScroll && scrollOptions && scrollOptions.container) {
                this.dragScroll.dragStart(e, scrollOptions);
            }

            if (isPreventSelect && selectByClick && clickBySelectEnd) {
                data.selectFlag = false;
                e.preventDrag();
            }
        }
        return true;
    };
    private _checkSelected(e: any, rect = getRect(e, this.options.ratio)) {
        const { data } = e;
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
        let selectedTargets: ElementType[] = [];
        if (selectFlag) {
            this.target.style.cssText +=
                `display: block;` +
                `left:0px;top:0px;` +
                `transform: translate(${offsetPos[0]}px, ${offsetPos[1]}px);` +
                `width:${offsetSize[0]}px;height:${offsetSize[1]}px;`;

            const passedTargets = this.hitTest(
                rect,
                data,
                true,
                e,
            );
            selectedTargets = passTargets(
                data.startPassedTargets,
                passedTargets,
                this.continueSelect && this.continueSelectWithoutDeselect,
            );
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
            this._select(selectedTargets, rect, e);
        }
    }
    private _onDrag = (e: OnDrag) => {
        if (e.data.selectFlag) {
            const scrollOptions = this.scrollOptions;
            const innerScrollOptions = e.data.innerScrollOptions;
            const hasScrollOptions = innerScrollOptions || scrollOptions?.container;

            // If it is a scrolling position, pass drag
            if (hasScrollOptions && !e.isScroll && this.dragScroll.drag(e, innerScrollOptions || scrollOptions)) {
                return;
            }
        }
        this._checkSelected(e);
    };
    private _onDragEnd = (e: OnDragEvent) => {
        const { data, inputEvent } = e;
        const rect = getRect(e, this.options.ratio);
        const selectFlag = data.selectFlag;
        const container = this.container;

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
                inputEvent?.target || elementFromPoint(container, e.clientX, e.clientY),
                data.selectableTargets,
            );
            this._select(pointTarget ? [pointTarget] : [], rect, e);
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
                keys.some((key: string) => key === singleKey)
            );
        }
        return toggleKeys.some((keys) =>
            keys.every((key: string) => combi.indexOf(key) > -1)
        );
    }
    private _onKeyDown = (e: KeyControllerEvent) => {
        const options = this.options;
        let isKeyDown = false;

        if (!this._keydownContinueSelect) {
            const result = this._sameCombiKey(e, options.toggleContinueSelect);

            this._keydownContinueSelect = result;
            isKeyDown ||= result;
        }
        if (!this._keydownContinueSelectWithoutDeselection) {
            const result = this._sameCombiKey(e, options.toggleContinueSelectWithoutDeselect);

            this._keydownContinueSelectWithoutDeselection = result;
            isKeyDown ||= result;
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
    private _onKeyUp = (e: KeyControllerEvent) => {
        const options = this.options;
        let isKeyUp = false;

        if (this._keydownContinueSelect) {
            const result = this._sameCombiKey(e, options.toggleContinueSelect, true);
            this._keydownContinueSelect = !result;

            isKeyUp ||= result;
        }
        if (this._keydownContinueSelectWithoutDeselection) {
            const result = this._sameCombiKey(e, options.toggleContinueSelectWithoutDeselect, true);
            this._keydownContinueSelectWithoutDeselection = !result;

            isKeyUp ||= result;
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
        const doc = getDocument(this.container);

        if (!this.gesto.isFlag()) {
            return;
        }
        let dragContainer = this.dragContainer;

        if (dragContainer === getWindow(this.container)) {
            dragContainer = doc.documentElement;
        }
        const containers = isNode(dragContainer)
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
    private _findElement(clickedTarget: ElementType, selectableTargets: Element[]) {
        let pointTarget = clickedTarget;

        while (pointTarget) {
            if (selectableTargets.indexOf(pointTarget) > -1) {
                break;
            }
            pointTarget = pointTarget.parentElement;
        }
        return pointTarget;
    }
    private _refreshGroups(data: IObject<any>) {
        const innerWidth = data.innerWidth;
        const innerHeight = data.innerHeight;
        const selectablePoints: number[][][] = data.selectablePoints;

        if (this.options.checkOverflow) {
            const innerScrollContainer = this.gesto.getEventData().innerScrollOptions?.container;
            const parentMap: Map<Element, InnerParentInfo> = data.selectableInnerScrollParentMap;
            const innerScrollPathsList: Element[][] = data.selectableInnerScrollPathsList;

            data.selectableInners = innerScrollPathsList.map((innerScrollPaths, i) => {
                let isAlwaysTrue = false;
                return innerScrollPaths.every(target => {
                    if (isAlwaysTrue) {
                        return true;
                    }
                    if (target === innerScrollContainer) {
                        isAlwaysTrue = true;
                        return true;
                    }

                    const rect = parentMap.get(target);

                    if (rect) {
                        const points1 = selectablePoints[i];
                        const points2 = rect.points;
                        const overlapPoints = getOverlapPoints(points1, points2);

                        if (!overlapPoints.length) {
                            return false;
                        }
                    }
                    return true;
                });
            });
        }
        if (!innerWidth || !innerHeight) {
            data.innerGroups = null;
        } else {
            const selectablePoints: number[][][] = data.selectablePoints;

            const groups: Record<string | number, Record<string | number, number[]>> = {};

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
                        groups[x][y] = groups[x][y] || [];

                        groups[x][y].push(i);
                    }
                }
            });

            data.innerGroups = groups;
        }
    }
}

interface Selecto extends SelectoProperties { }

export default Selecto;
