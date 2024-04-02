Template.prototype.graph3DTemplate = () => `<canvas id='canvasGraph3D' class='asg'></canvas>
<div>
    <select id = 'selectFigure'>
    <!-- <option value = 'ellipticCylinder'>Эллиптический цилиндр</option> -->   
        <option value = 'ellipticParaboloid'>Эллиптический параболоид</option>    
        <option value = 'hyperbolicParaboloid'>Принглс??????</option>    
        <option value = 'twoSurfaceHyperboloid'>Двуполостный гиперболоид</option>    
        <option value = 'oneSurfaceHyperboloid'>Однополостный гиперболоид</option>    
        <option value = 'hyperbolicCylinder'>Гиперболический цилиндр</option>    
        <option value = 'kleinBottle'>Бутылка клейна</option>    
        <option value = 'sphere'>Сфера</option>    
        <option value = 'ellipse'>Эллипс</option>    
        <option value = 'thor'>Тор (бублик)</option>    
        <option value = 'cube'>Куб</option>
    <select>
</div>
<div>
    <input class='customSurface' data-custom='drawPoints' type='checkbox' id ='points' checked>Рисовать точки</input>    
    <input class='customSurface' data-custom='drawEdges' type='checkbox' id ='edges' checked>Рисовать рёбра</input>
    <input class='customSurface' data-custom='drawPolygons' type='checkbox' id ='polygons' checked>Рисовать полигоны</input>  
</div>
<div id = 'paramsBlock'>
    <div id='cube params'></div>
</div>
    `    