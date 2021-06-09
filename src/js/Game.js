export default {
  pads: document.querySelectorAll('.pads'),
  board: document.querySelector('#game'),
  sequences: [],
  playCount: 0,
  
  wait(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  init(){
    this.pads.forEach(pad => pad.addEventListener('click', this.checkSequence.bind(this)));

    this.getRandomPad();
  },

  getRandomPad(){
    const randomNumber = Math.floor(Math.random() * 4);
    this.sequences.push(randomNumber);

    this.playSignalsSequence();
  },

  async playSignalsSequence(){
    this.board.classList.remove('play');

    for(let i = 0; i < this.sequences.length; i++){
      await this.wait(1000);
      this.pads[this.sequences[i]].classList.add('active');
      await this.wait(1200);
      this.pads[this.sequences[i]].classList.remove('active');
    }

    this.board.classList.add('play');
  },

  checkSequence(event){
    const padIndex = Number(event.currentTarget.dataset.index) - 1;

    if(padIndex === this.sequences[this.playCount]){
      this.playCount++;
    } else {
      this.sequences = [];
      this.playCount = 0;
      this.getRandomPad();
    }

    if(this.playCount === this.sequences.length){
      this.playCount = 0;
      this.getRandomPad();
    }
  },
};