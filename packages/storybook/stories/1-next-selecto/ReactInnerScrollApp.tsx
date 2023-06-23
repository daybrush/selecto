import * as React from "react";
import InfiniteViewer from "react-infinite-viewer";
import Selecto from "react-selecto";

export default function App(props: Record<string, any>) {
    const scrollerRef = React.useRef<HTMLDivElement>(null);
    const selectoRef = React.useRef<Selecto>(null);
    const cubes: number[] = [];

    for (let i = 0; i < 30 * 7; ++i) {
        cubes.push(i);
    }


    return <div className="app">
        <div className="container">
            <div className="logos logo" id="logo">
                <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" className="selecto" /></a>
            </div>
            <h1>Select in the inner scroll area.</h1>
            <p className="description">Selecting the inner scroll area causes scrolling.</p>
            <Selecto
                ref={selectoRef}
                dragContainer={window}
                selectableTargets={["#selecto1 .cube", "#selecto2 .element", "#selecto3 li"]}
                onDragStart={e => {
                    if (e.inputEvent.target.nodeName === "BUTTON") {
                        return false;
                    }
                    return true;
                }}
                onSelect={e => {
                    e.added.forEach(el => {
                        el.classList.add("selected");
                    });
                    e.removed.forEach(el => {
                        el.classList.remove("selected");
                    });
                }}
                onScroll={({ direction }) => {
                    scrollerRef.current!.scrollBy(direction[0] * 10, direction[1] * 10);
                }}
                onInnerScroll={({ container, direction }) => {
                    container.scrollBy(direction[0] * 10, direction[1] * 10);
                }}
                scrollOptions={{
                    container: scrollerRef,
                    getScrollPosition: () => {
                        return [
                            scrollerRef.current!.scrollLeft,
                            scrollerRef.current!.scrollTop,
                        ];
                    },
                    throttleTime: 30,
                    threshold: 0,
                }}
                innerScrollOptions={true}
                hitRate={props.hitRate}
                selectByClick={props.selectByClick}
                selectFromInside={props.selectFromInside}
                toggleContinueSelect={props.toggleContinueSelect}
                ratio={props.ratio}
            ></Selecto>
            <div className="elements scroll selecto-area" id="selecto1" ref={scrollerRef} style={{
                height: "600px",
            }}>
                <div className="elements scroll selecto-area" id="selecto1" ref={scrollerRef}>
                    {cubes.map(i => <div className="cube" key={i}></div>)}
                </div>
                {cubes.map(i => <div className="cube" key={i}></div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}
