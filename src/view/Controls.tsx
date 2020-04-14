import React from "react";

import { NodeTypesRecord } from "../patches/controls/nodeTypesRecord";
import { Node } from "../patches/node/node";

interface ControlsProps {
    nodeTypes: NodeTypesRecord;
    addNode: (node: Node) => void;
}

export const Controls = ({ nodeTypes, addNode }: ControlsProps) => {
    return (
        <div className="controls">
            {nodeTypes.groups.map((group) => (
                <div className="control" key={group.title}>
                    <h3>{group.title}</h3>
                    {group.nodes.map((node) => (
                        <div key={node.title}>
                            <button onClick={() => addNode(node.makeNode())}>
                                Add {node.title}
                            </button>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
