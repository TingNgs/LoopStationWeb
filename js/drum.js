$(function() {
	let drumNum = display_drum.length;
	for (let i = 0; i < drumNum; i++) {
		$('#audio_list').append(
			'<audio class="drum_audio" controls src="./audio/drumAudio2/' +
				display_drum[i].drum +
				'.wav" type="audio/wav" />'
		);
	}
});

var display_drum = [
	{ drum: 'bass_drum' },
	{ drum: 'cl_hi_hat' },
	{ drum: 'claves' },
	{ drum: 'cowbell' },
	{ drum: 'cymbal' },
	{ drum: 'hand_clap' },
	{ drum: 'hi_conga' },
	{ drum: 'hi_tom' }
];
let DrumAudioList = [];
function RenderDrumSet() {
	let drumNum = display_drum.length;
	for (let i = 0; i < drumNum; i++) {
		$('#drum-pad').append(
			'<div class="drum_container"><div class="drum"/></div>'
		);
	}
}
