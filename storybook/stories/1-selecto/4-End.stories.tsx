import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean } from "@storybook/addon-knobs";
import { withPreview, DEFAULT_REACT_CODESANDBOX, previewTemplate, raw, DEFAULT_VANILLA_CODESANDBOX } from "storybook-addon-preview";
import Selecto from "react-selecto";
import { SELECT_ONLY_END_EVENT_TEMPLATE, REACT_SELCTO_TEMPLATE, HTML_TEMPLATE, VANILLA_TEMPLATE, CSS_TEMPLATE } from "../../template/SelectoTemlate";

const story = storiesOf("Selecto", module).addDecorator(withKnobs).addDecorator(withPreview);

story.add("Only select at end.", () => {
    return <App />;
}, {
    preview: [
        {
            tab: "HTML",
            template: HTML_TEMPLATE,
            language: "html",
            knobs: {
                title: `Only select at end.`,
                description: `You can select the target through the <strong>selectEnd</strong> event.`,
            },
        },
        {
            tab: "CSS",
            template: CSS_TEMPLATE,
            language: "css",
        },
        {
            tab: "Vanilla",
            template: VANILLA_TEMPLATE(
                ["hitRate", "selectByClick", "selectFromInside"],
                {
                    selectEnd: SELECT_ONLY_END_EVENT_TEMPLATE,
                },
            ),
            language: "js",
            codesandbox: DEFAULT_VANILLA_CODESANDBOX(["selecto"]),
        },
        {
            tab: "React",
            template: previewTemplate`
import * as React from "react";
import Selecto from "react-selecto";

export default function App() {
    const cubes: number[] = [];

    for (let i = 0; i < 64; ++i) {
        cubes.push(i);
    }
    return <div className="app">
        <div className="container">
            <div className="logo" id="logo">
                <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
            </div>
            <h1>${raw("title")}</h1>
            <p className="description">${raw("description")}</p>
${REACT_SELCTO_TEMPLATE(["hitRate", "selectByClick", "selectFromInside"], [SELECT_ONLY_END_EVENT_TEMPLATE])}
            <div className="elements selecto-area" id="selecto1">
                {cubes.map(i => <div className="cube" key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}`,
            language: "jsx",
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-selecto"]),
        },
    ],
});

function App() {
    const cubes: number[] = [];

    for (let i = 0; i < 64; ++i) {
        cubes.push(i);
    }
    return <div className="app">
        <div className="container">
            <div className="logo" id="logo">
                <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
            </div>
            <h1>Only select at end.</h1>
            <p className="description">You can select the target through the <strong>selectEnd</strong> event.</p>

            <Selecto
                dragContainer={window}
                selectableTargets={["#selecto1 .cube", "#selecto2 .element", "#selecto3 li"]}
                onSelectEnd={e => {
                    e.added.forEach(el => {
                        el.classList.add("selected");
                    });
                    e.removed.forEach(el => {
                        el.classList.remove("selected");
                    });
                }}
                hitRate={number("hitRate", 100)}
                selectByClick={boolean("selectByClick", true)}
                selectFromInside={boolean("selectFromInside", true)}
            ></Selecto>
             <div className="elements selecto-area" id="selecto1">
                {cubes.map(i => <div className="cube" key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}
