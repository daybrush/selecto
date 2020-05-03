import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean } from "@storybook/addon-knobs";
import { withPreview, DEFAULT_REACT_CODESANDBOX, DEFAULT_VANILLA_CODESANDBOX } from "storybook-addon-preview";
import Selecto from "react-selecto";
import "../index.css";
import { WELCOME_CSS_PREVIEW } from "../preview/Welcom.preview";
import { SELECT_EVENT_TEMPLATE, HTML_TEMPLATE, REACT_TEMPLATE, VANILLA_TEMPLATE } from "../../teamplate/SelectoTemlate";

const story = storiesOf("Selecto", module).addDecorator(withKnobs).addDecorator(withPreview);

story.add("Continue to select", () => {
    return <App />;
}, {
    preview: [
        {
            tab: "HTML",
            template: HTML_TEMPLATE,
            language: "html",
            knobs: {
                title: `Continue to select.`,
                description: `You can continue to select with the currently selected target.`,
            },
        },
        {
            tab: "CSS",
            template: WELCOME_CSS_PREVIEW,
            language: "css",
        },
        {
            tab: "Vanilla",
            template: VANILLA_TEMPLATE(
                ["hitRate", "selectByClick", "selectFromInside", "continueSelect"],
                {
                    select: SELECT_EVENT_TEMPLATE,
                },
            ),
            language: "js",
            codesandbox: DEFAULT_VANILLA_CODESANDBOX(["selecto"]),
        },
        {
            tab: "React",
            template: REACT_TEMPLATE(
                ["hitRate", "selectByClick", "selectFromInside", "continueSelect"],
                [SELECT_EVENT_TEMPLATE],
            ),
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
            <h1>Continue to select.</h1>
            <p className="description">You can continue to select with the currently selected target.</p>
            <Selecto
                dragContainer={window}
                selectableTargets={["#selecto1 .cube", "#selecto2 .element", "#selecto3 li"]}
                onSelect={e => {
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
                continueSelect={boolean("continueSelect", true)}
            ></Selecto>
            <div className="elements selecto-area" id="selecto1">
                {cubes.map(i => <div className="cube" key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}
