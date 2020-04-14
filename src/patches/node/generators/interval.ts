import { Node } from "../node";
import { List } from "immutable";
import { Input } from "../../io/input";
import { Subscription } from "rxjs";
import { Output } from "../../io/output";

export class Interval extends Node {
    number: number;
    running: boolean;
    cancelTimeout: number;
    initialDelay: number;
    inputSubscription: Subscription;
    setSubscription: Subscription;
    constructor(initialDelay: number = 1000) {
        super();
        this.title = "Interval";
        this.getBody = () =>
            String((this.outputs.first() as Output<number>).out.getValue());
        this.number = 0;
        const input = new Input("Delay", initialDelay);
        const set = new Input("Set", 0);
        this.inputs = List([input, set]);
        this.outputs = List([new Output("N", 0)]);
        this.initialDelay = initialDelay;
        this.cancelTimeout = 0;
        this.running = true;

        this.setSubscription = set.inp.subscribe((val) => (this.number = val));
        this.inputSubscription = input.inp.subscribe(
            (val) => (this.initialDelay = val)
        );

        const tick = () => {
            (this.outputs.first() as Output<number>).out.next(this.number);
            this.update(this.number);
            this.number += 1;
            if (this.running) {
                this.cancelTimeout = window.setTimeout(tick, this.initialDelay);
            }
        };
        tick();
    }
    create() {
        // TODO: remove create?
    }
    destroy() {
        this.running = false;
        window.clearTimeout(this.cancelTimeout);
        this.inputSubscription.unsubscribe();
        this.setSubscription.unsubscribe();
    }
}
