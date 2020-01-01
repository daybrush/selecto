import React from "react";
import Selecto from "./react-selecto/Selecto";
import "./App.css";
class App extends React.Component {
    public render() {
        return (<div className="container">
            <div className="button"> Shift </div>
            <div className="target" style={{
                top: "50px",
                left: "50px",
                width: "50px",
                height: "50px",
            }}></div>
            <div className="target" style={{
                top: "50px",
                left: "150px",
                width: "150px",
                height: "50px",
            }}></div>
            <div className="target" style={{
                top: "150px",
                left: "50px",
                width: "100px",
                height: "50px",
            }}></div>
            <div className="target" style={{
                top: "300px",
                left: "250px",
                width: "50px",
                height: "150px",
            }}></div>
            <div className="target" style={{
                top: "200px",
                left: "400px",
                width: "100px",
                height: "100px",
            }}></div>
            <div className="target" style={{
                top: "300px",
                left: "50px",
                width: "50px",
                height: "50px",
            }}></div>
            <div className="target2" style={{
                top: "330px",
                left: "80px",
                width: "120px",
                height: "120px",
            }}></div>
            <Selecto
                selectableTargets={[".target"]}
                dragContainer={document.body}
                hitRate={40}
                selectFromInside={false}
                toggleContinueSelect={"shift"}
                onKeydown={() => {
                    document.querySelector(".button")!.classList.add("selected");
                }}
                onKeyup={() => {
                    document.querySelector(".button")!.classList.remove("selected");
                }}
                onSelectStart={e => {
                    console.log("start", e);
                    e.added.forEach(el => {
                        el.classList.add("selected");
                    });
                    e.removed.forEach(el => {
                        el.classList.remove("selected");
                    });
                }}
                onSelectEnd={e => {
                    console.log("end", e);
                    e.afterAdded.forEach(el => {
                        el.classList.add("selected");
                    });
                    e.afterRemoved.forEach(el => {
                        el.classList.remove("selected");
                    });
                }}
                />
        </div>);
    }
}

export default App;
