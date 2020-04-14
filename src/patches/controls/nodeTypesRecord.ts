import { List, Record } from "immutable";
import { NodeGroupRecord } from "./nodeGroupRecord";

interface NodeTypesProps {
    groups: List<NodeGroupRecord>;
}

const defaultNodeTypesProps: NodeTypesProps = {
    groups: List(),
};

export class NodeTypesRecord extends Record(defaultNodeTypesProps)
    implements NodeTypesProps {
    constructor(values?: Partial<NodeTypesProps>) {
        values ? super(values) : super();
    }
    with(values: Partial<NodeTypesProps>) {
        return this.merge(values) as this;
    }
}
