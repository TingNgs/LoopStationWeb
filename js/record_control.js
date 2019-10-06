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
	let instrument = GetInstrumentType();
	looperList[inputRecorder].recorderList.push({
		audioList: [],
		startingTime: 1,
		instrument
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
		}, 1000);
	}, RecordingTime + 1000);
}

function SetCircleTime(timeouttTime, x) {
	setAnimation(x, timeouttTime / 1000);

	setTimeout(() => {
		setAnimation(x, RecordingTime / 1000);
		ChangeMainButtonState(x, RECORDER_STATE.RECORDING);
	}, timeouttTime);
}

function StopRecording(x) {
	//Stop record of each audio
	setTimeout(() => {
		tempRec.stop();
		tempRec.getBuffer(getTempBufferCallback);
		tempRec.clear();
		looperList[x].recorded = true;
		looperList[x].looping = true;
	}, RecordingTime);
	setTimeout(function() {
		rec.stop();
		rec.exportWAV(PushRecordingList);
		rec.clear();
		recording = false;
	}, RecordingTime + 1000);
}

function PlayRecording(x) {
	//Play the first half audio
	setTimeout(() => {
		ChangeMainButtonState(x, RECORDER_STATE.LOOPING);
		setAnimation(x, RecordingTime / 1000);
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
			else {
				playingDur = 0;
			}
			StartLooping();
			playingDur += minDuration;
			if (playingDur >= maxDuration) playingDur = 0;
		}
	}, RecordingTime);

	//Play the full audio
	setTimeout(() => {
		looperList[x].tempPlaying = false;
		for (var i = 0; i < looperList[x].recorderList.length; i++) {
			looperList[x].recorderList[i].audio.seek(
				looperList[x].recorderList[i].startingTime
			);
			looperList[x].recorderList[i].audio.mute(false);
		}
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
				tempMax = looperList[i].dur;
				maxIndex = i;
			}
		}
	}
	if (looperList[maxIndex].tempPlaying) {
		timeout =
			tempMax -
			(tempAudio.context.currentTime - tempAudio.startedAt) * 1000;
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

function getTempBufferCallback(buffers) {
	tempAudio = audioContext.createBufferSource();
	var newBuffer = audioContext.createBuffer(
		2,
		buffers[0].length,
		audioContext.sampleRate
	);
	newBuffer.getChannelData(0).set(buffers[0]);
	newBuffer.getChannelData(1).set(buffers[1]);
	tempAudio.buffer = newBuffer;
	tempAudio.connect(audioContext.destination);
	tempAudio.startedAt = tempAudio.context.currentTime;
	tempAudio.start(0);
}

function PushRecordingList(blob) {
	recordingAudio = new Howl({
		src: [URL.createObjectURL(blob)],
		format: ['wav'],
		loop: true,
		autoplay: true,
		mute: true
	});
	recordingAudio.on('end', () => {
		recordingAudio.mute(true);
	});
	recordingAudio.play();
	looperList[inputRecorder].startingLoop = true;
	looperList[inputRecorder].recorderList.push({
		audio: recordingAudio,
		startingTime: 1,
		instrument: false
	});
}
