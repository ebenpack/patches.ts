import { List } from "immutable";
import { BehaviorSubject } from "rxjs";

import { uuid } from "../../util";
import { Input } from "../io/input";
import { Output } from "../io/output";

export class Connection {
    sourceNode: Node;
    sourceOutput: Output<any>; // blech
    destinationNode: Node;
    destinationInput: Input<any>; // blech
    constructor(
        sourceNode: Node,
        sourceOutput: Output<any>, // blech
        destinationNode: Node,
        destinationInput: Input<any> // blech
    ) {
        this.sourceNode = sourceNode;
        this.sourceOutput = sourceOutput;
        this.destinationNode = destinationNode;
        this.destinationInput = destinationInput;
    }
}

export class Node {
    connected: List<Connection>;
    id: string;
    title: string;
    getBody: () => string;
    inputs: List<Input<any>>; // blech
    outputs: List<Output<any>>; // blech
    x: number;
    y: number;
    width: number;
    height: number;
    onUpdate: BehaviorSubject<any>; // blech
    get body(): string {
        return this.getBody();
    }
    constructor(connected: List<Connection> = List()) {
        this.id = uuid();
        this.connected = connected;
        this.title = "";
        this.getBody = () => "";
        this.inputs = List();
        this.outputs = List();
        this.width = 200;
        this.height = 100;
        this.x = 0;
        this.y = 0;
        this.onUpdate = new BehaviorSubject(null);
    }
    connect(
        sourceOutput: Output<any>,
        destinationNode: Node,
        destinationInput: Input<any>
    ) {
        this.connected = this.connected.push(
            new Connection(
                this,
                sourceOutput,
                destinationNode,
                destinationInput
            )
        );
    }
    disconnect(
        sourceOutput: Output<any>,
        destinationNode: Node,
        destinationInput: Input<any>
    ) {
        this.connected = this.connected.filter(
            (node) =>
                node.sourceNode.id !== this.id &&
                node.sourceOutput.id !== sourceOutput.id &&
                node.destinationNode.id !== destinationNode.id &&
                node.destinationInput.id !== destinationInput.id
        );
    }
    create() {}
    destroy() {
        this.onUpdate.complete();
    }
    update(val: any) {
        // blech
        this.onUpdate.next(val);
    }
}
