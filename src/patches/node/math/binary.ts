import { List } from "immutable";
import { Subscription } from "rxjs";
import { combineLatest, tap } from "rxjs/operators";

import { Node } from "../node";
import { Input } from "../../io/input";
import { Output } from "../../io/output";

export abstract class Binary extends Node {
    resultSubscription: Subscription;
    constructor(
        op: (l: number, r: number) => number,
        initialLeftValue: number = 0,
        initialRightValue: number = 0
    ) {
        super();
        const left = new Input("X", initialLeftValue);
        const right = new Input("Y", initialRightValue);
        this.inputs = List([left, right]);
        const result = new Output("N", 0);
        this.outputs = List([result]);
        this.resultSubscription = left.inp
            .pipe(
                combineLatest(right.inp),
                tap(([left, right]) => result.out.next(op(left, right)))
            )
            .subscribe((_) => {});
    }
    destroy() {
        Node.prototype.destroy.call(this);
        this.resultSubscription.unsubscribe();
    }
}
