$(function () {
	let drumNum = display_drum.length;
	for (let i = 0; i < drumNum; i++) {
		$('#audio_list').append(
			'<audio class="drum_audio" controls src="./audio/drumAudio/' +
			display_drum[i].drum +
			'.wav" type="audio/wav" />'
		);
	}
});

var display_drum = [
	{ drum: 'crash-tape' },
	{ drum: 'ride-acoustic02' },
	{ drum: 'cl_hi_hat' },
	{ drum: 'hi_tom' },
	{ drum: 'mid_tom' },
	{ drum: 'low_tom' },
	{ drum: 'snare-808' },
	{ drum: 'bass_drum' }
];
var key = [
	{ drum: 'Q' },
	{ drum: 'W' },
	{ drum: 'E' },
	{ drum: 'R' },
	{ drum: 'A' },
	{ drum: 'S' },
	{ drum: 'D' },
	{ drum: 'F' }
];
var display = [
	{ drum: 'Crash' },
	{ drum: 'Ride' },
	{ drum: 'Hi-Hat' },
	{ drum: 'Hi Tom' },
	{ drum: 'Mid Tom' },
	{ drum: 'Low Tom' },
	{ drum: 'Snare' },
	{ drum: 'Bass Drum' }
];
let DrumAudioList = [];
function RenderDrumSet() {
	let drumNum = display_drum.length;
	for (let i = 0; i < drumNum; i++) {
		$('#drum-pad').append(
			'<div class="drum_container"><div class="drum"><div class="text">' + key[i].drum + "<br />" + display[i].drum + '</div></div></div>'
		);
	}
}
