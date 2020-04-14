import React, { useEffect, useState } from "react";

import "./App.css";

import { Canvas as PatchesCanvas } from "../patches/canvas/canvas";
import { CanvasGraphRecord } from "../patches/canvas/canvasGraphRecord";
import { Canvas } from "./Canvas";

const App = () => {
    const [canvasGraph, setCanvasGraph] = useState(new CanvasGraphRecord());
    const [canvas] = useState(new PatchesCanvas());
    useEffect(() => {
        canvas.subscribe((canvasGraph) => setCanvasGraph(canvasGraph));
        return () => canvas.destroy();
    }, [canvas]);
    if (!canvasGraph) {
        return null;
    }

    return <Canvas canvas={canvas} />;
};

export default App;
