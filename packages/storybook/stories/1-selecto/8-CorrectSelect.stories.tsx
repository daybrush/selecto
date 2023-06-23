import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import Selecto, { OnDrag, OnSelect } from "react-selecto";
import {
    SELECT_START_EVENT_TEMPLATE,
    SELECT_EVENT_TEMPLATE,
    HTML_TEMPLATE, CSS_TEMPLATE,
    PREVIEWS_TEMPLATE, DRAG_EVENT_TEMPLATE
} from "../../template/CorrectSelect";
import { getElementInfo } from "react-moveable";
import { getAreaSize, getOverlapPoints } from "overlap-area";


const story = storiesOf("Selecto", module).addDecorator(withKnobs).addDecorator(withPreview);

story.add("Select accurately", () => {
    return <App />;
}, {
    preview: [
        {
            tab: "HTML",
            template: HTML_TEMPLATE,
            language: "html",
            knobs: {
                title: `Select accurately.`,
                description: `Select accurately by using pos1, pos2, pos3, and pos4.`,
                selectableTargets: [".correct .target"],
            },
        },
        {
            tab: "CSS",
            template: CSS_TEMPLATE,
            language: "css",
        },
        ...PREVIEWS_TEMPLATE(
            ["selectableTargets", "hitRate", "selectByClick", "selectFromInside", "ratio"],
            {
                selectStart: SELECT_START_EVENT_TEMPLATE,
                drag: DRAG_EVENT_TEMPLATE,
                select: SELECT_EVENT_TEMPLATE,
            },
        ),
    ],
});

function App() {
    const svgRef = React.useRef<SVGSVGElement>(null);
    const pathRef = React.useRef<SVGPathElement>(null);

    function drawPath(e: OnDrag | OnSelect) {
        const svgRect = svgRef.current!.getBoundingClientRect();
        const targets = e.currentTarget.getSelectedTargets();

        pathRef.current!.setAttribute("d", targets.map(target => {
            const rect = e.rect;
            const rectPoints = [
                [rect.left, rect.top],
                [rect.right, rect.top],
                [rect.right, rect.bottom],
                [rect.left, rect.bottom],
            ];

            const points = getOverlapPoints(
                e.currentTarget.getElementPoints(target),
                rectPoints,
            ).map(p => [p[0] - svgRect.left, p[1] - svgRect.top]);
            target.innerHTML = `${Math.round(getAreaSize(points))}`;

            return points.length ? `M ${points.join(", L")} Z` : "";
        }).join(" "));
    }

    return <div className="app">
        <div className="container">
            <div className="logo" id="logo">
                <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
            </div>
            <h1>Select accurately.</h1>
            <p className="description">Select accurately by using pos1, pos2, pos3, and pos4.</p>

            <Selecto
                dragContainer={".container"}
                selectableTargets={[".correct .target"]}
                onSelectStart={e => {
                    e.removed.forEach(target => {
                        target.innerHTML = "0";
                    });
                    drawPath(e);
                }}
                onSelect={e => {
                    e.removed.forEach(target => {
                        target.innerHTML = "0";
                    });
                }}
                onDrag={e => {
                    drawPath(e);
                }}
                hitRate={number("hitRate", 20)}
                selectByClick={boolean("selectByClick", true)}
                selectFromInside={boolean("selectFromInside", true)}
                getElementRect={getElementInfo}
                preventDefault={true}
                ratio={number("ratio", 0)}
            ></Selecto>
            <div className="elements correct">
                <div className="target" style={{background: "#e55"}}>0</div>
                <div className="target" style={{transform: "rotate(45deg)", background: "#77dda5" }}>0</div>
                <div className="target" style={{transform: "skew(-30deg)", background: "#7799ee" }}>0</div>
                <svg ref={svgRef}>
                    <path d="" ref={pathRef}></path>
                </svg>
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}
