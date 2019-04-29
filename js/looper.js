class Looper {
  constructor() {
    this.recorderList = [];
    this.recorded = false;
    this.looping = false;
  }
  Reset() {
    for (let i = 0; i < this.recorderList.length; i++) {
      this.recorderList[i].pause();
    }
    this.recorded = false;
    this.looping = false;
    this.recorderList = [];
  }
}
