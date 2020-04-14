import { List, Record } from "immutable";
import { NodeRecord } from "./nodeRecord";

interface NodeGroupProps {
    title: string;
    nodes: List<NodeRecord>;
}

const defaultNodeGroupProps: NodeGroupProps = {
    title: "",
    nodes: List(),
};

export class NodeGroupRecord extends Record(defaultNodeGroupProps)
    implements NodeGroupProps {
    constructor(values?: Partial<NodeGroupProps>) {
        values ? super(values) : super();
    }
    with(values: Partial<NodeGroupProps>) {
        return this.merge(values) as this;
    }
}
