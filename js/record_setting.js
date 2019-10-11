const COPY_ICON = './svg/copy.svg';
const DELETE_ICON = './svg/delete.svg';
const DOWNLOAD_ICON = './svg/download.svg';
const MUTE_ICON = './svg/mute.svg';
const MUTED_ICON = './svg/MUTED.svg';
const DRUM_ICON = './svg/drum.svg';

async function OnClickSetting(x) {
	$('#recorder_setting').removeClass('hide');
	$('#recorder' + x).addClass('setting');
	settingRecorder = x;
	loadSettingPage(x);
}

function loadSettingPage(x) {
	$('#setting_record_container').empty();
	let widthValue = (looperList[x].dur / (looperList[x].dur + 2000)) * 100;
	wavefromStyle.innerHTML =
		'.slider::-webkit-slider-thumb { width: ' +
		widthValue +
		'%; } .display_area{width:' +
		widthValue +
		'%;}';
	looperList[x].recorderList.forEach(loadSettingAudio);
}

async function loadSettingAudio(element, index) {
	if (element.instrument) {
		await $('#setting_record_container').append(
			"<div id='setting_audio_container" +
				index +
				"' class='setting_audio_container'><div id='recordedAudio" +
				index +
				"' class='record_waveform'/></div>"
		);
		loadInstrumentSetting(index, element);
	} else {
		await $('#setting_record_container').append(
			"<div id='setting_audio_container" +
				index +
				"' class='setting_audio_container'><div id='recordedAudio" +
				index +
				"' class='record_waveform'/></div>"
		);
		loadRecorderSetting(index, element);
	}

	let settingButton =
		`<div class="setting_control_button" onclick="CopyRecording(${settingRecorder},${index})"><img src="${COPY_ICON}"/></div>` +
		`<div class="setting_control_button" onclick="DeleteRecording(${settingRecorder},${index})"><img src="${DELETE_ICON}"/></div>` +
		`<div class="setting_control_button" onclick="DownloadRecording(${settingRecorder},${index})"><img src="${DOWNLOAD_ICON}"/></div>` +
		`<div id='setting_mute_icon${index}' class="setting_control_button" onclick="MuteRecording(${settingRecorder},${index})"><img src="${
			looperList[settingRecorder].recorderList[index].muted
				? MUTED_ICON
				: MUTE_ICON
		}"/></div>`;
	$('#setting_audio_container' + index).append(
		`<div class="setting_control_button_container">${settingButton}</div>`
	);
}

function loadInstrumentSetting(index, element) {
	renderWaveContainer(index, element);
	if (element.instrument == 'Piano') {
		$('#recordedAudio' + index).append(
			'<div id="notation_lines_container' + index + '"></div>'
		);
		for (i = 0; i < 10; i++) {
			let add = i > 4 ? 8 : 0;
			$('#notation_lines_container' + index).append(
				'<div class="notation_line" style="top:' +
					(24 + i * 8 + add) +
					'px;"></div>'
			);
		}
		element.audioList.forEach(audio => {
			let addSign =
				display_keys[audio.index].type == 'black'
					? "<div class='setting_piano_key_black'>#</div>"
					: '';

			let left =
				(audio.time / (looperList[settingRecorder].dur + 2000)) * 100;
			let keyBar =
				display_keys[audio.index].num < 40
					? '<div class="setting_piano_key_left"/>'
					: '<div class="setting_piano_key_right"/>';
			let levelBar = '';
			switch (display_keys[audio.index].num) {
				case 40:
				case 41:
				case 61:
				case 62:
				case 20:
					levelBar = '<div class="setting_piano_key_center"/>';
					break;
				case 63:
					levelBar = '<div class="setting_piano_key_bottom"/>';
					break;
				case 16:
				case 17:
					levelBar =
						'<div class="setting_piano_key_top-5px"/><div class="setting_piano_key_center"/>';
					break;
				case 18:
				case 19:
					levelBar = '<div class="setting_piano_key_top"/>';
					break;
			}
			$('#wave_container' + index).append(
				'<div class="setting_piano_key" style="left: ' +
					left +
					'%; top:' +
					display_keys[audio.index].top +
					'px;" >' +
					addSign +
					keyBar +
					levelBar +
					'</div>'
			);
		});
	} else {
		element.audioList.forEach(audio => {
			let left =
				(audio.time / (looperList[settingRecorder].dur + 2000)) * 100;
			$('#wave_container' + index).append(
				`<div class="setting_instrument_box" style="left:${left}%;"> <img src="${DRUM_ICON}"/> </div>`
			);
		});
	}
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
		`<input type="range" min="${-looperList[settingRecorder].dur /
			10}" max="${looperList[settingRecorder].dur / 10 +
			200}" value="${element.startingTime *
			100}" class="slider" oninput="startingTimeOnChange(this,${index})"><div class="display_area"/><div id="wave_container${index}" class="wave_container">`
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
}

