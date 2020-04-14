import { List, Record } from "immutable";
import { Node } from "../node/node";

interface CanvasGraphProps {
    nodes: List<Node>;
}

const defaultCanvasGraphProps: CanvasGraphProps = {
    nodes: List(),
};

export class CanvasGraphRecord extends Record(defaultCanvasGraphProps)
    implements CanvasGraphProps {
    constructor(values?: Partial<CanvasGraphProps>) {
        values ? super(values) : super();
    }
    with(values: Partial<CanvasGraphProps>) {
        return this.merge(values) as this;
    }
}
