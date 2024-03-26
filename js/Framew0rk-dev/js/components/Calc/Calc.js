class Calc extends Component {
    operandHandler(event) {
        const calc = new Calculator();
        const a = calc.getValue(document.getElementById('a').value);
        const b = calc.getValue(document.getElementById('b').value);
        const operand = event.target.dataset.operand;
        const result = calc[operand](a, b);
        document.getElementById('c').value = result.toString();
        if (document.getElementById('c').value.includes('NaN')) {
            document.getElementById('c').value = 'Да я не могу блин';
        }
    }

    getValueHandler = () => {
        const calc = new Calculator;
        let x = document.getElementById('point').value;
        let polynomial = document.getElementById('c').value;
        document.getElementById('value').value = calc.getValueAtPoint(polynomial, x);
    }

    changeStyle = () => {
        document.querySelector('body').style.backgroundColor = 'rgb(17, 17, 17)';
        document.getElementById('showCalculator').style.borderBottomStyle = 'none';
    }

    addEventListeners() {

        document.getElementById('showCalculator').addEventListener(
            'click',
            () => this.changeStyle()
        );

        const buttons = document.querySelectorAll('.operand');
        buttons.forEach(button =>
            button.addEventListener(
                'click',
                (event) => this.operandHandler(event)
            )
        );
        document.getElementById('getValueButton')
            .addEventListener(
                'click', 
                () => this.getValueHandler());

    }
}