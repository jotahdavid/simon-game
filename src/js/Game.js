import Sounds from './Sounds.js';

export default {
  playButton: document.querySelector('#play-button'),
  pads: document.querySelectorAll('.pads'),
  board: document.querySelector('#game'),
  sequences: [],
  playCount: 0,
  
  wait(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  init(){
    this.playButton.classList.add('is-hidden');
    this.pads.forEach(pad => pad.addEventListener('click', this.checkSequence.bind(this)));

    this.getRandomPad();
  },

  getRandomPad(){
    const randomNumber = Math.floor(Math.random() * 4);
    this.sequences.push(randomNumber);

    this.playSignalsSequence();
  },

  async playSignalsSequence(){
    for(let i = 0; i < this.sequences.length; i++){
      const padIndex = this.sequences[i];

      await this.wait(1000);
      this.pads[padIndex].classList.add('active');
      Sounds.play(padIndex);

      await this.wait(500);
      this.pads[padIndex].classList.remove('active');
    }

    this.board.classList.add('play');
  },

  async checkSequence(event){
    const padIndex = Number(event.currentTarget.dataset.index) - 1;

    if(padIndex === this.sequences[this.playCount]){
      Sounds.play(padIndex);
      this.playCount++;
    } else {
      this.sequences = [];
      Sounds.play('fail');
      this.playCount = 0;
      this.board.classList.remove('play');
      await this.wait(1000);
      this.getRandomPad();
    }

    if(this.playCount === this.sequences.length){
      this.playCount = 0;
      this.board.classList.remove('play');
      this.getRandomPad();
    }
  },
};