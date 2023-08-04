import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import Selecto from "react-selecto";
import { SELECT_EVENT_TEMPLATE, HTML_TEMPLATE, CSS_TEMPLATE, PREVIEWS_TEMPLATE } from "../../template/SelectoTemlate";

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
                select: SELECT_EVENT_TEMPLATE,
            },
        ),
    ],
});

function App() {
    const cubes = Array.from({ length: 60 }, (_, i) => i);
    
    return <div className="app">
        <div className="container">
            <div className="logo" id="logo">
                <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
            </div>
            <h1>Select in real time.</h1>
            <p className="description">The <strong>select</strong> event allows you to select a target in real time.</p>

            <Selecto
                dragContainer={".elements"}
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
                ratio={number("ratio", 0)}
            ></Selecto>
            <div className="elements selecto-area" id="selecto1">
                {cubes.map(i => <div className="cube" key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}
