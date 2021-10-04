import Sounds from './Sounds.js';
import { wait } from './Utils.js';

export default {
  $playButton: document.querySelector('#play-button'),
  $pads: document.querySelectorAll('.pads'),
  $board: document.querySelector('.board'),
  $score: document.querySelector('.score'),
  $scoreCount: document.querySelector('.score-count'),
  sequences: [],
  playCount: 0,
  _score: {
    current: 0,
    high: 0,
  },
  time: {
    changeColor: 800,
    stayLit: 500,
  },

  init(){
    this.$playButton.classList.add('is-hidden');
    this.$score.classList.remove('is-hidden');

    this.$pads.forEach(pad => pad.addEventListener('click', this.checkSequence.bind(this)));

    this.getRandomPad();
  },

  getRandomPad(){
    const randomNumber = Math.floor(Math.random() * 4);
    this.sequences.push(randomNumber);

    this.playSignalsSequence();
  },

  async playSignalsSequence(){
    await wait(500);

    const timeToChangeColor = this.time.changeColor;
    const timeToStayLit = this.time.stayLit;

    for(let i = 0; i < this.sequences.length; i++){
      const padIndex = this.sequences[i];

      await wait(timeToChangeColor);
      this.$pads[padIndex].classList.add('active');
      Sounds.play(padIndex);

      await wait(timeToStayLit);
      this.$pads[padIndex].classList.remove('active');
    }

    this.$board.classList.add('play');
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
      
      this.$board.classList.remove('play');
      this.score = this.score + 1;
      this.getRandomPad();
    }
  },

  async resetGame(){
    const correctPadIndex = this.sequences[this.playCount];

    this.sequences = [];
    this.playCount = 0;

    this.$pads[correctPadIndex].classList.add('active');
    this.$board.classList.add('fail');
    this.$board.classList.remove('play');

    this.resetSpeed();

    await wait(1000);
    this.score = 0;
    this.$pads[correctPadIndex].classList.remove('active');
    this.$board.classList.remove('fail');
  },

  resetSpeed(){
    this.time.changeColor = 800;
    this.time.stayLit = 500;
  },

  increaseSpeed(){
    const minTimeToChangeColor = 300;
    this.time.changeColor -= this.time.changeColor > minTimeToChangeColor ? 100 : 0;

    const minTimeToStayLit = 200;
    this.time.stayLit -= this.time.stayLit > minTimeToStayLit ? 100 : 0;
  },

  get score() {
    return this._score.current;
  },
  set score(value) {
    this._score.current = value;
    this.renderScore(value);
  },
  renderScore(value){
    this.$scoreCount.textContent = value;
  },
};