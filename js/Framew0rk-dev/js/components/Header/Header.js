class Header extends Component {
    addEventListeners() {
        document.getElementById('show2D').addEventListener('click', () => this.callbacks.showPage('graph2D'));
        document.getElementById('showCalculator').addEventListener('click', () => this.callbacks.showPage('calc'));
        document.getElementById('show3D').addEventListener('click', () => this.callbacks.showPage('graph3D'));
    }
}