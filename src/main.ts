import './style.css'
import { Calculadora } from './calculadora'

document.addEventListener('DOMContentLoaded', () => {
  new Calculadora('app1', 'Calculadora 1');
  new Calculadora('app2', 'Calculadora 2');
});

