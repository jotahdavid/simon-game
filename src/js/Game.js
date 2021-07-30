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

    const timeToChangeColor = this.time.changeColor;
    const timeToStayLit = this.time.stayLit;

    for(let i = 0; i < this.sequences.length; i++){
      const padIndex = this.sequences[i];

      await this.wait(timeToChangeColor);
      this.pads[padIndex].classList.add('active');
      Sounds.play(padIndex);

      await this.wait(timeToStayLit);
      this.pads[padIndex].classList.remove('active');
    }

    this.board.classList.add('play');
  },

  async checkSequence(event){
    const padIndex = Number(event.currentTarget.dataset.index) - 1;

    const isTheCorrectPad = padIndex === this.sequences[this.playCount];

    if(isTheCorrectPad){
      Sounds.play(padIndex);
      this.playCount++;
      this.checkIfRoundIsOver();
    } else {
      Sounds.play('fail');
      await this.resetGame();
      this.getRandomPad();
    }
  },

  checkIfRoundIsOver(){
    if(this.playCount === this.sequences.length){
      this.playCount = 0;

      if(this.sequences.length === 2 || this.sequences.length % 4 === 0) this.increaseSpeed();
      
      this.board.classList.remove('play');
      this.getRandomPad();
    }
  },

  async resetGame(){
    const correctPadIndex = this.sequences[this.playCount];

    this.sequences = [];
    this.playCount = 0;

    this.pads[correctPadIndex].classList.add('active');
    this.board.classList.add('fail');
    this.board.classList.remove('play');

    this.resetSpeed();

    await this.wait(1000);
    this.pads[correctPadIndex].classList.remove('active');
    this.board.classList.remove('fail');
  },

  resetSpeed(){
    this.time.changeColor = 800;
    this.time.stayLit = 500;
  },

  increaseSpeed(){
    const minTimeToChangeColor = 300;
    if(this.time.changeColor > minTimeToChangeColor) {
      this.time.changeColor -= 100;
    }

    const minTimeToStayLit = 200;
    if(this.time.stayLit > minTimeToStayLit) {
      this.time.stayLit -= 100;
    }
  }
};