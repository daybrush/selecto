import type { ElementType, Hypertext, Point, Rect } from "./types";
import { IObject, addClass, hasClass, calculateBoundSize, getDist, getDocument } from "@daybrush/utils";
import { diff } from "@egjs/children-differ";
import { getMinMaxs } from "overlap-area";

export function getClient(e: MouseEvent | TouchEvent) {
    if ("touches" in e) {
        const touch = e.touches[0] || e.changedTouches[0];

        return {
            clientX: touch.clientX,
            clientY: touch.clientY,
        };
    } else {
        return {
            clientX: e.clientX,
            clientY: e.clientY,
        };
    }
}
export function filterDuplicated<T>(arr: T[]): T[] {
    if (typeof Map === "undefined") {
        return arr.filter((value, index) => {
            return arr.indexOf(value) === index;
        });
    }
    const map = new Map<T, true>();
    return arr.filter(value => {
        if (map.has(value)) {
            return false;
        }
        map.set(value, true);
        return true;
    });
}

export function elementFromPoint(baseNode: Node, clientX: number, clientY: number): ElementType | null {
    const doc = getDocument(baseNode);

    return (doc.elementFromPoint && doc.elementFromPoint(clientX, clientY)) as any || null;
}

export function createElement(
    jsx: Hypertext,
    prevTarget?: ElementType,
    container?: ElementType,
) {
    const { tag, children, attributes, className, style } = jsx;
    const el = prevTarget || getDocument(container).createElement(tag) as ElementType;

    for (const name in attributes) {
        el.setAttribute(name, attributes[name]);
    }
    const elChildren = el.children;
    children.forEach((child, i) => {
        createElement(child, elChildren[i] as ElementType, el);
    });
    if (className) {
        className.split(/\s+/g).forEach(name => {
            if (name && !hasClass(el, name)) {
                addClass(el, name);
            }
        });
    }
    if (style) {
        const elStyle = el.style;
        for (const name in style) {
            elStyle[name] = style[name];
        }
    }
    if (!prevTarget && container) {
        container.appendChild(el);
    }
    return el;
}
export function h(
    tag: string,
    attrs: IObject<any>,
    ...children: Hypertext[]
): Hypertext {
    const {
        className = "",
        style = {},
        ...attributes
    } = attrs || {};
    return {
        tag,
        className,
        style,
        attributes,
        children,
    };
}

export function diffValue<T>(prev: T, cur: T, func: (prev: T, cur: T) => void) {
    if (prev !== cur) {
        func(prev, cur);
    }
}
export function isFastInside(point: number[], points: number[][]) {
    const { minX, minY, maxX, maxY } = getMinMaxs(points);
    const [x, y] = point;

    return minX <= x && x <= maxX && minY <= y && y <= maxY;
}
export function getFastOverlapPoints(points1: number[][], points2: number[][]) {
    const {
        minX: minX1,
        minY: minY1,
        maxX: maxX1,
        maxY: maxY1,
    } = getMinMaxs(points1);
    const {
        minX: minX2,
        minY: minY2,
        maxX: maxX2,
        maxY: maxY2,
    } = getMinMaxs(points2);

    if (maxX2 < minX1 || maxX1 < minX2 || maxY2 < minY1 || maxY1 < minY2) {
        return [];
    }
    const width = Math.min(maxX2 - minX1, maxX1 - minX2);
    const height = Math.min(maxY2 - minY1, maxY1 - minY2);

    return [
        [0, 0],
        [width, 0],
        [width, height],
        [0, height],
    ];
}
export function getRect(
    e: any, ratio: number,
    boundArea = e.data.boundArea,
): Rect {
    let {
        distX = 0,
        distY = 0,
    } = e;
    const { startX, startY } = e.data;

    if (ratio > 0) {
        const nextHeight = Math.sqrt((distX * distX + distY * distY) / (1 + ratio * ratio));
        const nextWidth = ratio * nextHeight;

        distX = (distX >= 0 ? 1 : -1) * nextWidth;
        distY = (distY >= 0 ? 1 : -1) * nextHeight;
    }
    let width = Math.abs(distX);
    let height = Math.abs(distY);

    const maxWidth = distX < 0 ? startX - boundArea.left : boundArea.right - startX;
    const maxHeight = distY < 0 ? startY - boundArea.top : boundArea.bottom - startY;

    [width, height] = calculateBoundSize([width, height], [0, 0], [maxWidth, maxHeight], !!ratio);
    distX = (distX >= 0 ? 1 : -1) * width;
    distY = (distY >= 0 ? 1 : -1) * height;

    const tx = Math.min(0, distX);
    const ty = Math.min(0, distY);
    const left = startX + tx;
    const top = startY + ty;

    return {
        left,
        top,
        right: left + width,
        bottom: top + height,
        width,
        height,
    };
}

export function getDefaultElementRect(el: ElementType): Point {
    const rect = el.getBoundingClientRect();
    const { left, top, width, height } = rect;

    return {
        pos1: [left, top],
        pos2: [left + width, top],
        pos3: [left, top + height],
        pos4: [left + width, top + height],
    };
}

export function passTargets(
    beforeTargets: ElementType[],
    afterTargets: ElementType[],
    continueSelectWithoutDeselect: boolean,
) {
    const {
        list,
        prevList,
        added,
        removed,
        maintained,
    } = diff(beforeTargets, afterTargets);

    return [
        ...added.map(index => list[index]),
        ...removed.map(index => prevList[index]),
        ...continueSelectWithoutDeselect ? maintained.map(([, nextIndex]) => list[nextIndex]) : [],
    ];
}

export function getLineSize(points: number[][]) {
    let size = 0;
    const length = points.length;

    for (let i = 1; i < length; ++i) {
        size = Math.max(getDist(points[i], points[i - 1]), size);
    }

    return size;
}
