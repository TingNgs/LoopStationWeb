$(function() {
	$('#function_bar').load('function_bar.html', function() {
		timingText = document.getElementById('textid');
		timingText.textContent = Math.round(RecordingTime / 100) / 10;

		timingText.setAttribute('x', (timingText.textContent.length - 1) * 3);
	});
	InitController();
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		audioContext = new AudioContext();
		input = audioContext.createMediaStreamSource(stream);
		rec = new Recorder(input, { numChannels: 2 });
		tempRec = new Recorder(input, { numChannels: 2 });
		tempRec2 = new Recorder(input, { numChannels: 2 });
	});
});

var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var constraints = { audio: true, video: false };
var rec;
var tempRec, tempRec2;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //audio context to help us record

var anyLooping = false;
var recording = false;
var loopStartTime;
var minDuration = 999999;
var maxDuration = 0;
var playingDur = 0;
var tempAudioDur = 0;
var RecordingTime = 3000;

var tempAudio;
var tempAudio2;
var recordingAudio;
var startListenTime;
var listIndex;
var loopFunction; // For setInterval and clear interval
var inputRecorder;
var looperList = [];
var dragLooper;

var timingText;

var RECORDER_STATE = {
	EMPTY: 0,
	WAITING: 1,
	RECORDING: 2,
	RECORDED: 3,
	LOOPING: 4
};

for (var i = 0; i < 6; i++) {
	looperList.push(new Looper());
}

function ChangeMainButtonState(x, n) {
	let id = 'recorder' + x;
	document.getElementById(id).classList.remove('empty');
	document.getElementById(id).classList.remove('waiting');
	document.getElementById(id).classList.remove('recording');
	document.getElementById(id).classList.remove('recorded');
	document.getElementById(id).classList.remove('looping');
	if (n == 0) document.getElementById(id).classList.add('empty');
	if (n == 1) document.getElementById(id).classList.add('waiting');
	if (n == 2) document.getElementById(id).classList.add('recording');
	if (n == 3) document.getElementById(id).classList.add('recorded');
	if (n == 4) document.getElementById(id).classList.add('looping');
}
