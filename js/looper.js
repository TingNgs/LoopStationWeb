class Looper {
	constructor() {
		this.recorded = false;
		this.startingLoop = false;
		this.looping = false;
		this.recorderList = [];
		this.timeZone = 0;
		this.dur = 0;
		this.tempPlaying = false;
		this.ending = false;
		this.instrument = false;
	}
	Reset() {
		this.recorded = false;
		this.startingLoop = false;
		this.looping = false;
		this.recorderList = [];
		this.timeZone = 0;
		this.dur = 0;
		this.tempPlaying = false;
		this.ending = false;
		this.instrument = false;
	}
}
