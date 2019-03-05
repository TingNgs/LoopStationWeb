class Looper {
    constructor() {
        this.recorderList = [];
        this.recorded = false;
        this.looping = false;
    }
    Reset() {
        this.recorderList.forEach(element => {
            element.pause();
        });
        this.recorded = false;
        this.looping = false;
        this.recorderList = [];
    }
}