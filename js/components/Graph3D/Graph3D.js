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


class Graph3D extends Component {
    constructor(options) {
        super(options);
        const WIN = {
            LEFT: -10,
            BOTTOM: -10,
            WIDTH: 20,
            HEIGHT: 20,
            P1: new Point(-10, 10, -30),
            P2: new Point(-10, -10, -30),
            P3: new Point(10, -10, -30),
            CENTER: new Point(0, 0, -30),
            CAMERA: new Point(0, 0, -50)
        }
        this.graph = new Graph({
            id: 'canvasGraph3D', width: 600, height: 600, WIN,
            callbacks: {
                wheel: (event) => this.wheel(event),
                mousemove: (event) => this.mousemove(event),
                mouseup: () => this.mouseup(),
                mousedown: () => this.mousedown(),
            }
        });
        this.math3D = new Math3D({ WIN });
        this.surfaces = new Surfaces;
        this.scene = this.SolarSystem();
        this.WIN = WIN;
        this.LIGHT = new Light(-40, 15, -10, 1500);

        this.drawPoints = true;
        this.drawEdges = true;
        this.drawPolygons = true;

        setInterval(() => {
            this.scene.forEach(surface => surface.doAnimation(this.math3D));
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

            this.calcPlaneEquation();
            this.calcWindowVectors();
            this.renderScene(FPS);
            requestAnimationFrame(renderLoop);
        }

        renderLoop();
    }

    changeStyle() {
        document.querySelector('body').style.backgroundColor = 'white';
        document.querySelector('body').style.overflow = 'hidden';
    }

    addEventListeners() {
        document.getElementById('show3D').addEventListener(
            'click',
            () => this.changeStyle()
        );
        document.getElementById('selectFigure').addEventListener(
            'change',
            () => this.selectFigure()
        );
        document.querySelectorAll('.customSurface').forEach(checkbox =>
            checkbox.addEventListener(
                'change',
                (event) => {
                    this[event.target.dataset.custom] = event.target.checked;
                }
            )
        );
    }

    mouseup() {
        this.canMove = false;
    }

    mousedown() {
        this.canMove = true;
    }

    wheel(event) {
        event.preventDefault();
        const delta = (event.wheelDelta > 0) ? 1.2 : 0.8;
        const matrix = this.math3D.zoom(delta);
        this.math3D.transform(matrix, this.WIN.CAMERA);
        this.math3D.transform(matrix, this.WIN.CENTER);
    }

    mousemove(event) {
        if (this.canMove) {
            const gradus = Math.PI / 180 / 4;
            const matrixOx = this.math3D.rotateOx((this.dx - event.offsetX) * gradus);
            const matrixOy = this.math3D.rotateOy((this.dy - event.offsetY) * gradus);
            this.math3D.transform(matrixOx, this.WIN.CAMERA);
            this.math3D.transform(matrixOx, this.WIN.CENTER);
            this.math3D.transform(matrixOx, this.WIN.P1);
            this.math3D.transform(matrixOx, this.WIN.P2);
            this.math3D.transform(matrixOx, this.WIN.P3);
            this.math3D.transform(matrixOy, this.WIN.CAMERA);
            this.math3D.transform(matrixOy, this.WIN.CENTER);
            this.math3D.transform(matrixOy, this.WIN.P1);
            this.math3D.transform(matrixOy, this.WIN.P2);
            this.math3D.transform(matrixOy, this.WIN.P3);
        }
        this.dx = event.offsetX;
        this.dy = event.offsetY;
    }

    selectFigure() {
        const figure = document.getElementById('selectFigure').value;
        this.scene = [this.surfaces[figure]({})];
    }

    SolarSystem() {
        const Sun = this.surfaces.sphere({color: '#ffff00', radius: 10})
        Sun.addAnimation('rotateOy', 0.01);
        Sun.addAnimation('rotateOz', 0.01);
        const Earth = this.surfaces.sphere({color: '#0022ff', radius: 5, x0: 20});
        Earth.addAnimation('rotateOy', 0.03, Sun.center);
        Earth.addAnimation('rotateOz', 0.05);
        const Moon = this.surfaces.sphere({color: '#969ba3', radius:2, x0: Earth.center.x, y0: Earth.center.y, z0: Earth.center.z + 8});
        Moon.addAnimation('rotateOx', 0.1, Earth.center);
        Moon.addAnimation('rotateOy', 0.03, Sun.center);
        return [Sun, Earth, Moon];
    }

    calcPlaneEquation() {
        this.math3D.calcPlaneEquation(this.WIN.CAMERA, this.WIN.CENTER)
    }

    getProection(point) {
        const M = this.math3D.getProection(point);
        const P2M = this.math3D.getVector(this.WIN.P2, M);
        const cosa = this.math3D.calcCorner(this.P1P2, M);
        const cosb = this.math3D.calcCorner(this.P2P3, M);
        const module = this.math3D.moduleVector(P2M);
        return {
            x: cosa * module,
            y: cosb * module
        }
    }

    calcWindowVectors() {
        this.P1P2 = this.math3D.getVector(this.WIN.P2, this.WIN.P1);
        this.P2P3 = this.math3D.getVector(this.WIN.P3, this.WIN.P2);
    }

    renderScene(FPS) {
        console.log(FPS);
        this.graph.clear();
        if (this.drawPolygons) {
            const polygons = [];
            this.scene.forEach((surface, index) => {
                this.math3D.calcDistance(surface, this.WIN.CAMERA, 'distance');
                this.math3D.calcDistance(surface, this.LIGHT, 'lumen');
                surface.polygons.forEach(polygon => {
                    polygon.index = index;
                    polygons.push(polygon);
                });
            });

            this.math3D.sortByArtistAlgorithm(polygons);

            polygons.forEach(polygon => {
                const points = polygon.points.map(index =>
                    new Point(
                        this.getProection(this.scene[polygon.index].points[index]).x,
                        this.getProection(this.scene[polygon.index].points[index]).y
                    )
                );
                const lumen = this.math3D.calcIllumination(polygon.lumen, this.LIGHT.lumen);
                let { r, g, b } = polygon.color;
                r = Math.round(r * lumen);
                g = Math.round(g * lumen);
                b = Math.round(b * lumen);
                this.graph.polygon(points, polygon.rgbToHex(r, g, b));
            });
        }
        if (this.drawPoints) {
            this.scene.forEach(surface =>
                surface.points.forEach(
                    point => this.graph.point(
                        this.getProection(point).x,
                        this.getProection(point).y
                    )
                )
            );
        }
        if (this.drawEdges) {
            this.scene.forEach(surface =>
                surface.edges.forEach(edge => {
                    const point1 = surface.points[edge.p1];
                    const point2 = surface.points[edge.p2];
                    this.graph.line(
                        this.getProection(point1).x, this.getProection(point1).y,
                        this.getProection(point2).x, this.getProection(point2).y
                    );
                })
            );
        }
    }
}