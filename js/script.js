$(function () {
	$('#function_bar').load('function_bar.html');
	SetController();
	/*rec = Recorder({
		bitRate: 320,
		sampleRate: 48000
	});
	rec.open();
	tempRec = Recorder({
		bitRate: 320,
		sampleRate: 48000
	});
	tempRec.open();*/

	navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
		audioContext = new AudioContext();
		input = audioContext.createMediaStreamSource(stream);
		rec = new Recorder(input, { numChannels: 1 });
		tempRec = new Recorder(input, { numChannels: 1 });
		tempRec2 = new Recorder(input, { numChannels: 1 });
		console.log('Recording started');
	});
});

function SetController() {
	$('#main').load('record_control.html', function () {
		$.get('./recorder.html', function (html_string) {
			recorderHTML = html_string;
			for (let i = 0; i < 6; i++) {
				let tempRecorderHTML = recorderHTML.replace(/{{ index }}/g, i);
				$('#recorder_row').append(tempRecorderHTML);
				$.get('./main_button.html', function (html_string) {
					let mainButtonHTML = html_string;
					mainButtonHTML = mainButtonHTML.replace(/{{ index }}/g, i);
					$('#recorder_top' + i).append(mainButtonHTML);
				});
			}
		});
	});
}

var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var constraints = { audio: true, video: false };
var rec;
var tempRec, tempRec2;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //audio context to help us record

var anyLooping = false;
var recording = false;
var loopStartTime;
var maxDuration = 0;
var tempAudioDur = 0;
var RecordingTime = 5000;

var tempAudio;
var tempAudio2;
var recordingAudio;

var loopFunction; // For setInterval and clear interval
var inputRecorder;
var looperList = [];

for (var i = 0; i < 6; i++) {
	looperList.push(new Looper());
}

console.log(iOS);

function StartLooping() {
	loopFunction = setInterval(() => {
		LoopFunction();
	}, maxDuration);
	LoopFunction();
}

function CheckEndLoop() {
	var endLoop = true;
	for (let i = 0; i < looperList.length; i++) {
		if (looperList[i].looping) endLoop = false;
	}
	if (endLoop) {
		anyLooping = false;
	}
}

function LoopFunction() {
	loopStartTime = new Date().getTime();
	for (let i = 0; i < 6; i++) {
		if (looperList[i].looping) {
			for (let j = 0; i < looperList[j].recorderList.length; j++) {
				looperList[i].recorderList[j].audio.currentTime = looperList[i].recorderList[j].startingTime;

			}
		}
		$('#bg_circle_animate' + i)[0].beginElement();
	}
}

function OnClickRrecorder(x) {
	//Main control button
	let id = 'recorder' + x; // flood proofing
	if (document.getElementById(id).classList.contains('waiting')) return;
	if (looperList[x].recorded) {
		//Recorded, play or stop loop
		MainButtonLoopControl(x);

	} else {
		//Not recorded, ready to record
		if (recording) {
			MainButtonStopRecord(x);
		} else {
			inputRecorder = x;
			AudioInitPlay();
			MainButtonStartRecord(x);

		}
		recording = !recording;
	}
}

function AudioInitPlay() {
	tempAudio = document.createElement('audio');
	tempAudio2 = document.createElement('audio');
	recordingAudio = document.createElement('audio');

	AudioInitSet(tempAudio);
	AudioInitSet(tempAudio2);
	AudioInitSet(recordingAudio);
}

function AudioInitSet(audio) {
	audio.loop = true;
	audio.muted = true;
	audio.play();
}

function MainButtonLoopControl(x) {
	if (looperList[x].looping) {
		looperList[x].looping = false;
		clearInterval(loopFunction);
		ChangeMainButtonState(x, 3);
		CheckEndLoop();
	} else {
		ChangeMainButtonState(x, 1);
		let timeouttTime = 0;
		looperList[x].looping = true;
		if (anyLooping)
			timeouttTime = maxDuration - (new Date().getTime() - loopStartTime);
		else StartLooping();
		anyLooping = true;
		setTimeout(function () {
			ChangeMainButtonState(x, 4);
			StartLooping();
		}, timeouttTime);
	}
}