function OnClickSettingCross() {
	$('#recorder_setting').addClass('hide');
	$('#recorder' + settingRecorder).removeClass('setting');
}

function CopyRecording(x, index) {
	let tempRecording = { ...looperList[x].recorderList[index] };
	if (tempRecording.instrument) {
	} else {
		let src = tempRecording.audio._src;
		tempRecording.audio = new Howl({
			src: [src],
			format: ['wav'],
			autoplay: true,
			mute: true,
			loop: true
		});
		tempRecording.audio.on('end', () => {
			tempRecording.audio.mute(true);
		});
	}
	let newIndex = looperList[x].recorderList.push(tempRecording) - 1;
	if (looperList[x].looping) {
		looperList[x].startingLoop = true;
	}
	loadSettingAudio(looperList[x].recorderList[newIndex], newIndex);
}

function DeleteRecording(x, index) {
	if (!looperList[x].recorderList[index].instrument) {
		looperList[x].recorderList[index].audio.stop();
	}
	looperList[x].recorderList.splice(index, 1);
	if (looperList[x].recorderList.length === 0) {
		OnClickReset(x);
	}
	loadSettingPage(x);
}

function MuteRecording(x, index) {
	looperList[x].recorderList[index].muted = !looperList[x].recorderList[index]
		.muted;
	$(`#setting_mute_icon${index}`).empty();
	$(`#setting_mute_icon${index}`).append(
		`<img src="${
			looperList[x].recorderList[index].muted ? MUTED_ICON : MUTE_ICON
		}"/>`
	);
	if (looperList[x].recorderList[index].instrument) {
		for (
			let i = 0;
			i < looperList[x].recorderList[index].audioList.length;
			i++
		) {
			looperList[x].recorderList[index].audioList[i].audio.mute(
				looperList[x].recorderList[index].muted
			);
		}
	} else {
		if (
			looperList[x].recorderList[index].muted ||
			looperList[x].recorderList[index].startingTime >= 0
		) {
			looperList[x].recorderList[index].audio.mute(
				looperList[x].recorderList[index].muted
			);
		}
	}
}

function DownloadRecording(x, index) {
	if (!looperList[x].recorderList[index].instrument) {
		var a = document.createElement('a');
		var url = looperList[x].recorderList[index].audio._src;
		var filename = 'myfile.wav';
		a.href = url;
		a.download = filename;
		a.click();
	}
}

function SettingOnClickReset() {
	$('#setting_record_container').empty();
	OnClickReset(settingRecorder);
}

function OnClickReset(x) {
	//Reset button for recorder
	for (let j = 0; j < looperList[x].recorderList.length; j++) {
		if (!looperList[x].recorderList[j].instrument) {
			looperList[x].recorderList[j].audio.pause();
		}
	}
	stopAnimation(x);
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
	if (n === dragLooper) return;
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
			stopAnimation(dragLooper);
		} else {
			showAlert('You can only merge two looper with same duration');
		}
	} else {
		looperList[n].recorded = looperList[dragLooper].recorded;
		looperList[n].startingLoop = looperList[dragLooper].startingLoop;
		looperList[n].looping = looperList[dragLooper].looping;
		looperList[n].recorderList = [...looperList[dragLooper].recorderList];
		looperList[n].timeZone = looperList[dragLooper].timeZone;
		looperList[n].dur = looperList[dragLooper].dur;
		looperList[n].tempPlaying = looperList[dragLooper].tempPlaying;
		looperList[n].ending = looperList[dragLooper].ending;

		let state = looperList[n].looping
			? RECORDER_STATE.LOOPING
			: looperList[n].recorded
			? RECORDER_STATE.RECORDED
			: RECORDER_STATE.EMPTY;

		looperList[dragLooper].Reset();

		ChangeMainButtonState(dragLooper, RECORDER_STATE.EMPTY);
		ChangeMainButtonState(n, state);
		stopAnimation(dragLooper);
		// ChangeMainButtonState(n, RECORDER_STATE.RECORDED);
	}
}
function allowDrop(ev) {
	ev.preventDefault();
}
