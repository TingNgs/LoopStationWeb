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
			$('#bg_circle_animate' + i)[0].setAttribute(
				'dur',
				looperList[i].dur / 1000 + 's'
			);
			$('#bg_circle_animate' + i)[0].beginElementAt(0);
			if (looperList[i].looping) {
				if (looperList[i].ending) {
					if (!looperList[i].instrument) {
						for (
							let j = 0;
							j < looperList[i].recorderList.length;
							j++
						) {
							console.log(j);
							looperList[i].recorderList[j].muted = true;
							looperList[i].recorderList[j].audio.pause();
						}
					}
					looperList[i].looping = false;
					looperList[i].ending = false;
					ChangeMainButtonState(i, RECORDER_STATE.RECORDED);
					CheckEndLoop();
				} else {
					if (looperList[i].instrument) {
						for (
							let j = 0;
							j < looperList[i].recorderList.length;
							j++
						) {
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
										].audio.currentTime = 0;
										looperList[i].recorderList[j].audioList[
											k
										].audio.play();
									}, looperList[i].recorderList[j].audioList[k].time - looperList[i].recorderList[j].startingTime * 1000);
								}
							}
						}
					} else {
						console.log(i, looperList[i].recorderList.length);
						for (
							let j = 0;
							j < looperList[i].recorderList.length;
							j++
						) {
							looperList[i].recorderList[j].audio.currentTime =
								looperList[i].recorderList[j].startingTime;
						}
						if (looperList[i].startingLoop) {
							looperList[i].startingLoop = false;
							ChangeMainButtonState(i, RECORDER_STATE.LOOPING);
							for (
								let j = 0;
								j < looperList[i].recorderList.length;
								j++
							) {
								looperList[i].recorderList[
									j
								].audio.muted = false;
							}
						}
					}
				}
			}
		}
	}
	playingDur += minDuration;
	if (playingDur >= maxDuration) playingDur = 0;
	console.log(playingDur);
}
function MainButtonLoopControl(x) {
	if (looperList[x].looping) {
		looperList[x].ending = true;
	} else {
		looperList[x].looping = true;
		if (!looperList[x].instrument) {
			looperList[x].startingLoop = true;
			for (let j = 0; j < looperList[x].recorderList.length; j++) {
				looperList[x].recorderList[j].audio.muted = true;
				looperList[x].recorderList[j].audio.play();
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
		if (tempAudio2.muted) timeout = tempMax - tempAudio.currentTime * 1000;
		else timeout = tempMax / 2 - tempAudio2.currentTime * 1000;
	} else {
		timeout =
			tempMax -
			(looperList[maxIndex].recorderList[0].audio.currentTime -
				looperList[maxIndex].recorderList[0].startingTime) *
				1000;
	}
	while (timeout - playDur > 0) {
		timeout -= playDur;
	}
	return timeout;
}
