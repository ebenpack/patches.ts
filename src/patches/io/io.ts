import { uuid } from "../../util";

export abstract class IO<T> {
    name: string;
    id: string;
    constructor(name: string) {
        this.name = name;
        this.id = uuid();
    }
}
