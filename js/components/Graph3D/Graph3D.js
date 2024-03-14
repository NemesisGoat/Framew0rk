class Graph3D extends Component {
    constructor(options) {
        super(options);
        const WIN = {
            LEFT: -10,
            BOTTOM: -10,
            WIDTH: 20,
            HEIGHT: 20,
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
        this.math3D = new Math3D({WIN});
        this.surfaces = new Surfaces;
        this.scene = this.surfaces.kleinBottle();
        this.WIN = WIN;
        this.LIGHT = new Light(-40, 15, -10, 1500);
        this.renderScene();
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
        )
        document.getElementById('points').addEventListener(
            'change',
            () => this.renderScene()
        )
        document.getElementById('edges').addEventListener(
            'change',
            () => this.renderScene()
        )
        document.getElementById('polygons').addEventListener(
            'change',
            () => this.renderScene()
        )
    }

    mouseup() {
        this.canMove = false;
    }

    mousedown() {
        this.canMove = true;
    }

    wheel(event) {
        event.preventDefault();
        const delta = (event.wheelDelta > 0)?1.2:0.8;
        this.scene.points.forEach(point => this.math3D.zoom(delta, point));
        this.renderScene();
    }

    mousemove(event) {
        if (this.canMove) {
            const gradus = Math.PI / 180 / 4;
            this.scene.points.forEach(point => {
                this.math3D.rotateOx(point, (this.dy - event.offsetY) * gradus);
                this.math3D.rotateOy(point, (this.dx - event.offsetX) * gradus);
            });
            this.renderScene();
        }
        this.dx = event.offsetX;
        this.dy = event.offsetY;
    }

    selectFigure() {
        const figure = document.getElementById('selectFigure').value;
        this.scene = this.surfaces[figure]();
        this.renderScene();
    }

    renderScene() {
        this.graph.clear();
        if (document.getElementById('polygons').checked) {
            this.math3D.calcDistance(this.scene, this.WIN.CAMERA, 'distance');
            this.math3D.calcDistance(this.scene, this.LIGHT, 'lumen');
            this.math3D.sortByArtistAlgorithm(this.scene);
            this.scene.polygons.forEach(polygon => {
                const points = polygon.points.map(index => 
                    new Point(this.math3D.xs(this.scene.points[index]),
                    this.math3D.ys(this.scene.points[index])));
                const lumen = this.math3D.calcIllumination(polygon.lumen, this.LIGHT.lumen);
                let {r, g, b} = polygon.color;
                r = Math.round(r * lumen);
                g = Math.round(g * lumen);
                b = Math.round(b * lumen);
                this.graph.polygon(points, polygon.rgbToHex(r, g, b));
            });
        }
        if (document.getElementById('points').checked) {
            this.scene.points.forEach(point => this.graph.point(this.math3D.xs(point), this.math3D.ys(point)));
        }
        if (document.getElementById('edges').checked) {
            this.scene.edges.forEach(edge => {
            const point1 = this.scene.points[edge.p1];
            const point2 = this.scene.points[edge.p2];
            this.graph.line(this.math3D.xs(point1), this.math3D.ys(point1), this.math3D.xs(point2), this.math3D.ys(point2));
            });
        }
    }
}