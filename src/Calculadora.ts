export class Calculadora {
    private currentInput = '0';
    private lastInput = '0';
    private operation = '';
    private shouldResetInput = false;

    // El contenedor (#app1, #app2...) y el display de ESTA calculadora
    private root: HTMLElement;
    private display: HTMLInputElement;

    constructor(id: string, titulo: string = 'Calculadora') {
        const root = document.getElementById(id);
        if (!root) {
            throw new Error(`No existe ningún elemento con id="${id}"`);
        }
        this.root = root;

        this.root.innerHTML = `
      <div>
        <h1>${titulo}</h1>
        <div class="calculadora">
          <div class="display">
            <input type="text" class="display-input" value="0" disabled />
          </div>
          <div class="teclado">
            <button class="delete span-two">DEL</button>
            <button class="reset">C</button>
            <button class="operation" data-action="sign">+/-</button>
            <button class="operation" data-action="square">x²</button>
            <button class="operation" data-action="sqrt">√x</button>
            <button class="operation" data-action="inverse">1/x</button>
            <button class="operation" data-action="+">+</button>
            <button class="number" data-value="7">7</button>
            <button class="number" data-value="8">8</button>
            <button class="number" data-value="9">9</button>
            <button class="operation" data-action="-">-</button>
            <button class="number" data-value="4">4</button>
            <button class="number" data-value="5">5</button>
            <button class="number" data-value="6">6</button>
            <button class="operation" data-action="*">*</button>
            <button class="number" data-value="1">1</button>
            <button class="number" data-value="2">2</button>
            <button class="number" data-value="3">3</button>
            <button class="operation" data-action="/">/</button>
            <button class="equals span-two">=</button>
            <button class="number" data-value="0">0</button>
            <button class="decimal">.</button>
          </div>
        </div>
      </div>
    `;

        // Buscamos dentro de this.root, NO en document: asi solo encuentra lo suyo
        this.display = this.root.querySelector<HTMLInputElement>('.display-input')!;

        this.registrarEventos();
    }

    // ---------- Eventos ----------

    private registrarEventos(): void {
        this.root.querySelectorAll<HTMLButtonElement>('.number').forEach((boton) => {
            boton.addEventListener('click', () => this.pulsarNumero(boton.dataset.value ?? '0'));
        });

        this.root.querySelectorAll<HTMLButtonElement>('.operation').forEach((boton) => {
            boton.addEventListener('click', () => this.pulsarOperacion(boton.dataset.action ?? ''));
        });

        this.root.querySelector('.reset')?.addEventListener('click', () => this.reset());
        this.root.querySelector('.delete')?.addEventListener('click', () => this.borrar());
        this.root.querySelector('.decimal')?.addEventListener('click', () => this.decimal());
        this.root.querySelector('.equals')?.addEventListener('click', () => this.igual());
    }

    // ---------- Logica  ----------

    private actualizarDisplay(): void {
        this.display.value = this.currentInput;
    }

    private pulsarNumero(value: string): void {
        if (this.shouldResetInput) {
            this.currentInput = value;
            this.shouldResetInput = false;
        } else {
            if (this.currentInput === '0' && value === '0') return;
            if (this.currentInput === '0') this.currentInput = '';
            this.currentInput += value;
        }
        this.actualizarDisplay();
    }

    private reset(): void {
        this.currentInput = '0';
        this.lastInput = '0';
        this.operation = '';
        this.shouldResetInput = false;
        this.actualizarDisplay();
    }

    private borrar(): void {
        if (this.currentInput.length === 1) {
            this.currentInput = '0';
        } else {
            this.currentInput = this.currentInput.slice(0, -1);
        }
        this.actualizarDisplay();
    }

    private decimal(): void {
        if (this.shouldResetInput) {
            this.currentInput = '0.';
            this.shouldResetInput = false;
        } else if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
        }
        this.actualizarDisplay();
    }

    private calculate(): number {
        const num1 = parseFloat(this.lastInput);
        const num2 = parseFloat(this.currentInput);

        switch (this.operation) {
            case '+': return num1 + num2;
            case '-': return num1 - num2;
            case '*': return num1 * num2;
            case '/': return num2 !== 0 ? num1 / num2 : 0;
            default: return num2;
        }
    }

    private executeUnaryOperation(action: string): void {
        const num = parseFloat(this.currentInput);
        let result: number | string;

        switch (action) {
            case 'sign':
                if (this.currentInput !== '0') {
                    this.currentInput = this.currentInput.startsWith('-')
                        ? this.currentInput.substring(1)
                        : '-' + this.currentInput;
                    this.actualizarDisplay();
                }
                return;
            case 'square':
                result = num * num;
                break;
            case 'sqrt':
                result = num >= 0 ? Math.sqrt(num) : 'Error';
                break;
            case 'inverse':
                result = num !== 0 ? 1 / num : 'Error';
                break;
            default:
                return;
        }

        this.currentInput = result.toString();
        this.actualizarDisplay();
        this.shouldResetInput = true;
    }

    private pulsarOperacion(action: string): void {
        // Operaciones unarias
        if (['sign', 'square', 'sqrt', 'inverse'].includes(action)) {
            this.executeUnaryOperation(action);
            return;
        }

        // Operaciones binarias (+, -, *, /)
        if (this.operation && !this.shouldResetInput) {
            this.currentInput = this.calculate().toString();
            this.actualizarDisplay();
        }

        this.lastInput = this.currentInput;
        this.operation = action;
        this.shouldResetInput = true;
    }

    private igual(): void {
        if (this.operation) {
            this.currentInput = this.calculate().toString();
            this.actualizarDisplay();
            this.lastInput = '0';
            this.operation = '';
            this.shouldResetInput = true;
        }
    }
}