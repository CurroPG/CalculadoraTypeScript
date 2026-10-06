import './style.css'
import { Calculadora } from './Calculadora'
import { Reloj } from './reloj'

document.addEventListener('DOMContentLoaded', () => {
  new Calculadora('app1', 'Calculadora 1');
  new Calculadora('app2', 'Calculadora 2');
  new Reloj('reloj');

});

