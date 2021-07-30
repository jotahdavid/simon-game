import Sounds from './Sounds.js';

export default {
  playButton: document.querySelector('#play-button'),
  pads: document.querySelectorAll('.pads'),
  board: document.querySelector('#game'),
  sequences: [],
  playCount: 0,

  time: {
    changeColor: 800,
    stayLit: 500,
  },
  
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
    await this.wait(500);

    for(let i = 0; i < this.sequences.length; i++){
      const padIndex = this.sequences[i];

      await this.wait(this.time.changeColor);
      this.pads[padIndex].classList.add('active');
      Sounds.play(padIndex);

      await this.wait(this.time.stayLit);
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
      Sounds.play('fail');

      this.pads[this.sequences[this.playCount]].classList.add('active');
      this.board.classList.add('fail');
      this.board.classList.remove('play');

      this.time.changeColor = 800;
      this.time.stayLit = 500;

      await this.wait(1000);
      this.pads[this.sequences[this.playCount]].classList.remove('active');
      this.board.classList.remove('fail');

      this.sequences = [];
      this.playCount = 0;
      this.getRandomPad();
    }

    if(this.playCount === this.sequences.length){
      this.playCount = 0;

      if(this.sequences.length === 2 || this.sequences.length % 4 === 0) {
        this.increaseSpeed();
      }
      
      this.board.classList.remove('play');
      this.getRandomPad();
    }
  },

  increaseSpeed(){
    if(this.time.changeColor > 300) {
      this.time.changeColor -= 100;
    }

    if(this.time.stayLit > 200) {
      this.time.stayLit -= 100;
    }
  }
};