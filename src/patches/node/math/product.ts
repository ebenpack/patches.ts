import { Input } from "../../io/input";
import { Output } from "../../io/output";
import { Binary } from "./binary";

export class Product extends Binary {
    constructor(initialLeftValue: number = 0, initialRightValue: number = 0) {
        super((a, b) => a * b, initialLeftValue, initialRightValue);
        this.title = "Product";
        this.getBody = () => {
            const left = (this.inputs.get(0) as Input<number>).inp.getValue();
            const right = (this.inputs.get(1) as Input<number>).inp.getValue();
            const result = (this.outputs.get(0) as Output<
                number
            >).out.getValue();
            return `∏(${left}, ${right}) = ${result}`;
        };
    }
}
