import React, { useState, useCallback, useEffect } from "react";

import { Node } from "./Node";
import { Connection, getOutputPos, Pos } from "./Connection";
import { Controls } from "./Controls";

import { Canvas as PatchesCanvas } from "../patches/canvas/canvas";
import { Node as PatchesNode } from "../patches/node/node";
import { Output } from "../patches/io/output";
import { Input } from "../patches/io/input";
import { getDragStream } from "./dragTools";

interface ReactCanvasProps {
    canvas: PatchesCanvas;
}

export interface ConnectionDestination {
    destinationNode: PatchesNode;
    destinationInput: Input<any>;
}

export interface ConnectionSource {
    sourceNode: PatchesNode;
    sourceOutput: Output<any>;
}

export const Canvas = ({ canvas }: ReactCanvasProps) => {
    const [connecting, setConnecting] = useState<ConnectionSource | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const startConnection = useCallback(
        (source: ConnectionSource) => {
            if (!connecting) {
                setConnecting(source);
            }
        },
        [connecting]
    );
    const completeConnection = useCallback(
        ({ destinationNode, destinationInput }: ConnectionDestination) => {
            if (connecting !== null) {
                const {
                    sourceNode,
                    sourceOutput,
                } = connecting as ConnectionSource;
                canvas.connectNodes(
                    sourceNode,
                    sourceOutput,
                    destinationNode,
                    destinationInput
                );
            }
        },
        [connecting, canvas]
    );
    useEffect(() => {
        const listener = () => setConnecting(null);
        window.addEventListener("mouseup", listener);
        return () => window.removeEventListener("mouseup", listener);
    }, []);
    useEffect(() => {
        // ugh, kinda hacky
        const listener = (evt: MouseEvent) =>
            setMousePos({ x: evt.clientX, y: evt.clientY });
        window.addEventListener("mousedown", listener);
        return () => window.removeEventListener("mousedown", listener);
    }, []);
    useEffect(() => {
        const mouseSubscription = getDragStream(document.body).subscribe(
            setMousePos
        );
        return () => mouseSubscription.unsubscribe();
    }, []);
    return (
        <div className="canvas">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="dropshadow">
                        <feDropShadow dx="4" dy="4" stdDeviation="4" />
                    </filter>
                </defs>
                {canvas.nodes.valueSeq().map((node) => {
                    let connected = node.connected;
                    return connected.map((connection, index) => (
                        <Connection connection={connection} key={index} />
                    ));
                })}
                {connecting && (
                    <Connection
                        pendingConnection={{
                            start: getOutputPos(
                                connecting.sourceNode,
                                connecting.sourceOutput
                            ),
                            end: new Pos(mousePos.y, mousePos.x),
                        }}
                    />
                )}
                {canvas.nodes.valueSeq().map((node) => (
                    <Node
                        node={node}
                        key={node.id}
                        removeNode={canvas.removeNode.bind(canvas)}
                        moveNodeToFront={canvas.moveNodeToFront.bind(canvas)}
                        startConnection={startConnection}
                        completeConnection={completeConnection}
                    />
                ))}
            </svg>
            <Controls
                addNode={canvas.addNode.bind(canvas)}
                nodeTypes={canvas.nodeTypes}
            />
        </div>
    );
};
