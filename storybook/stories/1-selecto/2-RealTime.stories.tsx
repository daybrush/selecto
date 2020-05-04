import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean } from "@storybook/addon-knobs";
import { withPreview, DEFAULT_REACT_CODESANDBOX, previewTemplate, raw, DEFAULT_VANILLA_CODESANDBOX, DEFAULT_ANGULAR_CODESANDBOX, DEFAULT_VUE_CODESANDBOX, DEFAULT_LIT_CODESANDBOX, DEFAULT_SVELTE_CODESANDBOX, DEFAULT_PREACT_CODESANDBOX } from "storybook-addon-preview";
import Selecto from "react-selecto";
import { REACT_SELCTO_TEMPLATE, SELECT_EVENT_TEMPLATE, HTML_TEMPLATE, REACT_TEMPLATE, VANILLA_TEMPLATE, ANGULAR_HTML_TEMPLATE, ANGULAR_COMPONENT_TEMPLATE, ANGULAR_MODULE_TEMPLATE, VUE_TEMPLATE, CSS_TEMPLATE, LIT_TEMPLATE, SVELTE_JSX_TEMPLATE, SVELTE_SCRIPT_TEMPLATE } from "../../template/SelectoTemlate";

const story = storiesOf("Selecto", module).addDecorator(withKnobs).addDecorator(withPreview);

story.add("Select in real time.", () => {
    return <App />;
}, {
    preview: [
        {
            tab: "HTML",
            template: HTML_TEMPLATE,
            language: "html",
            knobs: {
                title: `Select in real time.`,
                description: `The <strong>select</strong> event allows you to select a target in real time.`,
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
                    select: SELECT_EVENT_TEMPLATE,
                },
            ),
            language: "js",
            codesandbox: DEFAULT_VANILLA_CODESANDBOX(["selecto"]),
        },
        {
            tab: "React",
            template: REACT_TEMPLATE(
                ["hitRate", "selectByClick", "selectFromInside"],
                [SELECT_EVENT_TEMPLATE],
            ),
            language: "jsx",
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-selecto"]),
        },
        {
            tab: "Preact",
            template: REACT_TEMPLATE(
                ["hitRate", "selectByClick", "selectFromInside"],
                [SELECT_EVENT_TEMPLATE],
                true,
            ),
            language: "jsx",
            codesandbox: DEFAULT_PREACT_CODESANDBOX(["preact-selecto"]),
        },
        {
            tab: "Angular",
            description: "app.component.html",
            template: ANGULAR_HTML_TEMPLATE(
                ["hitRate", "selectByClick", "selectFromInside"],
                ["select"],
            ),
            language: "markup",
            codesandbox: DEFAULT_ANGULAR_CODESANDBOX(["ngx-selecto"]),
        },
        {
            tab: "Angular",
            description: "app.component.ts",
            template: ANGULAR_COMPONENT_TEMPLATE(
                [SELECT_EVENT_TEMPLATE],
            ),
            language: "ts",
            codesandbox: DEFAULT_ANGULAR_CODESANDBOX(["ngx-selecto"]),
        },
        {
            tab: "Angular",
            description: "app.component.ts",
            template: ANGULAR_MODULE_TEMPLATE,
            language: "ts",
            codesandbox: DEFAULT_ANGULAR_CODESANDBOX(["ngx-selecto"]),
        },
        {
            tab: "Vue",
            template: VUE_TEMPLATE(
                ["hitRate", "selectByClick", "selectFromInside"],
                ["select"],
                [SELECT_EVENT_TEMPLATE],
            ),
            language: "html",
            codesandbox: DEFAULT_VUE_CODESANDBOX(["vue-selecto"]),
        },
        {
            tab: "Lit",
            template: LIT_TEMPLATE(
                ["hitRate", "selectByClick", "selectFromInside"],
                ["select"],
                [SELECT_EVENT_TEMPLATE],
            ),
            language: "ts",
            codesandbox: DEFAULT_LIT_CODESANDBOX(["lit-selecto"]),
        },
        {
            tab: "Svelte",
            template: SVELTE_SCRIPT_TEMPLATE,
            language: "html",
            codesandbox: DEFAULT_SVELTE_CODESANDBOX(["svelte-selecto"]),
        },
        {
            continue: true,
            tab: "Svelte",
            template: SVELTE_JSX_TEMPLATE(
                ["hitRate", "selectByClick", "selectFromInside"],
                ["select"],
                [SELECT_EVENT_TEMPLATE],
            ),
            language: "tsx",
            codesandbox: DEFAULT_SVELTE_CODESANDBOX(["svelte-selecto"]),
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
            <h1>Select in real time.</h1>
            <p className="description">The <strong>select</strong> event allows you to select a target in real time.</p>

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
            ></Selecto>
            <div className="elements selecto-area" id="selecto1">
                {cubes.map(i => <div className="cube" key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}
