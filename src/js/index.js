import Game from './Game.js';
import Sounds from './Sounds.js';

window.addEventListener('load', () => {
  const $playButton = document.querySelector('#play-button');
  $playButton.addEventListener('click', Game.init.bind(Game), { once: true });

  Sounds.loadSounds();
});
