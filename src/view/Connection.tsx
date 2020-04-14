import React from "react";

import { Connection as PatchesConnection, Node } from "../patches/node/node";
import { Input } from "../patches/io/input";
import { Output } from "../patches/io/output";
import { calculateTopOffset } from "./util";

// TODO: MOVE
export class Pos {
    top: number;
    left: number;
    constructor(top: number, left: number) {
        this.top = top;
        this.left = left;
    }
}

interface ReactConnectionProps {
    connection?: PatchesConnection;
    pendingConnection?: { start: Pos; end: Pos };
}

export const getInputPos = (node: Node, input: Input<any>) => {
    const index = node.inputs.findIndex((i) => i.id === input.id);
    const top =
        node.y + calculateTopOffset(node.height, 0.8, node.inputs.size, index);
    const left = node.x;
    return new Pos(top, left);
};

export const getOutputPos = (node: Node, output: Output<any>) => {
    const index = node.outputs.findIndex((o) => o.id === output.id);
    const top =
        node.y + calculateTopOffset(node.height, 0.8, node.outputs.size, index);
    const left = node.width + node.x;
    return new Pos(top, left);
};

export const Connection = ({
    connection,
    pendingConnection,
}: ReactConnectionProps) => {
    let start = new Pos(0, 0);
    let end = new Pos(0, 0);
    if (connection) {
        start = getOutputPos(connection.sourceNode, connection.sourceOutput);
        end = getInputPos(
            connection.destinationNode,
            connection.destinationInput
        );
    } else if (pendingConnection) {
        ({ start, end } = pendingConnection);
    }
    let x0 = start.left;
    let x1 = end.left;
    let y0 = start.top;
    let y1 = end.top;
    function bezierByH(x0: number, y0: number, x1: number, y1: number) {
        const mx = x0 + (x1 - x0) / 2;
        return `M${x0} ${y0} C${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`;
    }
    return (
        <path className="patch" d={bezierByH(x0, y0, x1, y1)} strokeWidth="4" />
    );
};
