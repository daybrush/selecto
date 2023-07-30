import * as React from "react";
import Selecto from "react-selecto";

export default function App() {
    const [cubes] = React.useState(Array.from({ length: 60 }, (_, i) => i));

    return <div className="app">
        <div className="container">
            <div className="logo" id="logo">
                <img alt="logo" src="https://daybrush.com/selecto/images/256x256.png" />
            </div>
            <h1>Continue to select through the toggle key(shift) with deselect(ctrl).</h1>
            <p className="description">The toggle key allows you to select continuously with the currently selected target.</p>

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
                hitRate={0}
                selectByClick={true}
                selectFromInside={true}
                continueSelect={false}
                continueSelectWithoutDeselect={true}
                toggleContinueSelect={"shift"}
                toggleContinueSelectWithoutDeselect={[["ctrl"], ["meta"]]}
                ratio={0}
            ></Selecto>
            <div className="elements selecto-area" id="selecto1">
                {cubes.map(i => <div className="cube" key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}
