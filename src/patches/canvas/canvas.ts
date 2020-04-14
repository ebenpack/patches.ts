import { BehaviorSubject } from "rxjs";
import { List } from "immutable";

import { Node } from "../node/node";
import { Interval } from "../node/generators/interval";
import { Sum } from "../node/math/sum";
import { Product } from "../node/math/product";
import { NodeGroupRecord } from "../controls/nodeGroupRecord";
import { NodeRecord } from "../controls/nodeRecord";
import { NodeTypesRecord } from "../controls/nodeTypesRecord";
import { Input } from "../io/input";
import { Output } from "../io/output";
import { CanvasGraphRecord } from "./canvasGraphRecord";
import { Context } from "../node/audio/context";
import { Oscillator } from "../node/audio/oscillator";

const nodeTypes = new NodeTypesRecord({
    groups: List([
        new NodeGroupRecord({
            title: "Math",
            nodes: List([
                new NodeRecord({
                    title: "Sum",
                    makeNode: () => new Sum(),
                }),
                new NodeRecord({
                    title: "Product",
                    makeNode: () => new Product(),
                }),
            ]), // TODO: Can't instantiate here
        }),
        new NodeGroupRecord({
            title: "Generators",
            nodes: List([
                new NodeRecord({
                    title: "Interval",
                    makeNode: () => new Interval(),
                }),
            ]),
        }),
        new NodeGroupRecord({
            title: "Audio",
            nodes: List([
                new NodeRecord({
                    title: "AudioContext",
                    makeNode: () => new Context(),
                }),
                new NodeRecord({
                    title: "Oscillator",
                    makeNode: () => new Oscillator(),
                }),
            ]),
        }),
    ]),
});

export class Canvas {
    nodes: List<Node>;
    nodeTypes: NodeTypesRecord;
    updateStream: BehaviorSubject<CanvasGraphRecord>;
    private _connections: {
        [key: string]: {
            [key: string]: [Node, Output<any>, Input<any>];
        };
    };
    constructor() {
        this.nodes = List();
        this.updateStream = new BehaviorSubject(this.makeCanvasGraph());
        this.nodeTypes = nodeTypes;
        this._connections = {};
    }
    makeCanvasGraph(): CanvasGraphRecord {
        return new CanvasGraphRecord({ nodes: this.nodes });
    }
    addNode(node: Node) {
        node.create();
        this.nodes = this.nodes.push(node);
        node.onUpdate.subscribe(this.update.bind(this));
        this.update();
    }
    removeNode(removedNode: Node) {
        this.nodes = this.nodes.filter((node) => node.id !== removedNode.id);
        // this is gross
        Object.values(
            this._connections[removedNode.id] || {}
        ).forEach(([sourceNode, sourceOutput, destinationInput]) =>
            sourceNode.disconnect(sourceOutput, removedNode, destinationInput)
        );
        delete this._connections[removedNode.id];
        removedNode.destroy();
        removedNode.onUpdate.unsubscribe();
        this.update();
    }
    moveNodeToFront(nodeToMove: Node): void {
        const index = this.nodes.findIndex((node) => node.id === nodeToMove.id);
        const node = this.nodes.get(index);
        if (node) {
            this.nodes = this.nodes.remove(index).push(node);
            this.update();
        }
    }
    connectNodes(
        sourceNode: Node,
        sourceOutput: Output<any>,
        destinationNode: Node,
        destinationInput: Input<any>
    ) {
        sourceNode.connect(sourceOutput, destinationNode, destinationInput);
        sourceOutput.out.subscribe((val) => destinationInput.inp.next(val));
        this._connections[destinationNode.id] =
            this._connections[destinationNode.id] || {};
        this._connections[destinationNode.id][destinationInput.id] = [
            sourceNode,
            sourceOutput,
            destinationInput,
        ];
        this.update();
    }
    disconnectNodes(
        sourceNode: Node,
        sourceOutput: Output<any>,
        destinationNode: Node,
        destinationInput: Input<any>
    ) {
        sourceNode.disconnect(sourceOutput, destinationNode, destinationInput);
    }
    update() {
        this.updateStream.next(this.makeCanvasGraph());
    }
    subscribe(cb: (graph: CanvasGraphRecord) => void): void {
        this.updateStream.subscribe(cb);
    }
    destroy() {
        this.updateStream.unsubscribe();
        this.updateStream.complete();
    }
}
