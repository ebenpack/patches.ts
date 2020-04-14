import { List } from "immutable";

import { Node } from "../node";
import { Output } from "../../io/output";

export class Context extends Node {
    context: AudioContext;
    constructor() {
        super();
        this.title = "AudioContext";
        this.inputs = List([]);
        this.context = new window.AudioContext();
        this.outputs = List([new Output("context", this.context)]);
    }
    destroy() {
        this.context.close();
    }
}
