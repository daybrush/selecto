import { OnDragGroupStart, OnDrag, OnDragStart, OnDragGroup } from "react-moveable";

export function ON_DRAG_START(frameMap: Map<any, any>) {
    return ({ target, set }: OnDragStart) => {
        if (!frameMap.has(target)) {
            frameMap.set(target, {
                translate: [0, 0],
            });
        }
        const frame = frameMap.get(target)!;

        set(frame.translate);
    };
}
export function ON_DRAG_GROUP_START(frameMap: Map<any, any>) {
    const onDragStart = ON_DRAG_START(frameMap);
    return ({ events }: OnDragGroupStart) => {
        events.forEach(e => {
            onDragStart(e);
        });
    };
}
export function ON_DRAG(frameMap: Map<any, any>) {
    return ({ target, beforeTranslate }: OnDrag) => {
        const frame = frameMap.get(target)!;

        frame.translate = beforeTranslate;
        target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px)`;
    }
}
export function ON_DRAG_GROUP(frameMap: Map<any, any>) {
    const onDrag = ON_DRAG(frameMap);
    return ({ events }: OnDragGroup) => {
        events.forEach(e => {
            onDrag(e);
        });
    };
}
