function StartLooping() {
	anyLooping = true;
	loopFunction = setInterval(() => {
		LoopFunction();
	}, minDuration);
}
function LoopFunction() {
	if (playingDur == 0) loopStartTime = new Date().getTime();
	for (let i = 0; i < 6; i++) {
		if (looperList[i].recorded && playingDur % looperList[i].dur == 0) {
			setAnimation(i, looperList[i].dur / 1000);
			if (looperList[i].looping) {
				if (looperList[i].ending) {
					for (
						let j = 0;
						j < looperList[i].recorderList.length;
						j++
					) {
						if (!looperList[i].recorderList[j].instrument) {
							looperList[i].recorderList[j].audio.pause();
						}
					}
					looperList[i].looping = false;
					looperList[i].ending = false;
					ChangeMainButtonState(i, RECORDER_STATE.RECORDED);
					CheckEndLoop();
				} else {
					for (
						let j = 0;
						j < looperList[i].recorderList.length;
						j++
					) {
						if (looperList[i].recorderList[j].instrument) {
							for (
								let k = 0;
								k <
								looperList[i].recorderList[j].audioList.length;
								k++
							) {
								if (
									looperList[i].recorderList[j].audioList[k]
										.time >
										looperList[i].recorderList[j]
											.startingTime *
											1000 &&
									looperList[i].recorderList[j].audioList[k]
										.time <
										looperList[i].recorderList[j]
											.startingTime *
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
							looperList[i].recorderList[j].audio.seek(
								looperList[i].recorderList[j].startingTime
							);
						}
					}
					if (looperList[i].startingLoop) {
						looperList[i].startingLoop = false;
						ChangeMainButtonState(i, RECORDER_STATE.LOOPING);
						for (
							let j = 0;
							j < looperList[i].recorderList.length;
							j++
						) {
							console.log(looperList[i].recorderList[j].audio);
							if (!looperList[i].recorderList[j].instrument) {
								looperList[i].recorderList[j].audio.mute(false);
							}
						}
					}
				}
			}
		}
	}
	playingDur += minDuration;
	if (playingDur >= maxDuration) playingDur = 0;
}
function MainButtonLoopControl(x) {
	if (looperList[x].looping) {
		looperList[x].ending = true;
	} else {
		looperList[x].looping = true;
		if (!looperList[x].instrument) {
			looperList[x].startingLoop = true;
			for (let j = 0; j < looperList[x].recorderList.length; j++) {
				if (!looperList[x].recorderList[j].instrument) {
					looperList[x].recorderList[j].audio.mute(true);
					looperList[x].recorderList[j].audio.play();
				}
			}
		}
		if (!anyLooping) {
			LoopFunction();
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
	}
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
