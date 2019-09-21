async function OnClickSetting(x) {
	$('#recorder_setting').removeClass('hide');
	$('#recorder' + x).addClass('setting');
	settingRecorder = x;
	$('#setting_record_container').empty();
	let widthValue = (looperList[x].dur / (looperList[x].dur + 2000)) * 100;
	wavefromStyle.innerHTML =
		'.slider::-webkit-slider-thumb { width: ' +
		widthValue +
		'%; } .display_area{width:' +
		widthValue +
		'%;}';
	looperList[x].recorderList.forEach(async (element, index) => {
		console.log(element);
		if (element.instrument) {
			await $('#setting_record_container').append(
				"<div id='recordedAudio" + index + "' class='record_waveform'/>"
			);
			loadInstrumentSetting(index, element);
		} else {
			await $('#setting_record_container').append(
				"<div id='recordedAudio" + index + "' class='record_waveform'/>"
			);
			loadRecorderSetting(index, element);
		}
	});
}

function loadInstrumentSetting(index, element) {
	renderWaveContainer(index, element);
	element.audioList.forEach(audio => {
		let left =
			(audio.time / (looperList[settingRecorder].dur + 2000)) * 100;
		$('#wave_container' + index).append(
			'<div class="setting_instrument_box" style="left: ' +
				left +
				'%;" />'
		);
		audio.time;
	});
}

function loadRecorderSetting(index, element) {
	renderWaveContainer(index, element);
	let wavesurfer = WaveSurfer.create({
		container: '#wave_container' + index,
		barWidth: 2,
		barHeight: 4,
		barGap: null,
		waveColor: '#FFF'
	});
	wavesurfer.load(element.audio._src);
}

function renderWaveContainer(index, element) {
	$('#recordedAudio' + index).append(
		'<input type="range" min="0" max="200" value="' +
			element.startingTime * 100 +
			'" class="slider" oninput="startingTimeOnChange(this,' +
			index +
			')"><div class="display_area"/><div id="wave_container' +
			index +
			'" class="wave_container">'
	);
	startingTimeOnChange({ value: 200 - element.startingTime * 100 }, index);
}

function startingTimeOnChange(e, x) {
	looperList[settingRecorder].recorderList[x].startingTime =
		2 - e.value / 100;
	let newLeft =
		(((e.value - 100) * 10) / (looperList[settingRecorder].dur + 2000)) *
		100;
	$('#wave_container' + x).css('left', newLeft + '%');
	//console.log(looperList[settingRecorder].recorderList[x].startingTime);
}

function OnClickSettingCross() {
	$('#recorder_setting').addClass('hide');
	$('#recorder' + settingRecorder).removeClass('setting');
}

function OnClickReset(x = settingRecorder) {
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
