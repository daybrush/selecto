import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, array } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import Selecto from "react-selecto";
import Moveable from "react-moveable";
import "../index.css";
import { ON_DRAG_START, ON_DRAG, ON_DRAG_GROUP_START, ON_DRAG_GROUP } from "./utils";

const story = storiesOf("Selecto With Moveable", module).addDecorator(withKnobs).addDecorator(withPreview);

story.add("You can change the Moveable target in real time by selecting it.", () => {
    const cubes: number[] = [];

    for (let i = 0; i < 32; ++i) {
        cubes.push(i);
    }
    const [targets, setTargets] = React.useState<Array<HTMLElement | SVGElement>>([]);
    const moveableRef = React.useRef<Moveable>(null);
    const selectoRef = React.useRef<Selecto>(null);
    const [frameMap] = React.useState<Map<Element, {
        translate: number[],
    }>>(() => new Map());

    return <div className="app">
        <div className="container">
        <div className="logo" id="logo">
                로고
            </div>
            <h1>You can change the Moveable target in real time by selecting it.</h1>
            <Moveable
                ref={moveableRef}
                target={targets}
                draggable={true}
                onClickGroup={e => {
                    selectoRef.current!.click(e.inputEvent, e.inputTarget);
                }}
                onDragStart={ON_DRAG_START(frameMap)}
                onDrag={ON_DRAG(frameMap)}
                onDragGroupStart={ON_DRAG_GROUP_START(frameMap)}
                onDragGroup={ON_DRAG_GROUP(frameMap)}
            />
        <Selecto
            ref={selectoRef}
            dragContainer={window}
            selectableTargets={[".target"]}
            hitRate={number("hitRate", 0)}
            selectByClick={boolean("selectByClick", true)}
            selectFromInside={boolean("selectFromInside", false)}
            toggleContinueSelect={array("toggleContinueSelect", ["shift"])}
            keyContainer={window}
            onDragStart={(e: any) => {
                const target = e.inputEvent.target;
                if (
                    moveableRef.current?.isMoveableElement(target)
                    || targets!.some(t => t === target || t.contains(target))
                ) {
                    return false;
                }
                return;
            }}
            onSelect={e => {
                setTargets(e.selected);
            }}
            onSelectEnd={e => {
                setTimeout(() => {
                    if (e.isDragStart) {
                        e.inputEvent.preventDefault();
                        moveableRef.current?.dragStart(e.inputEvent);
                    }
                });
            }}
            />
             <div className="elements selecto-area border">
                {cubes.map(i => <div className="cube target" key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}, {
    preview: [
    ],
});
