import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from "@storybook/addon-actions";
import { withKnobs, number } from "@storybook/addon-knobs";
import { withPreview } from "storybook-addon-preview";
import Selecto from "react-selecto";
import { Scene } from "react-scenejs";

const story = storiesOf("Selecto", module);
const keyframes = {
    ".selection": {
        0: {
            width: "0px",
            height: "0px",
        },
        1: {
            width: "100px",
            height: "100px",
        },
    },
    ".cursor": {
        0: {
            transform: "translate(0px, 0px)",
        },
        1: {
            transform: "translate(100px, 100px)",
        },
    },
};
story.add("Welcome", () => {
    return <div>
        <div className="logo">
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="cube"></div>
            <div className="cube"></div>
            <Scene iterationCount="infinite" keyframes={keyframes} css={true}>
                <div className="selection"></div>
                <div className="cursor"></div>
            </Scene>
        </div>
        <h1>Selecto.js</h1>
        <p className="description">Selecto.js is a component that allows you to select elements in the drag area using the mouse or touch.</p>
        <div className="button">Download</div> / <div className="button">API</div> / <div className="button"> Scena </div>
    </div>;

});


