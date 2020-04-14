import { List } from "immutable";
import { Subscription } from "rxjs";

import { Node } from "../node";
import { Input } from "../../io/input";
import { Output } from "../../io/output";

export class Oscillator extends Node {
    context: AudioContext | null;
    contextSubscription: Subscription;
    oscillatorNode: OscillatorNode | null;
    constructor() {
        super();
        this.title = "Oscillator";
        const context = new Input("context", null);
        const output = new Output<AudioContext | null>("context", null);
        this.contextSubscription = context.inp.subscribe((ctx: any) => {
            if (ctx instanceof AudioContext) {
                this.context = ctx;
                this.oscillatorNode = ctx.createOscillator();
                this.oscillatorNode.connect(ctx.destination);
                this.oscillatorNode.start();
                output.out.next(ctx);
            }
        });
        this.inputs = List([context]);
        this.outputs = List([output]);
        this.context = null;
        this.oscillatorNode = null;
    }
    destroy() {
        this.oscillatorNode?.stop();
        this.oscillatorNode?.disconnect(
            this.context?.destination as AudioDestinationNode
        );
        this.contextSubscription.unsubscribe();
    }
}
