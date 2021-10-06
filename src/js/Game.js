import Sounds from './Sounds.js';
import { wait } from './Utils.js';

export default {
  $pads: document.querySelectorAll('.pads'),
  $board: document.querySelector('.board'),

  padColorsByIndex: [ 'green', 'red', 'yellow', 'blue' ],

  sequence: [],
  playCount: 0,

  _score: {
    current: 0,
    high: 0,
  },

  time: {
    changeColor: { current: 800, default: 800, minimum: 300 },
    stayLit: { current: 500, default: 500, minimum: 200 },
  },

  init(){
    document.querySelector('#play-button').classList.add('is-hidden');
    document.querySelector('.score').classList.remove('is-hidden');

    this.$pads.forEach(pad => pad.addEventListener('click', this.checkSequence.bind(this)));

    this.getRandomPad();
  },

  getRandomPad(){
    const randomNumber = Math.floor(Math.random() * 4);
    this.sequence.push(randomNumber);

    this.playSignalsSequence();
  },

  async playSignalsSequence(){
    const { changeColor, stayLit } = this.time;
    await wait(500);

    for(let i = 0; i < this.sequence.length; i++){
      const padIndex = this.sequence[i];

      await wait(changeColor.current);
      this.$pads[padIndex].classList.add('active');
      Sounds.play(this.padColorsByIndex[padIndex]);

      await wait(stayLit.current);
      this.$pads[padIndex].classList.remove('active');
    }

    this.$board.classList.add('play');
  },

  async checkSequence(event){
    const padIndex = Number(event.currentTarget.dataset.index) - 1;

    const isTheCorrectPad = padIndex === this.sequence[this.playCount];

    if(isTheCorrectPad){
      Sounds.play(this.padColorsByIndex[padIndex]);
      this.playCount++;
      this.checkIfRoundIsOver();
    } else {
      Sounds.play('fail');
      await this.resetGame();
      this.getRandomPad();
    }
  },

  checkIfRoundIsOver(){
    if(this.playCount === this.sequence.length){
      this.playCount = 0;

      if(this.sequence.length === 2 || this.sequence.length % 4 === 0) this.increaseSpeed();
      
      this.$board.classList.remove('play');
      this.score = this.score + 1;
      this.getRandomPad();
    }
  },

  async resetGame(){
    const correctPadIndex = this.sequence[this.playCount];

    this.sequence = [];
    this.playCount = 0;

    this.resetSpeed();
    this.$pads[correctPadIndex].classList.add('active');
    this.$board.classList.add('fail');
    this.$board.classList.remove('play');
    await wait(1000);

    this.score = 0;
    this.$pads[correctPadIndex].classList.remove('active');
    this.$board.classList.remove('fail');
  },

  resetSpeed(){
    const { changeColor, stayLit } = this.time;

    changeColor.current = changeColor.default;
    stayLit.current = stayLit.default;
  },

  increaseSpeed(){
    const { changeColor, stayLit } = this.time;
    const isGreaterThanMinimumValue = ({ current, minimum }) => current > minimum;

    changeColor.current -= isGreaterThanMinimumValue(changeColor) ? 100 : 0;
    stayLit.current -= isGreaterThanMinimumValue(stayLit) ? 100 : 0;
  },

  get score() {
    return this._score.current;
  },
  set score(value) {
    this._score.current = value;
    this.renderScore(value);
  },
  renderScore(value){
    document.querySelector('.score-count').textContent = value;
  },
};
