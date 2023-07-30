import { deepFlat } from "@daybrush/utils";
import * as React from "react";
import Selecto from "react-selecto";
import Moveable, { MoveableTargetGroupsType } from "react-moveable";
import { GroupManager, TargetList } from "@moveable/helper";

export default function App() {
    const [cubes] = React.useState(Array.from({ length: 30 }, (_, i) => i));
    const [targets, setTargets] = React.useState<MoveableTargetGroupsType>([]);
    const groupManager = React.useMemo<GroupManager>(() => new GroupManager([]), []);
    const moveableRef = React.useRef<Moveable>(null);
    const selectoRef = React.useRef<Selecto>(null);

    const setSelectedTargets = React.useCallback((nextTargetes: MoveableTargetGroupsType) => {
        selectoRef.current!.setSelectedTargets(deepFlat(nextTargetes));
        setTargets(nextTargetes);
    }, []);

    React.useEffect(() => {
        // [[0, 1], 2], 3, 4, [5, 6], 7, 8, 9
        const elements = selectoRef.current!.getSelectableElements();

        groupManager.set([], elements);
    }, []);

    return <div className="moveable app">
        <div className="container">
            <div className="logo logos" id="logo">
                <a href="https://github.com/daybrush/selecto" target="_blank"><img src="https://daybrush.com/selecto/images/256x256.png" className="selecto" /></a>
                <a href="https://github.com/daybrush/moveable" target="_blank"><img src="https://daybrush.com/moveable/images/256x256.png" /></a>
            </div>
            <h1>You can Group & Ungroup selected targets.</h1>
            <p className="description">You can do simple Group & Ungroup through the helper.</p>
            <button onClick={() => {
                const nextGroup = groupManager.group(targets, true);

                if (nextGroup) {
                    setTargets(nextGroup);
                }
            }}>Group</button>
            &nbsp;
            <button onClick={() => {
                const nextGroup = groupManager.ungroup(targets);

                if (nextGroup) {
                    setTargets(nextGroup);
                }
            }}>Ungroup</button>
            <Moveable
                ref={moveableRef}
                draggable={true}
                rotatable={true}
                scalable={true}
                target={targets}
                onDrag={e => {
                    e.target.style.transform = e.transform;
                }}
                onRenderGroup={e => {
                    e.events.forEach(ev => {
                        ev.target.style.cssText += ev.cssText;
                    });
                }}
            ></Moveable>
            <Selecto
                ref={selectoRef}
                dragContainer={window}
                selectableTargets={[".selecto-area .cube"]}
                hitRate={0}
                selectByClick={true}
                selectFromInside={false}
                toggleContinueSelect={["shift"]}
                ratio={0}
                onDragStart={e => {
                    const moveable = moveableRef.current!;
                    const target = e.inputEvent.target;
                    const flatted = deepFlat(targets);

                    if (
                        target.tagName === "BUTTON"
                        || moveable.isMoveableElement(target)
                        || flatted.some(t => t === target || t.contains(target))
                    ) {
                        e.stop();
                    }
                }}
                onSelectEnd={e => {
                    const {
                        isDragStart,
                        added,
                        removed,
                        inputEvent,
                    } = e;
                    const moveable = moveableRef.current!;

                    if (isDragStart) {
                        inputEvent.preventDefault();

                        moveable.waitToChangeTarget().then(() => {
                            moveable.dragStart(inputEvent);
                        });
                    }
                    let nextChilds: TargetList;

                    if (isDragStart) {
                        nextChilds = groupManager.selectCompletedChilds(targets, added, removed);
                    } else {
                        nextChilds = groupManager.selectSameDepthChilds(targets, added, removed);
                    }

                    e.currentTarget.setSelectedTargets(nextChilds.flatten());
                    setSelectedTargets(nextChilds.targets());
                }}
            ></Selecto>
            <div className="elements selecto-area">
                {cubes.map(i => <div className="cube" key={i}>{i}</div>)}
            </div>
            <div className="empty elements"></div>
        </div>
    </div>;
}
