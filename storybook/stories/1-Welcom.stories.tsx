import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from "@storybook/addon-actions";
import { withKnobs, number } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import Selecto from "react-selecto";
import { Scene } from "react-scenejs";
import "./index.css";

const story = storiesOf("Selecto", module);
const keyframes = {
    "#logo .selection": {
        0: {
            width: "0px",
            height: "0px",
        },
        1.2: {
            width: "100px",
            height: "100px",
        },
        3: {}
    },
    "#logo .cursor": {
        0: {
            transform: "translate(0px, 0px)",
        },
        1.2: {
            transform: "translate(100px, 100px)",
        },
    },
    "#logo .select1": {
        0.3: {
            "background-color": "#eee",
        },
        0.7: {
            "background-color": "#4af",
        },
    },
    "#logo .select2": {
        0.8: {
            "background-color": "#eee",
        },
        1.2: {
            "background-color": "#4af",
        },
    }
};
story.add("Welcome", () => {
    return <div className="app">
        <div className="container">
            <div className="logo" id="logo">
                <div className="cube select1"></div>
                <div className="cube select2"></div>
                <div className="cube"></div>
                <div className="cube select2"></div>
                <div className="cube select2"></div>
                <div className="cube"></div>
                <div className="cube"></div>
                <div className="cube"></div>
                <Scene iterationCount="infinite" easing={"ease-out"} keyframes={keyframes} css={true} autoplay>
                    <div className="selection"></div>
                    <div className="cursor"><img src="https://daybrush.com/selecto/images/cursor.png" /></div>
                </Scene>
            </div>
            <h1>Selecto.js</h1>
            <p className="description">Selecto.js is a component that allows you to select elements in the drag area using the mouse or touch.</p>
            <div className="buttons">
                <a href="https://github.com/daybrush/selecto" target="_blank"><button className="button">Github</button></a> <a href="https://daybrush.com/selecto/release/latest/doc/" target="_blank"><button className="button">API</button></a> <a href="https://github.com/daybrush/scena" target="_blank"><button className="button">Scena</button></a>
            </div>

            <Selecto
                dragContainer={window}
                selectableTargets={["#selecto2 .element", "#selecto3 li"]}
                onSelect={e => {
                    e.added.forEach(el => {
                        el.classList.add("selected");
                    });
                    e.removed.forEach(el => {
                        el.classList.remove("selected");
                    });
                }}
                hitRate={10}
                selectFromInside={false}
                selectByClick={false}
                toggleContinueSelect={"shift"}
            ></Selecto>
            <div className="elements selecto-area" id="selecto2">
                <h2>📦 Select Packages.</h2>
                <a className="element react" href="https://github.com/daybrush/selecto/tree/master/packages/react-selecto" target="_blank"><div className="symbol">R</div><div className="name">React</div></a>
                <div className="element angular"><div className="symbol">Ng</div><div className="name">Angular</div></div>
                <div className="element preact"><div className="symbol">Pr</div><div className="name">Preact</div></div>
                <div className="element vue"><div className="symbol">V</div><div className="name">Vue</div></div>
                <div className="element svelte"><div className="symbol">Sv</div><div className="name">Svelte</div></div>
                <div className="element lit"><div className="symbol">L</div><div className="name">Lit</div></div>
            </div>
            <div className="elements selecto-area" id="selecto2">
                <h2>🔥 Select Projects.</h2>
                <div className="element scenejs"><div className="symbol">Sn</div><div className="name">Scene.js</div></div>
                <div className="element moveable"><div className="symbol">Mv</div><div className="name">Moveable</div></div>
                <div className="element drag"><div className="symbol">Dr</div><div className="name">Drag</div></div>
                <div className="element ruler"><div className="symbol">Ru</div><div className="name">Ruler</div></div>
                <div className="element drag"><div className="symbol">K</div><div className="name">Keycon</div></div>
                <div className="element guides"><div className="symbol">Gd</div><div className="name">Guides</div></div>
            </div>
            <div className="elements selecto-area" id="selecto3">
                <h2>📝 Select Codes</h2>
                <ol>
                    <li>Press the <strong>A</strong> key or the <strong>Addons</strong> button to view the <strong>Code Preview</strong> tab.</li>
                    <li>You can see the story on the screen as code in various frameworks, and in <strong>CodeSandBox</strong>.</li>
                </ol>
            </div>
            <div className="elements selecto-area" id="selecto3">
                <h2>🚀 Select Examples</h2>
                <ol>
                    <li><a href="#" target="_parent">Select in real time.</a></li>
                    <li><a href="#" target="_parent">Only select at start and end.</a></li>
                    <li><a href="#" target="_parent">Only select at end.</a></li>
                    <li><a href="#" target="_parent">Continue to select.</a></li>
                    <li><a href="#" target="_parent">Continue to select through the toggle key.</a></li>
                </ol>
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;

});


