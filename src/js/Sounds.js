export default {
  sounds: {},

  loadSounds(){
    this.sounds = {
      fail: new Audio('./src/sounds/fail.mp3'),
      green: new Audio('./src/sounds/green.mp3'),
      red: new Audio('./src/sounds/red.mp3'),
      yellow: new Audio('./src/sounds/yellow.mp3'),
      blue: new Audio('./src/sounds/blue.mp3'),
    };
  },

  async play(value){
    const sound = this.sounds[value];

    if(!sound) return;

    sound.currentTime = 0;
    sound.crossOrigin = 'anonymous';
    sound.play();
  },
};
