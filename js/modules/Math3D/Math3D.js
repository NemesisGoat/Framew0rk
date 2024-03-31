class Math3D {
    constructor({WIN}) {
        this.WIN = WIN;

        this.plane = {
            A: 0,
            B: 0,
            C: 0,

            x0: 0,
            y0: 0,
            z0: 0,

            xs0: 0,
            ys0: 0,
            zs0: 0
        }
    }

    xs(point) {
        const zs = this.WIN.CENTER.z;
        const z0 = this.WIN.CAMERA.z;
        const x0 = this.WIN.CAMERA.x;

        return(point.x - x0) / (point.z - z0) * (zs - z0) + x0;
    }

    ys(point) {
        const zs = this.WIN.CENTER.z;
        const z0 = this.WIN.CAMERA.z;
        const y0 = this.WIN.CAMERA.y;
        return (point.y - y0) / (point.z - z0) * (zs - z0) + y0;
    }

    multPoint(T, m) {
        const a = [0, 0, 0, 0];
        for (let i = 0; i < T.length; i++) {
            let b = 0;
            for (let j = 0; j < m.length; j++) {
                b += T[j][i] * m[j];
            }
            a[i] = b;
        }
        return a; 
    }

    multMatrix(a, b) {
        let c = [[], [], [], []]
        let s = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                s = 0;
                for (let k = 0; k < 4; k++) {
                    s += a[i][k] * b[k][j];
                }
                c[i].push(s);
            }
        }
        return c;
    }

    getVector(a, b) {
        return {
            x: b.x - a.x,
            y: b.y - a.y,
            z: b.z - a.z
        }
    }

    scalProd(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    zoom(delta) {
        return [
            [delta, 0, 0, 0],
            [0, delta, 0, 0],
            [0, 0, delta, 0],
            [0, 0, 0, 1]
        ];
    }

    move(dx = 0, dy = 0, dz = 0) {
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [dx, dy, dz, 1]
        ]
    }

    rotateOx(alpha) {
        return [
            [1, 0, 0, 0],
            [0, Math.cos(alpha), Math.sin(alpha), 0],
            [0, -Math.sin(alpha), Math.cos(alpha), 0],
            [0, 0, 0, 1],
        ]
    }

    rotateOy(alpha) {
        return [
            [Math.cos(alpha), 0, -Math.sin(alpha), 0],
            [0, 1, 0, 0],
            [Math.sin(alpha), 0, Math.cos(alpha), 0],
            [0, 0, 0, 1],
        ]
    }

    rotateOz(alpha) {
        return [
            [Math.cos(alpha), Math.sin(alpha), 0, 0],
            [-Math.sin(alpha), Math.cos(alpha), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1],
        ]
    }

    calcPlaneEquation(point1, point2) {
        const vector = this.getVector(point1, point2);
        this.plane.A = vector.x;
        this.plane.B = vector.y;
        this.plane.C = vector.z;
        this.plane.x0 = point2.x;
        this.plane.y0 = point2.y;
        this.plane.z0 = point2.z;
        this.plane.xs0 = point1.x;
        this.plane.ys0 = point1.y;
        this.plane.zs0 = point1.z;
    }

    calcCorner(a, b) {
        return this.scalProd(a, b) / (Math.sqrt(this.scalProd(a, a)) * Math.sqrt(this.scalProd(b, b)));
    }

    moduleVector(a) {
        return Math.sqrt(a.x**2 + a.y**2 + a.z**2);
    }

    getProection(point) {
        const { A, B, C, x0, y0, z0, xs0, ys0, zs0 } = this.plane;
        const m = point.x - xs0;
        const n = point.y - ys0;
        const p = point.z - zs0;
        const t = (A * (x0 - xs0) + B * (y0 - ys0) + C * (z0 - zs0)) / (A*m + B*n + C*p);
        const ps = {
            x: x0 + m * t, 
            y: y0 + n * t, 
            z: z0 + p * t 
        }
        return {
            x: ps.x - A, 
            y: ps.y - B, 
            z: ps.z - C 
        }
    }

    calcDistance(surface, endPoint, name) {
        surface.polygons.forEach(polygon => {
            let x = 0, y = 0, z = 0;
            polygon.points.forEach(index => {
                x += surface.points[index].x;
                y += surface.points[index].y;
                z += surface.points[index].z;
            });
            x /= polygon.points.length;
            y /= polygon.points.length;
            z /= polygon.points.length;
            polygon[name] = Math.sqrt((endPoint.x - x)**2 + (endPoint.y - y)**2 + (endPoint.z - z)**2);
        });
    }

    sortByArtistAlgorithm(polygons) {
        polygons.sort((a, b) => b.distance - a.distance);
    }

    calcIllumination(distance, lumen) {
        const illum = distance ? lumen / distance**2 : 1;
        return illum > 1 ? 1 : illum;
    }

    transform(matrix, point) {
        const result = this.multPoint(matrix, [point.x, point.y, point.z, 1]);
        point.x = result[0];
        point.y = result[1];
        point.z = result[2];
    }

    getTransform(...args) {
        return args.reduce(
            (S, t) => this.multMatrix(S,t),
            [[1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]]
        );
    }
}