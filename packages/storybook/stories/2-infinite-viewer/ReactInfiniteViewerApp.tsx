import * as React from "react";
import InfiniteViewer from "react-infinite-viewer";
import Selecto from "react-selecto";

export default function App(props: Record<string, any>) {
    const [cubes] = React.useState(Array.from({ length: 210 }, (_, i) => i));
    const viewerRef = React.useRef<InfiniteViewer>(null);
    const selectoRef = React.useRef<Selecto>(null);

    return <div className="app">
        <div className="container">
            <div className="logos logo" id="logo">
                <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" className="selecto" /></a>
                <a href="https://github.com/daybrush/infinite-viewer" target="_blank"><img src="https://daybrush.com/infinite-viewer/images/logo.png" /></a>
            </div>
            <h1>Select in the Infinite Scroll Viewer.</h1>
            <p className="description">Selecting the scroll area area causes scrolling.</p>
            <button className="button" onClick={() => {
                viewerRef.current!.scrollTo(0, 0);
            }}>Reset Scroll</button>
            <Selecto
                ref={selectoRef}
                dragContainer={".elements"}
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
                    viewerRef.current!.scrollBy(direction[0] * 10, direction[1] * 10);
                }}
                scrollOptions={{
                    container: () => viewerRef.current!.getElement(),
                    getScrollPosition: () => {
                        return [
                            viewerRef.current!.getScrollLeft(),
                            viewerRef.current!.getScrollTop(),
                        ];
                    },
                    throttleTime: 30,
                    threshold: 0,
                }}
                hitRate={props.hitRate}
                selectByClick={props.selectByClick}
                selectFromInside={props.selectFromInside}
                toggleContinueSelect={props.toggleContinueSelect}
                ratio={props.ratio}
            ></Selecto>
            <InfiniteViewer className="elements infinite-viewer" ref={viewerRef} onScroll={() => {
                selectoRef.current!.checkScroll();
            }}>
                <div className="viewport selecto-area" id="selecto1">
                    {cubes.map(i => <div className="cube" key={i}></div>)}
                </div>
            </InfiniteViewer>
            <div className="empty elements"></div>
        </div>
    </div>;
}
