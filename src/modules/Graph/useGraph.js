import Graph from "./Graph";

window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

const useGraph = (renderScene) => {
    let graph = null;
    let interval = setInterval(() => {
        scene.forEach(surface => surface.doAnimation(math3D));
    }, 50)
    let FPS = 0;
    let countFPS = 0;
    let timestamp = Date.now();
    const renderLoop = () => {
        countFPS++;
        const currentTimestamp = Date.now();
        if (currentTimestamp - timestamp >= 1000) {
            FPS = countFPS;
            countFPS = 0;
            timestamp = currentTimestamp;
        }

        calcPlaneEquation();
        calcWindowVectors();
        renderScene(FPS);
        requestAnimationFrame(renderLoop);
    }

    renderLoop()
    return () => {
        window.cancelAnimationFrame(renderLoop);
        clearInterval(interval);
        graph = null;
    }

    const getGraph = () => {
        graph = new Graph({
            id: 'canvasGraph3D',
            width: 600,
            height: 600,
            WIN: WIN,
            callbacks: {
                wheel,
                mousemove,
                mouseup,
                mousedown,
            }
        });
        renderLoop();
        return graph;
    }

    const cancelGraph = () => {
        window.cancelAnimationFrame(renderLoop);
        clearInterval(interval);
        graph = null;
    }

    return [getGraph, cancelGraph];
}

export default useGraph;