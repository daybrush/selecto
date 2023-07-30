import * as React from "react";
import Moveable from "react-moveable";
import Selecto from "react-selecto";

export default function App(props: Record<string, any>) {
    const [cubes] = React.useState(Array.from({ length: 30 }, (_, i) => i));
    const [targets, setTargets] = React.useState<Array<HTMLElement | SVGElement>>([]);
    const moveableRef = React.useRef<Moveable>(null);
    const selectoRef = React.useRef<Selecto>(null);

    return <div className="moveable app">
        <div className="container">
            <div className="logo logos" id="logo">
                <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" className="selecto" /></a>
                <a href="https://github.com/daybrush/moveable" target="_blank"><img src="https://daybrush.com/moveable/images/256x256.png" /></a>
            </div>
            <h1>Select Moveable targets in real time.</h1>
            <p className="description">You can drag and move targets and select them.</p>
            <Moveable
                ref={moveableRef}
                target={targets}
                draggable={true}
                onClickGroup={e => {
                    selectoRef.current!.clickTarget(e.inputEvent, e.inputTarget);
                }}
                onRender={e => {
                    e.target.style.cssText += e.cssText;
                }}
                onRenderGroup={e => {
                    e.events.forEach(ev => {
                        ev.target.style.cssText += ev.cssText;
                    });
                }}
            />
            <Selecto
                ref={selectoRef}
                dragContainer={".elements"}
                selectableTargets={[".target"]}
                hitRate={props.hitRate}
                selectByClick={props.selectByClick}
                selectFromInside={props.selectFromInside}
                toggleContinueSelect={props.toggleContinueSelect}
                ratio={props.ratio}
                onDragStart={(e: any) => {
                    const target = e.inputEvent.target;
                    if (
                        moveableRef.current!.isMoveableElement(target)
                        || targets!.some(t => t === target || t.contains(target))
                    ) {
                        e.stop();
                    }
                }}
                onSelect={e => {
                    if (e.isDragStartEnd) {
                        return;
                    }
                    setTargets(e.selected);
                }}
                onSelectEnd={e => {
                    if (e.isDragStartEnd) {
                        e.inputEvent.preventDefault();
                        moveableRef.current!.waitToChangeTarget().then(() => {
                            moveableRef.current!.dragStart(e.inputEvent);
                        });
                    }
                    setTargets(e.selected);
                }}
            />
            <div className="elements selecto-area">
                {cubes.map(i => <div className="cube target" key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}
