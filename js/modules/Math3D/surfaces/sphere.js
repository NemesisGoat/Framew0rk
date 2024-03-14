Surfaces.prototype.sphere = (count = 20, R = 20) => {
    const points = [];
    const edges = [];
    const polygons = [];
    // about points
    const da = Math.PI * 2 / count;
    for (let phi = 0; phi < Math.PI * 2; phi += da) {
        for (let psi = -Math.PI; psi < Math.PI; psi += da) {
            const x = (R * Math.sin(psi)) * Math.cos(phi);
            const y = (R * Math.sin(psi)) * Math.sin(phi);
            const z = R * Math.cos(psi);
            points.push(new Point(x, y, z));
        }
    }
    // about edges
    for (let i = 0; i < points.length; i++) {
        if (points[i + 1]) {
            if ((i + 1) % count === 0) {
                edges.push(new Edge(i, i + 1 - count));
            } else {
                edges.push(new Edge(i, i + 1));
            }
        }
        if (points[i + count]) {
            edges.push(new Edge(i, i + count));
        } else {
            edges.push(new Edge(i, i % count));
        }
    }

    for (let i = 0; i < points.length; i++) {
        if (points[i + count + 1]) {
            polygons.push(new Polygon([
                i,
                i + 1,
                i + count + 1,
                i + count
            ], '#ffff00'))
        }
    }

    return new Surface(points, edges, polygons);
}