function MainButtonStartRecord(x) {
	let timeouttTime = 1500;
	ChangeMainButtonState(x, 1);
	if (anyLooping) {
		timeouttTime = maxDuration - (new Date().getTime() - loopStartTime);
	}
	$('#bg_circle_animate' + x)[0].setAttribute(
		'dur',
		RecordingTime / 1000 + 's'
	);

	setTimeout(function () {
		rec.record();
		setTimeout(function () { MainButtonStopRecord(x); }, RecordingTime + 2000);
	}, timeouttTime - 1000)

	setTimeout(function () {
		tempRec.record();
		$('#bg_circle_animate' + x)[0].beginElement();
		//ChangeMainButtonState(x, 2);
		setTimeout(() => {
			tempRec2.record();
		}, (RecordingTime * 0.5))
		setTimeout(() => {
			StopTempRecord();
		}, RecordingTime / 2);
		setTimeout(() => {
			tempAudio.currentTime = 0;
			$('#bg_circle_animate' + inputRecorder)[0].beginElement();
			tempAudio.muted = false;
		}, RecordingTime);
		setTimeout(() => {
			tempAudio2.currentTime = 0;
			tempAudio2.muted = false;
			tempAudio.muted = true;
			tempAudio2.loop = false;
		}, (RecordingTime * 1.5));
		setTimeout(() => {
			StopTemp2Record()
		}, RecordingTime);
		setTimeout(() => {
			recordingAudio.muted = false;
			StartLooping();
		}, RecordingTime * 2)
	}, timeouttTime);
}

function StopTempRecord() {
	tempRec.stop();
	tempRec.exportWAV(TempRecPlayOnce);
}
function StopTemp2Record() {
	tempRec2.stop();
	tempRec2.exportWAV(TempRec2PlayOnce);
}
function TempRec2PlayOnce(blob) {
	tempAudio2.src = URL.createObjectURL(blob);

}
function TempRecPlayOnce(blob) {
	tempAudio.src = URL.createObjectURL(blob);
}
function MainButtonStopRecord(x) {
	rec.stop();
	//ChangeMainButtonState(x, 1);
	rec.exportWAV(PushRecordingList);
}

function PushRecordingList(blob) {
	recordingAudio.src = URL.createObjectURL(blob);
	looperList[inputRecorder].recorderList.push({ 'audio': recordingAudio, 'startingTime': 1 });
	looperList[inputRecorder].recorded = true;
	looperList[inputRecorder].looping = true;
	var newDuration = false;
	duration = RecordingTime;
	if (duration > maxDuration) {
		maxDuration = duration;
		newDuration = true;
	}
	//ChangeMainButtonState(inputRecorder, 1);
	var timeouttTime = 0;
	if (!newDuration)
		timeouttTime = maxDuration - (new Date().getTime() - loopStartTime);
	if (anyLooping)
		setTimeout(function () {
			ChangeMainButtonState(inputRecorder, 4);
		}, timeouttTime);
	else {
		ChangeMainButtonState(inputRecorder, 4);
		anyLooping = true;
	}
}
function OnClickIosOnLoad() {
	for (let i = 0; i < 6; i++) {
		ChangeMainButtonState(i, 1);
		if (looperList[i].recorded) {
			for (let j = 0; j < looperList[i].recorderList.length; j++) {
				looperList[i].recorderList[j].muted = true;
				looperList[i].recorderList[j].play();
				setTimeout(function () {
					looperList[i].recorderList[j].muted = false;
				}, maxDuration + 2000);
			}
		}
		setTimeout(function () {
			if (looperList[i].recorded) ChangeMainButtonState(i, 3);
			else ChangeMainButtonState(i, 0);
		}, maxDuration + 2000);
	}
}

function IosOnLoad(i) {
	ChangeMainButtonState(i, 1);
	for (let j = 0; j < looperList[i].recorderList.length; j++) {
		looperList[i].recorderList[j].muted = true;
		looperList[i].recorderList[j].play();
		setTimeout(function () {
			looperList[i].recorderList[j].muted = false;
		}, maxDuration + 2000);
	}
	setTimeout(function () {
		ChangeMainButtonState(i, 3);
	}, maxDuration + 2000);
}

function OnClickReset(x) {
	//Reset button for recorder
	if (looperList.looping) clearInterval(loopFunction);
	looperList[x].Reset();
	ChangeMainButtonState(x, 0);
	CheckEndLoop();
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
