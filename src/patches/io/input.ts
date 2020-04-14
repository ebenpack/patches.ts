import { BehaviorSubject } from "rxjs";
import { IO } from "./io";
import { Output } from "./output";

export class Input<T> extends IO<T> {
    inp: BehaviorSubject<T>;
    constructor(name: string, initial: T) {
        super(name);
        this.inp = new BehaviorSubject(initial);
    }
    canConnect(o: Output<any>) {
        return true;
    }
    destroy() {
        this.inp.complete();
    }
}
