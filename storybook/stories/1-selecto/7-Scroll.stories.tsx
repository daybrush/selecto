import * as React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number, boolean, array } from "@storybook/addon-knobs";
import { withPreview, DEFAULT_REACT_CODESANDBOX } from "storybook-addon-preview";
import Selecto from "react-selecto";
import "../index.css";
import { WELCOME_CSS_PREVIEW } from "../preview/Welcom.preview";
import InfiniteViewer from "react-infinite-viewer";
import { ref } from "framework-utils";
import { DragScrollOptions } from "@scena/dragscroll";

const story = storiesOf("Selecto", module).addDecorator(withKnobs).addDecorator(withPreview);

story.add("Select in the scroll area.", () => {
    return <App />;
}, {
    preview: [
        // {
        //     tab: "HTML",
        //     template: NORMAL_HTML_TEMPLATE,
        //     language: "html",
        // },
        {
            tab: "CSS",
            template: WELCOME_CSS_PREVIEW,
            language: "css",
        },
    ],
});
function App() {
    const [scrollOptions, setScrollOptions] = React.useState<DragScrollOptions>();
    const viewerRef = React.useRef<InfiniteViewer>(null);
    const cubes: number[] = [];

    for (let i = 0; i < 32 * 7; ++i) {
        cubes.push(i);
    }

    React.useEffect(() => {
        setScrollOptions({
            container: viewerRef.current!.getElement(),
            getScrollPosition: () => {
                return [
                    viewerRef.current!.getScrollLeft(),
                    viewerRef.current!.getScrollTop(),
                ];
            },
        });
    }, []);

    const throttleTime = number("Scroll's throttleTime", 30);
    const threshold = number("Scroll's threshold", 0);

    return <div className="app">
        <div className="container">
            <div className="logo" id="logo">
                <img src="https://daybrush.com/selecto/images/256x256.png" />
            </div>
            <h1>Select in the scroll area.</h1>
            <p className="description">Selecting the scroll area area causes scrolling.</p>
            <button className="button" onClick={() => {
                viewerRef.current!.scrollTo(0, 0);
            }}>Reset Scroll</button>
            <Selecto
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
                    viewerRef.current!.scrollBy(direction[0] * 10, direction[1] * 10);
                }}
                scrollOptions={scrollOptions && {
                    ...scrollOptions,
                    throttleTime,
                    threshold,
                }}
                hitRate={number("hitRate", 100)}
                selectByClick={boolean("selectByClick", true)}
                selectFromInside={boolean("selectFromInside", true)}
                toggleContinueSelect={array("toggleContinueSelect", ["shift"])}
            ></Selecto>
            <InfiniteViewer className="elements infinite-viewer" ref={viewerRef}>
                <div className="viewport selecto-area" id="selecto1">
                    {cubes.map(i => <div className="cube" key={i}></div>)}
                </div>
            </InfiniteViewer>
            <div className="empty elements"></div>
        </div>
    </div>;
}
