import { BehaviorSubject } from "rxjs";
import { IO } from "./io";

export class Output<T> extends IO<T> {
    out: BehaviorSubject<T>;
    constructor(name: string, initial: T) {
        super(name);
        this.out = new BehaviorSubject(initial);
    }
    destroy() {
        this.out.complete();
    }
}
