import { fromEvent, interval, merge, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

export class Cronometro {
    // ZONA 1: campos
    private root: HTMLElement;
    private display: HTMLDivElement;
    private btnIniciar: HTMLButtonElement;
    private btnReiniciar: HTMLButtonElement;
    private inputHoras: HTMLInputElement;
    private inputMinutos: HTMLInputElement;
    private inputSegundos: HTMLInputElement;
    private cuentaAtras: Subscription | null = null;
    private tiempoRestante = 10;   // en segundos (de prueba)

    // ZONA 2: constructor
    constructor(id: string) {
        const root = document.getElementById(id);
        if (!root) {
            throw new Error(`No existe ningún elemento con id="${id}"`);
        }
        this.root = root;

        this.root.innerHTML = `
        <div>
            <h1>Cronómetro</h1>
            <div class="cronometro">
                <div class="crono-display">00:00:00</div>

                <input type="number" class="crono-horas" min="0" max="99" value="0" />
                <input type="number" class="crono-minutos" min="0" max="59" value="0" />
                <input type="number" class="crono-segundos" min="0" max="59" value="0" />

                <button class="crono-iniciar">Iniciar</button>
                <button class="crono-reiniciar">Reiniciar</button>
            </div>
        </div>
        `;

        this.display = this.root.querySelector<HTMLDivElement>('.crono-display')!;
        this.btnIniciar = this.root.querySelector<HTMLButtonElement>('.crono-iniciar')!;
        this.btnReiniciar = this.root.querySelector<HTMLButtonElement>('.crono-reiniciar')!;
        this.inputHoras = this.root.querySelector<HTMLInputElement>('.crono-horas')!;
        this.inputMinutos = this.root.querySelector<HTMLInputElement>('.crono-minutos')!;
        this.inputSegundos = this.root.querySelector<HTMLInputElement>('.crono-segundos')!;

        this.pintar();
        fromEvent(this.btnIniciar, 'click').subscribe(() => {
            if (this.cuentaAtras == null)
                this.iniciar();
            else this.pausar();
        });
        merge(
            fromEvent(this.inputHoras, 'input'),
            fromEvent(this.inputMinutos, 'input'),
            fromEvent(this.inputSegundos, 'input'),
        ).subscribe(() => {
            this.tiempoRestante = this.leerInputs();
            this.pintar();
        });
        fromEvent(this.btnReiniciar, 'click').subscribe(() => {
            this.reiniciar();
        });
    }

    // ZONA 3: métodos
    private pintar(): void {
        const h = Math.floor(this.tiempoRestante / 3600);
        const m = Math.floor((this.tiempoRestante % 3600) / 60);
        const s = this.tiempoRestante % 60;

        this.display.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    private iniciar(): void {
        if (this.cuentaAtras == null && this.tiempoRestante != 0) {
            this.cuentaAtras = interval(1000).pipe(take(this.tiempoRestante)).subscribe({
                next: () => {
                    this.tiempoRestante--;
                    this.pintar();
                },
                complete: () => {
                    this.cuentaAtras = null;
                    this.btnIniciar.textContent = "Iniciar";
                    this.bloquearInputs(false);
                }
            });
            this.btnIniciar.textContent = "Pausar";
            this.bloquearInputs(true);
        } else return;
    }

    private pausar(): void {
        this.cuentaAtras?.unsubscribe();
        this.cuentaAtras = null;
        this.btnIniciar.textContent = "Reanudar";
        this.bloquearInputs(false);
    }

    private leerInputs(): number {
        const h = Number(this.inputHoras.value);
        const m = Number(this.inputMinutos.value);
        const s = Number(this.inputSegundos.value);

        return (h * 3600) + (m * 60) + s;
    }

    private bloquearInputs(bloquear: boolean): void {
        this.inputHoras.disabled = bloquear;
        this.inputMinutos.disabled = bloquear;
        this.inputSegundos.disabled = bloquear;
    }

    private reiniciar(): void {
        this.cuentaAtras?.unsubscribe();
        this.cuentaAtras = null;
        this.tiempoRestante = this.leerInputs();
        this.btnIniciar.textContent = "Iniciar";
        this.pintar();
        this.bloquearInputs(false);
    }
}