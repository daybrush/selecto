import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, array } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import Selecto from "react-selecto";
import Moveable from "react-moveable";
import { ON_DRAG_START, ON_DRAG, ON_DRAG_GROUP_START, ON_DRAG_GROUP } from "./utils";
import {
    MOVEABLE_HTML_TEMPLATE, MOVEABLE_PREVIEWS_TEMPLATE, MOVEABLE_CLICK_GROUP_TEMPLATE,
    MOVEABLE_DRAG_TEMPLATE,
    MOVEABLE_DRAG_GROUP_TEMPLATE, SELECTO_DRAG_START_TEMPLATE,
    SELECTO_REAL_TIME_SELECT_TEMPLATE, SELECTO_REAL_TIME_SELECT_END_TEMPLATE,
} from "../../template/MoveableTemplate";
import { CSS_TEMPLATE } from "../../template/SelectoTemlate";

const story = storiesOf("Selecto With Moveable", module).addDecorator(withKnobs).addDecorator(withPreview);

story.add("Select Moveable targets in real time.", () => {
    return <App />;
}, {
    preview: [
        {
            tab: "HTML",
            template: MOVEABLE_HTML_TEMPLATE,
            language: "html",
            knobs: {
                title: `Select Moveable targets in real time.`,
                description: `You can drag and move targets and select them.`,
                selectableTargets: [".selecto-area .cube"],
            },
        },
        {
            tab: "CSS",
            template: CSS_TEMPLATE,
            language: "css",
        },
        ...MOVEABLE_PREVIEWS_TEMPLATE(
            ["selectableTargets", "hitRate", "selectByClick", "selectFromInside", "toggleContinueSelect", "ratio"],
            {
                clickGroup: MOVEABLE_CLICK_GROUP_TEMPLATE,
                drag: MOVEABLE_DRAG_TEMPLATE,
                dragGroup: MOVEABLE_DRAG_GROUP_TEMPLATE,
            },
            {
                dragStart: SELECTO_DRAG_START_TEMPLATE,
                select: SELECTO_REAL_TIME_SELECT_TEMPLATE,
                selectEnd: SELECTO_REAL_TIME_SELECT_END_TEMPLATE,
            },
        ),
    ],
});

function App() {
    const cubes: number[] = [];

    for (let i = 0; i < 30; ++i) {
        cubes.push(i);
    }
    const [targets, setTargets] = React.useState<Array<HTMLElement | SVGElement>>([]);
    const moveableRef = React.useRef<Moveable>(null);
    const selectoRef = React.useRef<Selecto>(null);
    const [frameMap] = React.useState<Map<Element, {
        translate: number[],
    }>>(() => new Map());

    return <div className="moveable app">
        <div className="container">
            <div className="logo logos" id="logo">
                <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" className="selecto" /></a>
                <a href="https://github.com/daybrush/moveable" target="_blank"><img src="https://daybrush.com/moveable/images/256x256.png" /></a>
            </div>
            <h1>Select Moveable targets in real time.</h1>
            <p className="description">You can drag and move targets and select them.</p>
            <Moveable
                ref={moveableRef}
                target={targets}
                draggable={true}
                onClickGroup={e => {
                    selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
                }}
                onDragStart={ON_DRAG_START(frameMap)}
                onDrag={ON_DRAG(frameMap)}
                onDragGroupStart={ON_DRAG_GROUP_START(frameMap)}
                onDragGroup={ON_DRAG_GROUP(frameMap)}
            />
            <Selecto
                ref={selectoRef}
                dragContainer={".elements"}
                selectableTargets={[".target"]}
                hitRate={number("hitRate", 0)}
                selectByClick={boolean("selectByClick", true)}
                selectFromInside={boolean("selectFromInside", false)}
                toggleContinueSelect={array("toggleContinueSelect", ["shift"])}
                ratio={number("ratio", 0)}
                onDragStart={(e: any) => {
                    const target = e.inputEvent.target;
                    if (
                        moveableRef.current!.isMoveableElement(target)
                        || targets!.some(t => t === target || t.contains(target))
                    ) {
                        e.stop();
                    }
                }}
                onSelect={e => {
                    setTargets(e.selected);
                }}
                onSelectEnd={e => {
                    if (e.isDragStart) {
                        setTimeout(() => {
                            e.inputEvent.preventDefault();
                            moveableRef.current!.dragStart(e.inputEvent);
                        });
                    }
                }}
            />
            <div className="elements selecto-area">
                {cubes.map(i => <div className="cube target" key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}
