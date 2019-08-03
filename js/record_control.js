function OnClickTimingFunction(n) {
	let temp;
	if (n == 0) temp = RecordingTime + 100;
	if (n == 1) temp = RecordingTime - 100;
	if (n == 2) temp = RecordingTime * 2;
	if (n == 3) temp = RecordingTime / 2;
	if (temp < 100000 && temp > 0) RecordingTime = temp;
	timingText.textContent = Math.round(RecordingTime / 100) / 10;
	timingText.setAttribute('x', (timingText.textContent.length - 1) * 3);
}

console.log(iOS);

function OnClickRrecorder(x) {
	//Main control button
	let id = 'recorder' + x; // flood proofing
	if (document.getElementById(id).classList.contains('waiting')) return;
	if (looperList[x].recorded) {
		//Recorded, play or stop loop
		MainButtonLoopControl(x);
	} else {
		//Not recorded, ready to record
		recording = true;
		inputRecorder = x;
		MainButtonStartRecord(x);
		looperList[x].dur = RecordingTime;
		tempAudio = document.createElement('audio');
		tempAudio2 = document.createElement('audio');
		recordingAudio = document.createElement('audio');
	}
}

function MainButtonStartRecord(x) {
	let timeouttTime = 1500;
	ChangeMainButtonState(x, RECORDER_STATE.WAITING);
	if (anyLooping) {
		timeouttTime = GetRecordTimeout();
	}
	SetCircleTime(timeouttTime, x);

	if (page == 2) {
		//start record audio that will push to the list (add 1 second at the head and tail)
		setTimeout(function() {
			rec.record();
		}, timeouttTime - 1000);
		setTimeout(function() {
			//Start record 2 temp audio
			tempRec.record();
			if (RecordingTime > maxDuration) {
				maxDuration = RecordingTime;
				console.log('Max update  ' + maxDuration);
			}
			setTimeout(() => {
				tempRec2.record();
			}, RecordingTime * 0.5);
			StopRecording(x);
			PlayRecording(x);
		}, timeouttTime);
	} else {
		setTimeout(function() {
			StartListening();
		}, timeouttTime - 1000);
	}
}

function StartListening() {
	startListenTime = new Date().getTime();
	listIndex = looperList[inputRecorder].recorderList.length;
	looperList[inputRecorder].recorded = true;
	looperList[inputRecorder].recorderList.push({
		audioList: [],
		startingTime: 1,
		instrument: true
	});
	if (RecordingTime > maxDuration) {
		maxDuration = RecordingTime;
		console.log('Max update  ' + maxDuration);
	}
	if (RecordingTime < minDuration) {
		minDuration = RecordingTime;
	}
	looperList[inputRecorder].looping = true;
	setTimeout(function() {
		ChangeMainButtonState(inputRecorder, RECORDER_STATE.LOOPING);
		if (!anyLooping) {
			LoopFunction();
			StartLooping();
		}
		setTimeout(() => {
			recording = false;
			console.log(looperList[inputRecorder].recorderList);
		}, 1000);
	}, RecordingTime + 1000);
}

function SetCircleTime(timeouttTime, x) {
	$('#bg_circle_animate' + x)[0].setAttribute(
		'dur',
		timeouttTime / 1000 + 's'
	);
	$('#bg_circle_animate' + x)[0].beginElement();

	setTimeout(() => {
		$('#bg_circle_animate' + x)[0].setAttribute(
			'dur',
			RecordingTime / 1000 + 's'
		);
		$('#bg_circle_animate' + x)[0].beginElement();
		ChangeMainButtonState(x, RECORDER_STATE.RECORDING);
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
	setTimeout(function() {
		StopRecord(rec, PushRecordingList);
		recording = false;
	}, RecordingTime + 1000);
}

function PlayRecording(x) {
	//Play the first half audio
	setTimeout(() => {
		ChangeMainButtonState(x, RECORDER_STATE.LOOPING);
		tempAudio.currentTime = 0;
		$('#bg_circle_animate' + x)[0].beginElement();
		tempAudio.muted = false;
		looperList[x].tempPlaying = true;
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
	}, RecordingTime * 1.5);

	//Play the full audio
	setTimeout(() => {
		for (var i = 0; i < looperList[x].recorderList.length; i++) {
			looperList[x].recorderList[i].audio.currentTime =
				looperList[x].recorderList[i].startingTime;
			looperList[x].recorderList[i].audio.muted = false;
		}
		looperList[x].tempPlaying = false;
	}, RecordingTime * 2);
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
				console.log(i, looperList[i].dur);
				tempMax = looperList[i].dur;
				maxIndex = i;
			}
		}
	}
	if (looperList[maxIndex].tempPlaying) {
		if (tempAudio2.muted) timeout = tempMax - tempAudio.currentTime * 1000;
		else timeout = tempMax / 2 - tempAudio2.currentTime * 1000;
		if (timeout < 1000) timeout += tempMax;
	} else {
		timeout = tempMax - (new Date().getTime() - loopStartTime);
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
	tempAudio2.play();
}
function TempRecPlayOnce(blob) {
	tempAudio.src = URL.createObjectURL(blob);
	tempAudio.muted = true;
	tempAudio.loop = true;
	tempAudio.play();
}
function PushRecordingList(blob) {
	recordingAudio.src = URL.createObjectURL(blob);
	recordingAudio.muted = true;
	recordingAudio.loop = true;
	recordingAudio.play();
	looperList[inputRecorder].recorderList.push({
		audio: recordingAudio,
		startingTime: 1,
		instrument: false
	});
}

function OnClickReset(x) {
	//Reset button for recorder
	if (looperList.looping) clearInterval(loopFunction);
	looperList[x].Reset();
	ChangeMainButtonState(x, RECORDER_STATE.EMPTY);
	CheckEndLoop();
}

function drag(ev, n) {
	ChangeMainButtonState(n, RECORDER_STATE.LOOPING);
	ev.dataTransfer.setData('text', ev.target.id);
	dragLooper = n;
}
function drop(ev, n) {
	ev.preventDefault();
	ChangeMainButtonState(n, RECORDER_STATE.RECORDED);
	if (looperList[n].recorded && looperList[dragLooper].recorded) {
		if (looperList[n].dur == looperList[dragLooper].dur) {
			if (looperList[n].looping) looperList[n].startingLoop = true;
			for (
				let i = 0;
				i < looperList[dragLooper].recorderList.length;
				i++
			) {
				//looperList[dragLooper].recorderList[i].audio.pause();
				let order =
					looperList[n].recorderList.push(
						looperList[dragLooper].recorderList[i]
					) - 1;
				//looperList[n].recorderList[order].audio.muted = true;
				//looperList[n].recorderList[order].audio.play();
			}
			looperList[dragLooper].Reset();
			ChangeMainButtonState(dragLooper, RECORDER_STATE.EMPTY);
			$('#bg_circle_animate' + dragLooper)[0].endElement();
			console.log($('#bg_circle_animate' + dragLooper));
		}
	}
}
function allowDrop(ev) {
	ev.preventDefault();
}
