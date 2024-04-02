Template.prototype.calcTemplate = () => `
<div class="titleBlock">
        <h1 class="title" id="partOne">Calcu</h1>
        <h1 class="title" id="partTwo">lator</h1>
    </div>
    <div class="inputBlock">
        <textarea id="a" placeholder="a" class="input"></textarea>
        <textarea id="b" placeholder="b" class="input"></textarea>
        <textarea id="c" placeholder="result" class="input"></textarea>
        <div class = 'operandBlock'>
            <button class="operand" data-operand="add">+</button>
            <button class="operand" data-operand="sub">-</button>
            <button class="operand" data-operand="mult">*</button>
            <button class="operand" data-operand="div">/</button>
            <button class="operand" data-operand="prod">scal</button>
            <button class="operand" data-operand="pow">^</button>
        </div>
        <input id = "point" placeholder="Найти значение в точке" class="input">
        <button id = 'getValueButton' class="findButton">Искать</button>
        <div></div>
        <input id = "value" placeholder="Значение" class="input">
        <div class="operands">
    </div>
    </div>
`;