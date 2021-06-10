export default {
  soundName: null,

  async play(value){
    this.soundName = null;

    switch(value) {
      case 'fail':
        this.soundName = 'fail';
        break;
      case 0:
        this.soundName = 'green';
        break;
      case 1:
        this.soundName = 'red';
        break;
      case 2:
        this.soundName = 'yellow';
        break;
      case 3:
        this.soundName = 'blue';
        break;
      default:
        return;
    }

    const sound = new Audio(`./src/sounds/${this.soundName}.mp3`);
    sound.crossOrigin = 'anonymous';
    sound.addEventListener('canplay', () => sound.play());
  },
}