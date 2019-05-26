$(function () {
	$('#function_bar').load('function_bar.html', function () {
		timingText = document.getElementById('textid'); timingText.textContent = Math.round(RecordingTime / 100) / 10;

		timingText.setAttribute('x', (timingText.textContent.length - 1) * 3)
	});
	SetController();
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
var minDuration = 999999;
var maxDuration = 0;
var playingDur = 0;
var tempAudioDur = 0;
var RecordingTime = 3000;

var tempAudio;
var tempAudio2;
var recordingAudio;

var loopFunction; // For setInterval and clear interval
var inputRecorder;
var looperList = [];

var timingText;

for (var i = 0; i < 6; i++) {
	looperList.push(new Looper());
}

function OnClickTimingFunction(n) {
	let temp;
	if (n == 0) temp = RecordingTime + 100;
	if (n == 1) temp = RecordingTime - 100;
	if (n == 2) temp = RecordingTime * 2;
	if (n == 3) temp = RecordingTime / 2;
	if (temp < 100000 && temp > 0) RecordingTime = temp;
	timingText.textContent = Math.round(RecordingTime / 100) / 10;
	timingText.setAttribute('x', (timingText.textContent.length - 1) * 3)
}

console.log(iOS);

function StartLooping() {
	loopFunction = setInterval(() => {
		LoopFunction();
	}, minDuration);
}
function LoopFunction() {

	loopStartTime = new Date().getTime();
	for (let i = 0; i < 6; i++) {
		if (looperList[i].looping) {
			if (playingDur % looperList[i].dur == 0) {
				if (looperList[i].ending) {
					for (let j = 0; j < looperList[i].recorderList.length; j++) {
						looperList[i].recorderList[j].audio.pause();
					}
					looperList[i].looping = false;
					looperList[i].ending = false;
					CheckEndLoop()
				} else {
					for (let j = 0; j < looperList[i].recorderList.length; j++) {
						looperList[i].recorderList[j].audio.currentTime = looperList[i].recorderList[j].startingTime;
					}
					$('#bg_circle_animate' + i)[0].setAttribute(
						'dur',
						looperList[i].dur / 1000 + 's'
					)
					$('#bg_circle_animate' + i)[0].beginElement();
				}

			}
		}
	}
	playingDur += minDuration;
	if (playingDur >= maxDuration) playingDur = 0;
}
function CheckEndLoop() {
	var endLoop = true;
	for (let i = 0; i < looperList.length; i++) {
		if (looperList[i].looping) endLoop = false;
	}
	if (endLoop) {
		anyLooping = false;
		clearInterval(loopFunction)
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
			tempAudio = document.createElement('audio'); tempAudio2 = document.createElement('audio'); recordingAudio = document.createElement('audio');
		}
	}
}
function MainButtonLoopControl(x) {
	if (looperList[x].looping) {
		looperList[x].ending = true;
	} else {
		StartLooperLooping(x)
	}
}

function StartLooperLooping(x) {
	let tempTimeout = 0
	if (anyLooping) {
		tempTimeout = GetPlayTimeout(looperList[x].dur)
		$('#bg_circle_animate' + x)[0].setAttribute(
			'dur',
			tempTimeout / 1000 + 's'
		); $('#bg_circle_animate' + x)[0].beginElement();

	}

	for (let j = 0; j < looperList[x].recorderList.length; j++) {
		looperList[x].recorderList[j].audio.muted = true;
		looperList[x].recorderList[j].audio.play();
	}
	looperList[x].looping = true;
	setTimeout(() => {

		for (let j = 0; j < looperList[x].recorderList.length; j++) {
			looperList[x].recorderList[j].audio.muted = false;
		}
		if (!anyLooping) {
			anyLooping = true
			playingDur = 0;
			LoopFunction();
			StartLooping();
		}
	}, tempTimeout);
}


//Calculate the timeout time if any looping before record
function GetPlayTimeout(playDur) {
	let tempMax = 0;
	let maxIndex = 0;
	let timeout;
	for (let i = 0; i < 6; i++) {
		if (looperList[i].looping) {
			if (looperList[i].dur >= tempMax) {
				tempMax = looperList[i].dur;
				maxIndex = i
			}
		}
	}
	if (looperList[maxIndex].tempPlaying) {
		if (tempAudio2.muted) timeout = tempMax - (tempAudio.currentTime) * 1000
		else timeout = (tempMax / 2) - (tempAudio2.currentTime) * 1000
	}
	else {
		timeout = tempMax - ((looperList[maxIndex].recorderList[0].audio.currentTime - looperList[maxIndex].recorderList[0].startingTime) * 1000);
	}
	while (timeout - playDur > 0) {
		timeout -= playDur;
	}
	return timeout;
}

function MainButtonStartRecord(x) {
	let timeouttTime = 1500;
	ChangeMainButtonState(x, 1);
	if (anyLooping) {
		timeouttTime = GetRecordTimeout();
	}
	SetCircleTime(timeouttTime, x);

	//start record audio that will push to the list (add 1 second at the head and tail)
	setTimeout(function () {
		rec.record();
	}, timeouttTime - 1000)
	setTimeout(function () {
		//Start record 2 temp audio
		tempRec.record();
		if (RecordingTime > maxDuration) maxDuration = RecordingTime;
		console.log("Max update  " + maxDuration)
		setTimeout(() => {
			tempRec2.record();
		}, (RecordingTime * 0.5))

		StopRecording(x)
		PlayRecording(x)

	}, timeouttTime);
}

function SetCircleTime(timeouttTime, x) {

	$('#bg_circle_animate' + x)[0].setAttribute(
		'dur',
		timeouttTime / 1000 + 's'
	); $('#bg_circle_animate' + x)[0].beginElement();


	setTimeout(() => {
		$('#bg_circle_animate' + x)[0].setAttribute(
			'dur',
			RecordingTime / 1000 + 's'
		);
		$('#bg_circle_animate' + x)[0].beginElement();
		ChangeMainButtonState(x, 2);
	}, timeouttTime);
}

function StopRecording(x) {
	//Stop record of each audio
	setTimeout(() => {

		StopRecord(tempRec, TempRecPlayOnce);
	}, RecordingTime / 2);
	setTimeout(() => {

		StopRecord(tempRec2, TempRec2PlayOnce);
		looperList[x].recorded = true;
		looperList[x].looping = true;
	}, RecordingTime);
	setTimeout(function () {

		StopRecord(rec, PushRecordingList);
		recording = false;
	}, RecordingTime + 1000);
}
function PlayRecording(x) {
	//Play the first half audio
	setTimeout(() => {
		ChangeMainButtonState(x, 4);
		tempAudio.currentTime = 0;
		$('#bg_circle_animate' + x)[0].beginElement();
		tempAudio.muted = false;
		looperList[x].tempPlaying = true;
		looperList[inputRecorder].dur = RecordingTime;
		if (anyLooping) {
			if (RecordingTime < minDuration) {
				minDuration = RecordingTime;
				setTimeout(() => {
					clearInterval(loopFunction);
					LoopFunction();
					StartLooping();
				}, RecordingTime);
			}
		} else {
			if (RecordingTime < minDuration) minDuration = RecordingTime;
			anyLooping = true;
			StartLooping();
			playingDur += minDuration;
			if (playingDur >= maxDuration) playingDur = 0;
		}

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
		for (var i = 0; i < looperList[x].recorderList.length; i++) {
			looperList[x].recorderList[i].audio.currentTime = looperList[x].recorderList[i].startingTime;
			looperList[x].recorderList[i].audio.muted = false;
		}
		looperList[x].tempPlaying = false;
	}, RecordingTime * 2)
}




//Calculate the timeout time if any looping before record
function GetRecordTimeout() {
	let isLoopingShorter = true;
	let tempMax = 0;
	let maxIndex = 0;
	let timeout;
	for (let i = 0; i < 6; i++) {
		if (looperList[i].looping) {
			if (looperList[i].dur > RecordingTime) isLoopingShorter = false;
			if (looperList[i].dur >= tempMax) {
				console.log(i, looperList[i].dur)
				tempMax = looperList[i].dur;
				maxIndex = i
			}
		}
	}
	if (looperList[maxIndex].tempPlaying) {
		if (tempAudio2.muted) timeout = tempMax - (tempAudio.currentTime) * 1000
		else timeout = (tempMax / 2) - (tempAudio2.currentTime) * 1000
		if (timeout < 1000) timeout += tempMax;
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
	return timeout;
}
function StopRecord(recorder, cb) {
	recorder.stop();
	recorder.exportWAV(cb);
	recorder.clear();
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
function PushRecordingList(blob) {
	recordingAudio.src = URL.createObjectURL(blob);
	recordingAudio.muted = true;
	recordingAudio.loop = true;
	recordingAudio.play()
	looperList[inputRecorder].recorderList.push({ 'audio': recordingAudio, 'startingTime': 1 });
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
