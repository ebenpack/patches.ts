import React from "react";

import { useDrag } from "./dragTools";
import { Node as PatchesNode } from "../patches/node/node";
import { ConnectionDestination, ConnectionSource } from "./Canvas";
import { calculateTopOffset } from "./util";

interface NodeProps {
    node: PatchesNode;
    removeNode: (node: PatchesNode) => void;
    startConnection: (source: ConnectionSource) => void;
    completeConnection: (destination: ConnectionDestination) => void;
    moveNodeToFront: (node: PatchesNode) => void;
}

export const Node = ({
    node,
    removeNode,
    startConnection,
    completeConnection,
    moveNodeToFront,
}: NodeProps) => {
    const { x, y, ref } = useDrag({ x: 20, y: 20 });
    const title = node.title;

    const left = (node.x = x); // gross
    const top = (node.y = y);
    const inputs = node.inputs;
    const outputs = node.outputs;
    const width = node.width;
    const height = node.height;
    const transform = `translate(${left}, ${top})`;
    const bodyText = node.body;
    // const Widgets = node.get('widgets');
    // const state = node.get('state');
    return (
        <g
            transform={transform}
            className="node draggable"
            onMouseDown={() => moveNodeToFront(node)}
        >
            <rect
                className="body"
                x="0"
                y="0"
                width={width}
                height={height}
            ></rect>
            <rect
                ref={ref}
                className="handle title"
                x="0"
                y="0"
                width={width}
                height={height * 0.2}
            ></rect>

            <text
                x={width - 2}
                y="2"
                className="close"
                alignmentBaseline="hanging"
                textAnchor="end"
                onMouseUp={() => removeNode(node)}
            >
                ✕
            </text>
            <text className="title" x="4" y="4" alignmentBaseline="hanging">
                {title}
            </text>
            <text
                className="body"
                alignmentBaseline="hanging"
                y={height * 0.2 + 4}
                x="4"
            >
                {bodyText}
            </text>

            {inputs.valueSeq().map((input, index) => {
                const offsetTop = calculateTopOffset(
                    node.height,
                    0.8,
                    node.inputs.size,
                    index
                );
                const offsetLeft = 0;
                return (
                    <g
                        className="input io"
                        key={input.id}
                        onMouseUp={completeConnection.bind(null, {
                            destinationNode: node,
                            destinationInput: input,
                        })}
                    >
                        <circle
                            cx={offsetLeft}
                            cy={offsetTop}
                            r="4"
                            key={input.name}
                        ></circle>
                        <text x={offsetLeft + 5} y={offsetTop + 5}>
                            {input.name}
                        </text>
                    </g>
                );
            })}
            {outputs.valueSeq().map((output, index) => {
                const offsetTop = calculateTopOffset(
                    node.height,
                    0.8,
                    node.outputs.size,
                    index
                );
                const offsetLeft = node.width;
                return (
                    <g
                        className="output io"
                        key={output.id}
                        onMouseDown={startConnection.bind(null, {
                            sourceNode: node,
                            sourceOutput: output,
                        })}
                    >
                        <circle
                            cx={offsetLeft}
                            cy={offsetTop}
                            r="4"
                            key={output.name}
                        ></circle>
                        <text
                            x={offsetLeft - 5}
                            y={offsetTop + 5}
                            textAnchor="end"
                        >
                            {output.name}
                        </text>
                    </g>
                );
            })}
        </g>
    );
};
