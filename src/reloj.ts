import { interval } from 'rxjs';

export class Reloj {
    private root: HTMLElement;
    private display: HTMLInputElement;

    constructor(id: string) {
        const root = document.getElementById(id);

        if (!root) {
            throw new Error(`No existe ningún elemento con id="${id}"`);
        }

        this.root = root;

        this.root.innerHTML = `
        <div>
            <h1>Reloj</h1>
            <div class="reloj">
            <div class="display">
                <input type="text" class="display-input" value="00:00:00" disabled />
            </div>
            </div>
        </div>
        `;

        this.display = this.root.querySelector<HTMLInputElement>('.display-input')!;
        const source = interval(1000);
        source.subscribe(() => {
            const fecha = new Date();
            const horas = fecha.getHours().toString().padStart(2, '0');
            const minutos = fecha.getMinutes().toString().padStart(2, '0');
            const segundos = fecha.getSeconds().toString().padStart(2, '0');
            this.display.value = `${horas}:${minutos}:${segundos}`;
        });
        
    }

}