import { interval, fromEvent, Subscription } from 'rxjs';

export class Cronometro {
    // ZONA 1: campos
    private root: HTMLElement;
    private display: HTMLDivElement;
    private btnIniciar: HTMLButtonElement;
    private btnReiniciar: HTMLButtonElement;

    private tiempoAcumulado = 0;
    private momentoInicio = 0;
    private cuenta: Subscription | null = null;

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
            <div class="cronometro-panel">
                <div class="cronometro-display">00:00:00.00</div>
                <div class="cronometro-botones">
                    <button class="cronometro-iniciar">Iniciar</button>
                    <button class="cronometro-reiniciar">Reiniciar</button>
                </div>
            </div>
        </div>
        `;

        this.display = this.root.querySelector<HTMLDivElement>('.cronometro-display')!;
        this.btnIniciar = this.root.querySelector<HTMLButtonElement>('.cronometro-iniciar')!;
        this.btnReiniciar = this.root.querySelector<HTMLButtonElement>('.cronometro-reiniciar')!;

        this.pintar();

        fromEvent(this.btnIniciar, 'click').subscribe(() => {
            if (this.cuenta == null) this.iniciar();
            else this.pausar();
        });

        fromEvent(this.btnReiniciar, 'click').subscribe(() => {
            this.reiniciar();
        });
    }

    // ZONA 3: métodos
    private iniciar(): void {
        if (this.cuenta != null) return;
        this.momentoInicio = Date.now() - this.tiempoAcumulado;

        this.cuenta = interval(10).subscribe(() => {
            this.tiempoAcumulado = Date.now() - this.momentoInicio;
            this.pintar();
        });

        this.btnIniciar.textContent = "Pausar";
    }

    private pausar(): void {
        this.tiempoAcumulado = Date.now() - this.momentoInicio;
        this.cuenta?.unsubscribe();
        this.cuenta = null;
        this.btnIniciar.textContent = "Reanudar";
        this.pintar();
    }

    private reiniciar(): void {
        this.cuenta?.unsubscribe();
        this.cuenta = null;
        this.tiempoAcumulado = 0;
        this.btnIniciar.textContent = "Iniciar";
        this.pintar();
    }

    private pintar(): void {
        const totalSegundos = Math.floor(this.tiempoAcumulado / 1000);
        const h = Math.floor(totalSegundos / 3600);
        const m = Math.floor((totalSegundos % 3600) / 60);
        const s = totalSegundos % 60;
        const cs = Math.floor((this.tiempoAcumulado % 1000) / 10);   // centésimas

        const dosCifras = (n: number) => n.toString().padStart(2, '0');
        this.display.textContent = `${dosCifras(h)}:${dosCifras(m)}:${dosCifras(s)}.${dosCifras(cs)}`;
    }
}