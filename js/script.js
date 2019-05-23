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
		rec = new Recorder(input, { numChannels: 2 });
		tempRec = new Recorder(input, { numChannels: 2 });
		tempRec2 = new Recorder(input, { numChannels: 2 });
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
var minDuration = 0;
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
			$('#bg_circle_animate' + i)[0].beginElement();
		}
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
			recording = true;
			inputRecorder = x;
			MainButtonStartRecord(x);
			AudioInitPlay();
		}
	}
}

function AudioInitPlay() {


}

function MainButtonLoopControl(x) {

}



function MainButtonStartRecord(x) {
	let timeouttTime = 1500;
	ChangeMainButtonState(x, 1);
	if (anyLooping) {
		timeouttTime = GetRecordTimeout();
	}
	if (timeouttTime > RecordingTime) {
		$('#bg_circle_animate' + x)[0].setAttribute(
			'dur',
			RecordingTime / 1000 + 's'
		);
		setTimeout(() => {
			$('#bg_circle_animate' + x)[0].beginElement();
		}, timeouttTime - RecordingTime);
	} else {
		$('#bg_circle_animate' + x)[0].setAttribute(
			'dur',
			timeouttTime / 1000 + 's'
		); $('#bg_circle_animate' + x)[0].beginElement();
	}

	//start record audio that will push to the list (add 1 second at the head and tail)
	setTimeout(function () {
		tempAudio = document.createElement('audio');
		tempAudio2 = document.createElement('audio');
		recordingAudio = document.createElement('audio');
		rec.record();
	}, timeouttTime - 1000)


	setTimeout(function () {
		$('#bg_circle_animate' + x)[0].setAttribute(
			'dur',
			RecordingTime / 1000 + 's'
		);
		$('#bg_circle_animate' + x)[0].beginElement();
		ChangeMainButtonState(x, 2);

		//Start record 2 temp audio
		tempRec.record();
		setTimeout(() => {
			tempRec2.record();
		}, (RecordingTime * 0.5))

		//Stop record of each audio
		setTimeout(() => {
			StopTempRecord();
		}, RecordingTime / 2);
		setTimeout(() => {
			StopTemp2Record()
			looperList[x].recorded = true;
			looperList[x].looping = true;
		}, RecordingTime);
		setTimeout(function () {
			MainButtonStopRecord(x);
			recording = false;
		}, RecordingTime + 1000);

		//Play the first half audio
		setTimeout(() => {
			ChangeMainButtonState(x, 1);
			tempAudio.currentTime = 0;
			$('#bg_circle_animate' + x)[0].beginElement();
			tempAudio.muted = false;
			looperList[x].tempPlaying = true;
		}, RecordingTime);

		//Play the last half audio
		setTimeout(() => {
			tempAudio2.currentTime = 0;
			tempAudio2.muted = false;
			tempAudio.muted = true;
			tempAudio2.loop = false;
		}, (RecordingTime * 1.5));

		//Play the full audio
		setTimeout(() => {
			StartLooping();
			for (var i = 0; i < looperList[x].recorderList.length; i++) {
				looperList[x].recorderList[i].audio.currentTime = looperList[x].recorderList[i].startingTime;
				looperList[x].recorderList[i].audio.muted = false;
			}
			$('#bg_circle_animate' + x)[0].beginElement();
			looperList[x].tempPlaying = false;
		}, RecordingTime * 2)
	}, timeouttTime);
}

//Calculate the timeout time if any looping before record
function GetRecordTimeout() {
	let isLoopingShorter = true;
	let tempMax = RecordingTime;
	let maxIndex;
	let timeout;
	for (let i = 0; i < 6; i++) {
		if (looperList[i].looping) {
			if (looperList[i].dur > RecordingTime) isLoopingShorter = false;
			if (looperList[i].dur >= tempMax) {
				tempMax = looperList[i].dur;
				maxIndex = i
			}
		}
	}

	if (looperList[maxIndex].tempPlaying) {
		console.log(tempAudio.currentTime)
		if (tempAudio2.muted) timeout = tempMax - (tempAudio.currentTime) * 1000
		else timeout = (tempMax / 2) - (tempAudio2.currentTime) * 1000
	}
	else {
		timeout = tempMax - ((looperList[maxIndex].recorderList[0].audio.currentTime - looperList[maxIndex].recorderList[0].startingTime) * 1000);
		if (isLoopingShorter) {
			if (timeout < 1000) timeout += tempMax;
		} else {
			if (timeout < 1000) timeout += RecordingTime;
			else {
				while (timeout - RecordingTime > 1000) {
					timeout -= RecordingTime;
				}
			}
		}
	}
	console.log(timeout);
	return timeout;
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
	tempAudio2.muted = true;
	tempAudio2.loop = true;
	tempAudio2.play()
}
function TempRecPlayOnce(blob) {
	tempAudio.src = URL.createObjectURL(blob);
	tempAudio.muted = true;
	tempAudio.loop = true;
	tempAudio.play()
}
function MainButtonStopRecord(x) {
	rec.stop();
	rec.exportWAV(PushRecordingList);
}

function PushRecordingList(blob) {
	recordingAudio.src = URL.createObjectURL(blob);
	recordingAudio.muted = true;
	recordingAudio.loop = true;
	recordingAudio.play()
	looperList[inputRecorder].recorderList.push({ 'audio': recordingAudio, 'startingTime': 1 });
	looperList[inputRecorder].dur = RecordingTime;
	var newDuration = false;
	duration = RecordingTime;
	if (duration > maxDuration) {
		maxDuration = duration;
		newDuration = true;
	}
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
