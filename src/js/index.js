import Game from './Game.js';

document.querySelector("#play-button")
  .addEventListener("click", Game.init.bind(Game), { once: true });
