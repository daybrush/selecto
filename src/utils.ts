import { Hypertext, Rect } from "./types";
import { IObject, addClass, hasClass, calculateBoundSize } from "@daybrush/utils";
import { diff } from "@egjs/children-differ";

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

export function createElement(
    jsx: Hypertext,
    prevTarget?: HTMLElement | SVGElement,
    container?: HTMLElement | SVGElement,
) {
    const { tag, children, attributes, className, style } = jsx;
    const el = prevTarget || document.createElement(tag) as HTMLElement | SVGElement;

    for (const name in attributes) {
        el.setAttribute(name, attributes[name]);
    }
    const elChildren = el.children;
    children.forEach((child, i) => {
        createElement(child, elChildren[i] as HTMLElement | SVGElement, el);
    });
    if (className) {
        className.split(" ").forEach(name => {
            if (!hasClass(el, name)) {
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

export function getRect(
    e: any, ratio: number,
    boundArea = e.datas.boundArea,
): Rect {
    let {
        distX = 0,
        distY = 0,
    } = e;
    const { startX, startY } = e.datas;

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

export function getDefaultElementRect(el: HTMLElement | SVGElement) {
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
    beforeTargets: Array<HTMLElement | SVGElement>,
    afterTargets: Array<HTMLElement | SVGElement>,
) {
    const {
        list,
        prevList,
        added,
        removed,
    } = diff(beforeTargets, afterTargets);

    return added.map(index => list[index]).concat(removed.map(index => prevList[index]));
}
