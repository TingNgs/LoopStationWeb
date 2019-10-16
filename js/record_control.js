function OnClickTimingFunction(n) {
	if (recording) {
		showAlert("You can't set time while recording");
		return;
	}
	for (let i = 0; i < 6; i++) {
		if (looperList[i].recorded && (n == 0 || n == 1)) {
			showAlert('You can only times or divide after recorded');
			return;
		}
	}
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
		if (recording) {
			showAlert("You can't record two audio at the same time");
		} else {
			recording = true;
			inputRecorder = x;
			MainButtonStartRecord(x);
			looperList[x].dur = RecordingTime;
		}
	}
}

function MainButtonStartRecord(x) {
	let timeouttTime = 1500;
	ChangeMainButtonState(x, RECORDER_STATE.WAITING);
	if (anyLooping) {
		timeouttTime = GetRecordTimeout();
	}
	SetCircleTime(timeouttTime, x);
	useRecorder = useRecorder ? 0 : 1;
	if (page == 2) {
		//start record audio that will push to the list (add 1 second at the head and tail)
		setTimeout(function() {
			rec[useRecorder].record();
		}, timeouttTime - 1000);
		setTimeout(function() {
			tempRec[useRecorder].record();
			StopRecording(x);
			PlayRecording(x);
		}, timeouttTime);
	} else {
		setTimeout(function() {
			StartListening(x);
		}, timeouttTime - 1000);
	}
}

function StartListening(x) {
	startListenTime = new Date().getTime();
	listIndex = looperList[x].recorderList.length;
	let instrument = GetInstrumentType();
	looperList[x].recorderList.push({
		audioList: [],
		startingTime: 1,
		instrument,
		muted: false
	});
	setTimeout(() => {
		looperList[x].recorded = true;
		looperList[x].looping = true;
	}, looperList[x].dur + 500);
	setTimeout(function() {
		ChangeMainButtonState(x, RECORDER_STATE.LOOPING);
		if (!anyLooping) {
			if (looperList[x].dur < minDuration) {
				minDuration = looperList[x].dur;
			}
			StartLooping();
		} else {
			if (looperList[x].dur < minDuration) {
				minDuration = looperList[x].dur;
				clearInterval(loopFunction);
				StartLooping(minDuration);
			}
		}
		if (looperList[x].dur > maxDuration) {
			maxDuration = looperList[x].dur;
			clearInterval(loopFunction);
			StartLooping();
		}
		setTimeout(() => {
			recording = false;
		}, 1000);
	}, looperList[x].dur + 1000);
}

function SetCircleTime(timeouttTime, x) {
	setAnimation(x, timeouttTime / 1000);
	setTimeout(() => {
		setAnimation(x, looperList[x].dur / 1000);
		ChangeMainButtonState(x, RECORDER_STATE.RECORDING);
	}, timeouttTime);
}

function StopRecording(x) {
	//Stop record of each audio
	setTimeout(() => {
		tempRec[useRecorder].stop();
		tempRec[useRecorder].getBuffer(getTempBufferCallback);
		tempRec[useRecorder].clear();
	}, looperList[x].dur);
	setTimeout(function() {
		rec[useRecorder].stop();
		rec[useRecorder].exportWAV(blob => PushRecordingList(blob, x));
		rec[useRecorder].clear();
		recording = false;
	}, looperList[x].dur + 1000);
}

function PlayRecording(x) {
	//Play the first half audio
	setTimeout(() => {
		ChangeMainButtonState(x, RECORDER_STATE.LOOPING);
		setAnimation(x, looperList[x].dur / 1000);
		looperList[x].tempPlaying = true;
		looperList[x].recorded = true;
		looperList[x].looping = true;
		setTimeout(() => {
			looperList[x].tempPlaying = false;
		}, looperList[x].dur);

		if (anyLooping) {
			if (looperList[x].dur > maxDuration) {
				maxDuration = looperList[x].dur;
				console.log('Max update  ' + maxDuration);
				setTimeout(() => {
					if (!looperList[x].recorded) return;
					clearInterval(loopFunction);
					StartLooping();
				}, looperList[x].dur);
			}
			if (looperList[x].dur < minDuration) {
				setTimeout(() => {
					if (!looperList[x].recorded) return;
					minDuration = looperList[x].dur;
					clearInterval(loopFunction);
					StartLooping(minDuration * 2);
				}, looperList[x].dur);
			}
		} else {
			if (looperList[x].dur > maxDuration) {
				maxDuration = looperList[x].dur;
				console.log('Max update  ' + maxDuration);
			}
			setTimeout(() => {
				if (!looperList[x].recorded) return;
				if (looperList[x].dur < minDuration) {
					minDuration = looperList[x].dur;
				}
				StartLooping();
			}, looperList[x].dur);
		}
		anyLooping = true;
	}, looperList[x].dur);
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
		if (timeout < 1000) timeout += tempMax;
		/*if (isLoopingShorter) {
			if (timeout < 1000) timeout += tempMax;
		} else {
			if (timeout < 1000) timeout += RecordingTime;
			else {
				while (timeout - RecordingTime > 1000) {
					timeout -= RecordingTime;
				}
			}
		}*/
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

function PushRecordingList(blob, x) {
	let recordingAudio = new Howl({
		src: [URL.createObjectURL(blob)],
		format: ['wav'],
		loop: true,
		autoplay: true,
		mute: true
	});

	recordingAudio.play();
	let tempIndex =
		looperList[x].recorderList.push({
			audio: recordingAudio,
			startingTime: 1,
			instrument: false,
			muted: false
		}) - 1;
	looperList[x].recorderList[tempIndex].audio.on('end', () => {
		looperList[x].recorderList[tempIndex].audio.mute(true);
		if (!looperList[x].looping) {
			looperList[x].recorderList[tempIndex].audio.stop();
		}
	});
	if (x == settingRecorder) {
		loadSettingPage(settingRecorder);
	}
}
