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
    ".selection": {
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
    ".cursor": {
        0: {
            transform: "translate(0px, 0px)",
        },
        1.2: {
            transform: "translate(100px, 100px)",
        },
    },
    ".select1": {
        0.3: {
            "background-color": "#ccc",
        },
        0.7: {
            "background-color": "#4af",
        },
    },
    ".select2": {
        0.8: {
            "background-color": "#ccc",
        },
        1.2: {
            "background-color": "#4af",
        },
    }
};
story.add("Welcome", () => {
    return <div className="app">
        <div className="logo">
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
                <div className="cursor"><img src="https://daybrush.com/selecto/images/cursor.png"/></div>
            </Scene>
        </div>
        <h1>Selecto.js</h1>
        <p className="description">Selecto.js is a component that allows you to select elements in the drag area using the mouse or touch.</p>
        <a href="https://github.com/daybrush/selecto" target="_blank"><button className="button">Github</button></a> <a href="https://daybrush.com/selecto/release/latest/doc/" target="_blank"><button className="button">API</button></a> <a href="https://github.com/daybrush/scena" target="_blank"><button className="button">Scena</button></a>
        
    </div>;

});


