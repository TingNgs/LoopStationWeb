$(() => {
	let keyNum = display_keys.length;
	for (let i = 0; i < keyNum; i++) {
		let audio = new Howl({
			src: ['./audio/pianoAudio/' + (i + 1) + '.mp3']
		});
		PianoAudioList.push(audio);
	}
});

var display_keys = [
	// { num: 1, key: 32, type: 'white' },
	// { num: 2, key: 33, type: 'black' },
	// { num: 3, key: 34, type: 'white' },

	// { num: 4, key: 35, type: 'white' },
	// { num: 5, key: 36, type: 'black' },
	// { num: 6, key: 37, type: 'white' },
	// { num: 7, key: 38, type: 'black' },
	// { num: 8, key: 39, type: 'white' },
	// { num: 9, key: 40, type: 'white' },
	// { num: 10, key: 41, type: 'black' },
	// { num: 11, key: 42, type: 'white' },
	// { num: 12, key: 43, type: 'black' },
	{ num: 13, key: 44, type: 'white', top: 124 },
	{ num: 14, key: 45, type: 'black', top: 124 },
	{ num: 15, key: 46, type: 'white', top: 120 },

	{ num: 16, key: 47, type: 'white', top: 116 },
	{ num: 17, key: 48, type: 'black', top: 116 },
	{ num: 18, key: 49, type: 'white', top: 112 },
	{ num: 19, key: 50, type: 'black', top: 112 },
	{ num: 20, key: 51, type: 'white', top: 108 },
	{ num: 21, key: 52, type: 'white', top: 104 },
	{ num: 22, key: 53, type: 'black', top: 104 },
	{ num: 23, key: 54, type: 'white', top: 100 },
	{ num: 24, key: 55, type: 'black', top: 100 },
	{ num: 25, key: 56, type: 'white', top: 96 },
	{ num: 26, key: 57, type: 'black', top: 96 },
	{ num: 27, key: 58, type: 'white', top: 92 },

	{ num: 28, key: 59, type: 'white', top: 88 },
	{ num: 29, key: 60, type: 'black', top: 88 },
	{ num: 30, key: 61, type: 'white', top: 84 },
	{ num: 31, key: 62, type: 'black', top: 84 },
	{ num: 32, key: 63, type: 'white', top: 80 },
	{ num: 33, key: 64, type: 'white', top: 76 },
	{ num: 34, key: 65, type: 'black', top: 76 },
	{ num: 35, key: 66, type: 'white', top: 72 },
	{ num: 36, key: 67, type: 'black', top: 72 },
	{ num: 37, key: 68, type: 'white', top: 68 },
	{ num: 38, key: 69, type: 'black', top: 68 },
	{ num: 39, key: 70, type: 'white', top: 64 },

	{ num: 40, key: 71, type: 'white', top: 60 },
	{ num: 41, key: 72, type: 'black', top: 60 },
	{ num: 42, key: 73, type: 'white', top: 56 },
	{ num: 43, key: 74, type: 'black', top: 56 },
	{ num: 44, key: 75, type: 'white', top: 52 },
	{ num: 45, key: 76, type: 'white', top: 48 },
	{ num: 46, key: 77, type: 'black', top: 48 },
	{ num: 47, key: 78, type: 'white', top: 44 },
	{ num: 48, key: 79, type: 'black', top: 44 },
	{ num: 49, key: 80, type: 'white', top: 40 },
	{ num: 50, key: 81, type: 'black', top: 40 },
	{ num: 51, key: 82, type: 'white', top: 36 },

	{ num: 52, key: 83, type: 'white', top: 32 },
	{ num: 53, key: 84, type: 'black', top: 32 },
	{ num: 54, key: 85, type: 'white', top: 28 },
	{ num: 55, key: 86, type: 'black', top: 28 },
	{ num: 56, key: 87, type: 'white', top: 24 },
	{ num: 57, key: 88, type: 'white', top: 20 },
	{ num: 58, key: 89, type: 'black', top: 20 },
	{ num: 59, key: 90, type: 'white', top: 16 },
	{ num: 60, key: 91, type: 'black', top: 16 },
	{ num: 61, key: 92, type: 'white', top: 14 },
	{ num: 62, key: 93, type: 'black', top: 14 },
	{ num: 63, key: 94, type: 'white', top: 10 },

	{ num: 64, key: 95, type: 'white', top: 6 },
	{ num: 65, key: 96, type: 'black', top: 6 },
	{ num: 66, key: 97, type: 'white', top: 2 },
	{ num: 67, key: 98, type: 'black', top: 2 }
	// { num: 68, key: 99, type: 'white' },
	// { num: 69, key: 100, type: 'white' },
	// { num: 70, key: 101, type: 'black' },
	// { num: 71, key: 102, type: 'white' },
	// { num: 72, key: 103, type: 'black' },
	// { num: 73, key: 104, type: 'white' },
	// { num: 74, key: 105, type: 'black' },
	// { num: 75, key: 106, type: 'white' },

	// { num: 76, key: 107, type: 'white' },
	// { num: 77, key: 108, type: 'black' },
	// { num: 78, key: 109, type: 'white' },
	// { num: 79, key: 110, type: 'black' },
	// { num: 80, key: 111, type: 'white' },
	// { num: 81, key: 112, type: 'white' },
	// { num: 82, key: 113, type: 'black' },
	// { num: 83, key: 114, type: 'white' },
	// { num: 84, key: 115, type: 'black' },
	// { num: 85, key: 116, type: 'white' },
	// { num: 86, key: 117, type: 'black' },
	// { num: 87, key: 118, type: 'white' },

	// { num: 88, key: 119, type: 'white' }
];

let PianoAudioList = [];

function RenderPianoKey(i) {
	return (
		'<div class="key ' +
		display_keys[i].type +
		'" onmousedown="PianoKeyOnMouseDown(' +
		i +
		')"></div>'
	);
}

function RenderPianoKeySet() {
	let keyNum = display_keys.length;
	for (let i = 0; i < keyNum; i++) {
		let keyElement = RenderPianoKey(i);
		if (i < keyNum - 1) {
			if (display_keys[i + 1].type == 'black') {
				i++;
				keyElement += RenderPianoKey(i);
			}
		}
		$('#piano_keyboard').append(
			'<div class="key_set">' + keyElement + '</div>'
		);
	}
}

function PianoKeyOnMouseDown(i) {
	PianoAudioList[i].seek(0);
	PianoAudioList[i].load();
	PianoAudioList[i].play();
	if (recording) {
		let time = new Date().getTime() - startListenTime;
		let audio = new Howl({
			src: ['./audio/pianoAudio/' + (i + 1) + '.mp3']
		});
		console.log(display_keys[i].index);
		looperList[inputRecorder].recorderList[listIndex].audioList.push({
			time: time,
			audio: audio,
			index: i
		});
	}
}
