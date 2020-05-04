import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withPreview, DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import Selecto from "react-selecto";
import Scene from "scenejs";
import "../welcom.css";
import "../../template/index.css";
import { WELCOME_REACT_PREVIEW } from "../preview/Welcom.preview";
import { CSS_TEMPLATE } from "../../template/SelectoTemlate";

const story = storiesOf("Selecto", module).addDecorator(withPreview);
story.add("Welcome", () => {
    const cubes: number[] = [];

    for (let i = 0; i < 48; ++i) {
        cubes.push(i);
    }

    React.useEffect(() => {
        new Scene({
            "#logo .selection": {
                0: {
                    width: "0px",
                    height: "0px",
                },
                1.2: {
                    width: "100px",
                    height: "100px",
                },
                3: {},
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
            },
        }, {
            easing: "ease-in-out",
            iterationCount: "infinite",
            selector: true,
        }).playCSS();
    }, []);
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
                <div className="selection"></div>
                <div className="cursor"><img alt="logo" src="https://daybrush.com/selecto/images/cursor.png" /></div>
            </div>
            <h1>Selecto.js</h1>
            <p className="description">Selecto.js is a component that allows you to select elements in the drag area using the mouse or touch.</p>
            <div className="buttons">
                <a href="https://github.com/daybrush/selecto" target="_blank"><button className="button">Github</button></a> <a href="https://daybrush.com/selecto/release/latest/doc/" target="_blank"><button className="button">API</button></a> <a href="https://github.com/daybrush/scena" target="_blank"><button className="button">Scena</button></a>
            </div>
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
                hitRate={10}
                selectFromInside={false}
                selectByClick={false}
                toggleContinueSelect={"shift"}
            ></Selecto>
             <div className="elements selecto-area" id="selecto1">
                <h2>◼️ Select Anything.</h2>
                {cubes.map(i => <div className="cube" key={i}></div>)}
            </div>
            <div className="elements selecto-area" id="selecto2">
                <h2>📦 Select Packages.</h2>
                <a className="element react" href="https://github.com/daybrush/selecto/tree/master/packages/react-selecto" target="_blank"><span className="symbol">R</span><span className="name">React</span></a>
                <a className="element angular" href="https://github.com/daybrush/selecto/tree/master/packages/ngx-selecto" target="_blank"><span className="symbol">Ng</span><span className="name">Angular</span></a>
                <a className="element preact" href="https://github.com/daybrush/selecto/tree/master/packages/preact-selecto" target="_blank"><span className="symbol">Pr</span><span className="name">Preact</span></a>
                <a className="element vue" href="https://github.com/daybrush/selecto/tree/master/packages/vue-selecto" target="_blank"><span className="symbol">V</span><span className="name">Vue</span></a>
                <a className="element svelte" href="https://github.com/daybrush/selecto/tree/master/packages/svelte-selecto" target="_blank"><span className="symbol">Sv</span><span className="name">Svelte</span></a>
                <a className="element lit" href="https://github.com/daybrush/selecto/tree/master/packages/lit-selecto" target="_blank"><span className="symbol">L</span><span className="name">Lit</span></a>
            </div>
            <div className="elements selecto-area" id="selecto2">
                <h2>🔥 Select Projects.</h2>
                <a className="element scenejs" href="https://github.com/daybrush/scenejs" target="_blank"><span className="symbol">Sn</span><span className="name">Scene.js</span></a>
                <a className="element moveable" href="https://github.com/daybrush/moveable" target="_blank"><span className="symbol">Mv</span><span className="name">Moveable</span></a>
                <a className="element drag" href="https://github.com/daybrush/drag" target="_blank"><span className="symbol">Dr</span><span className="name">Drag</span></a>
                <a className="element ruler" href="https://github.com/daybrush/ruler" target="_blank"><span className="symbol">Ru</span><span className="name">Ruler</span></a>
                <a className="element drag" href="https://github.com/daybrush/keycon" target="_blank"><span className="symbol">K</span><span className="name">Keycon</span></a>
                <a className="element guides" href="https://github.com/daybrush/guides" target="_blank"><span className="symbol">Gd</span><span className="name">Guides</span></a>
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
                    <li>Press the <strong>S</strong> key or the <strong>Sidebar</strong> button to view examples.</li>
                </ol>
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}, {
    preview: [
        // {
        //     tab: "HTML",
        //     template: NORMAL_HTML_TEMPLATE,
        //     language: "html",
        // },
        {
            tab: "CSS",
            template: CSS_TEMPLATE,
            language: "css",
        },
        {
            tab: "React",
            template: WELCOME_REACT_PREVIEW,
            language: "tsx",
            copy: true,
            codesandbox: DEFAULT_REACT_CODESANDBOX(["react-selecto", "react-scenejs"]),
        },
    ],
});
