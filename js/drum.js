$(function() {
	let drumNum = display_drum.length;
	for (let i = 0; i < drumNum; i++) {
		$('#audio_list').append(
			'<audio class="drum_audio" controls src="./audio/drumAudio/' +
				display_drum[i].drum +
				'.wav" type="audio/wav" />'
		);
	}
});

function drumKeyDown(e) {
	let drumNum = display_drum.length;
	for (let i = 0; i < drumNum; i++) {
		if (e.keyCode === display_drum[i].code) {
			DrumAudioList[i].currentTime = 0;
			DrumAudioList[i].play();
			if (recording) {
				let time = new Date().getTime() - startListenTime;
				let audio = new Audio(DrumAudioList[i].src);
				looperList[inputRecorder].recorderList[
					listIndex
				].audioList.push({ time: time, audio: audio });
			}
		}
	}
}

var display_drum = [
	{ drum: 'crash-tape', key: 'Q', code: 81, name: 'Crash' },
	{ drum: 'ride-acoustic02', key: 'W', code: 87, name: 'Ride' },
	{ drum: 'cl_hi_hat', key: 'E', code: 69, name: 'Hi-Hat' },
	{ drum: 'hi_tom', key: 'R', code: 82, name: 'Hi Tom' },
	{ drum: 'mid_tom', key: 'A', code: 65, name: 'Mid Tom' },
	{ drum: 'low_tom', key: 'S', code: 83, name: 'Low Tom' },
	{ drum: 'snare-808', key: 'D', code: 68, name: 'Snare' },
	{ drum: 'bass_drum', key: 'F', code: 70, name: 'Bass Drum' }
];
let DrumAudioList = [];
function RenderDrumSet() {
	let drumNum = display_drum.length;
	for (let i = 0; i < drumNum; i++) {
		$('#drum-pad').append(
			'<div class="drum_container"><div class="drum"><div class="text">' +
				display_drum[i].key +
				'<br />' +
				display_drum[i].name +
				'</div></div></div>'
		);
	}
}