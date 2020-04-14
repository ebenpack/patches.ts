import { Record } from "immutable";
import { Node } from "../node/node";

interface NodeProps {
    title: string;
    makeNode: () => Node;
}

const defaultNodeProps: NodeProps = {
    title: "",
    makeNode: (() => {
        throw Error("Not implemented");
    }) as () => Node, // blech
};

export class NodeRecord extends Record(defaultNodeProps) implements NodeProps {
    constructor(values?: Partial<NodeProps>) {
        values ? super(values) : super();
    }
    with(values: Partial<NodeProps>) {
        return this.merge(values) as this;
    }
}
