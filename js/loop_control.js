function StartLooping(tempDur = 0) {
	if (CheckEndLoop()) return;
	anyLooping = true;
	playingDur = tempDur;
	loopStartTime = new Date().getTime() - tempDur;
	LoopFunction();
	loopFunction = setInterval(() => {
		LoopFunction();
	}, minDuration);
}

function findMinDur() {
	let tempMin = 999999;
	for (let i = 0; i < 6; i++) {
		if (looperList[i].recorded && looperList[i].dur < tempMin)
			tempMin = looperList[i].dur;
	}
	console.log('update min :' + tempMin);
	return tempMin;
}

function findMaxDur() {
	let tempMax = 0;
	for (let i = 0; i < 6; i++) {
		if (looperList[i].recorded && looperList[i].dur > tempMax)
			tempMax = looperList[i].dur;
	}
	console.log('update max :' + tempMax);
	return tempMax;
}

function LoopFunction() {
	if (playingDur >= maxDuration) playingDur = 0;
	if (playingDur == 0) {
		if (updateMin || updateMax) {
			minDuration = findMinDur();
			maxDuration = findMaxDur();
			updateMin = false;
			updateMax = false;
			if (!CheckEndLoop()) {
				clearInterval(loopFunction);
				StartLooping();
				return;
			}
		}
		loopStartTime = new Date().getTime();
	}
	for (let i = 0; i < 6; i++) {
		if (looperList[i].recorded && playingDur % looperList[i].dur == 0) {
			if (looperList[i].looping) {
				setAnimation(i, looperList[i].dur / 1000);
				ChangeMainButtonState(i, RECORDER_STATE.LOOPING);
				for (let j = 0; j < looperList[i].recorderList.length; j++) {
					if (looperList[i].recorderList[j].instrument) {
						for (
							let k = 0;
							k < looperList[i].recorderList[j].audioList.length;
							k++
						) {
							if (
								looperList[i].recorderList[j].audioList[k]
									.time >
									looperList[i].recorderList[j].startingTime *
										1000 &&
								looperList[i].recorderList[j].audioList[k]
									.time <
									looperList[i].recorderList[j].startingTime *
										1000 +
										looperList[i].dur
							) {
								setTimeout(() => {
									looperList[i].recorderList[j].audioList[
										k
									].audio.seek(0);
									looperList[i].recorderList[j].audioList[
										k
									].audio.play();
								}, looperList[i].recorderList[j].audioList[k].time - looperList[i].recorderList[j].startingTime * 1000);
							}
						}
					} else {
						if (looperList[i].recorderList[j].startingTime < 0) {
							if (
								looperList[i].recorderList[j].startingTime !=
								-looperList[i].dur / 1000
							) {
								let timeout =
									looperList[i].recorderList[j].startingTime *
									1000;
								setTimeout(() => {
									looperList[i].recorderList[j].audio.mute(
										looperList[i].recorderList[j].muted
									);
									looperList[i].recorderList[j].audio.seek(0);
									setTimeout(() => {
										looperList[i].recorderList[
											j
										].audio.mute(true);
									}, looperList[i].dur + timeout);
								}, -timeout);
							}
						} else if (
							looperList[i].recorderList[j].startingTime !=
							looperList[i].dur / 1000 + 2
						) {
							looperList[i].recorderList[j].audio.mute(
								looperList[i].recorderList[j].muted
							);
							looperList[i].recorderList[j].audio.seek(
								looperList[i].recorderList[j].startingTime
							);
						}
					}
				}
			}
		}
	}
	playingDur += minDuration;
}
function MainButtonLoopControl(x) {
	if (looperList[x].looping) {
		if (looperList[x].tempPlaying) {
			tempAudio.stop();
			looperList[x].tempPlaying = false;
		}
		for (let j = 0; j < looperList[x].recorderList.length; j++) {
			if (!looperList[x].recorderList[j].instrument) {
				looperList[x].recorderList[j].audio.stop();
			}
		}
		stopAnimation(x);
		looperList[x].looping = false;
		ChangeMainButtonState(x, RECORDER_STATE.RECORDED);
		CheckEndLoop();
	} else {
		ChangeMainButtonState(x, RECORDER_STATE.WAITING);
		looperList[x].looping = true;
		if (!looperList[x].instrument) {
			for (let j = 0; j < looperList[x].recorderList.length; j++) {
				if (!looperList[x].recorderList[j].instrument) {
					looperList[x].recorderList[j].audio.mute(true);
					looperList[x].recorderList[j].audio.play();
				}
			}
		}
		if (!anyLooping) {
			StartLooping();
		}
	}
}

function CheckEndLoop() {
	var endLoop = true;
	for (let i = 0; i < looperList.length; i++) {
		if (looperList[i].looping) endLoop = false;
	}
	if (endLoop) {
		anyLooping = false;
		clearInterval(loopFunction);
		return true;
	}
	return false;
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
				maxIndex = i;
			}
		}
	}
	if (looperList[maxIndex].tempPlaying) {
		timeout = tempMax - tempAudio.currentTime * 1000;
	} else {
		timeout =
			tempMax -
			(looperList[maxIndex].recorderList[0].audio.seek() -
				looperList[maxIndex].recorderList[0].startingTime) *
				1000;
	}
	while (timeout - playDur > 0) {
		timeout -= playDur;
	}
	return timeout;
}
