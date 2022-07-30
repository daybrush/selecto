import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import Selecto from "react-selecto";
import { SELECT_START_EVENT_TEMPLATE, SELECT_END_EVENT_TEMPLATE, HTML_TEMPLATE, CSS_TEMPLATE, PREVIEWS_TEMPLATE } from "../../template/SelectoTemlate";

const story = storiesOf("Selecto", module).addDecorator(withKnobs).addDecorator(withPreview);

story.add("Only select at start and end.", () => {
    return <App />;
}, {
    preview: [
        {
            tab: "HTML",
            template: HTML_TEMPLATE,
            language: "html",
            knobs: {
                title: `Only select at start and end.`,
                description: `You can select the target through the <strong>selectStart</strong> and <strong>selectEnd</strong> events.`,
                selectableTargets: [".selecto-area .cube"],
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
                selectEnd: SELECT_END_EVENT_TEMPLATE,
            },
        ),
    ],
});

function App() {
    const cubes: number[] = [];

    for (let i = 0; i < 60; ++i) {
        cubes.push(i);
    }
    return <div className="app">
        <div className="container">
            <div className="logo" id="logo">
                <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
            </div>
            <h1>Only select at start and end.</h1>
            <p className="description">You can select the target through the <strong>selectStart</strong> and <strong>selectEnd</strong> events.</p>
            <Selecto
                dragContainer={".elements"}
                selectableTargets={["#selecto1 .cube", "#selecto2 .element", "#selecto3 li"]}
                onSelectStart={e => {
                    e.added.forEach(el => {
                        el.classList.add("selected");
                    });
                    e.removed.forEach(el => {
                        el.classList.remove("selected");
                    });
                }}
                onSelectEnd={e => {
                    e.afterAdded.forEach(el => {
                        el.classList.add("selected");
                    });
                    e.afterRemoved.forEach(el => {
                        el.classList.remove("selected");
                    });
                }}
                hitRate={number("hitRate", 100)}
                selectByClick={boolean("selectByClick", true)}
                selectFromInside={boolean("selectFromInside", true)}
                ratio={number("ratio", 0)}
            ></Selecto>
            <div className="elements selecto-area" id="selecto1">
                {cubes.map(i => <div className="cube" key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}
