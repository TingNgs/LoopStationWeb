var page = 2;
var pageLoad = [false];
function FunctionBarOnClick(n) {
	$('#main-function').addClass('hide');
	$('#back-function').addClass('hide');
	$('#timing-function').addClass('hide');
	if (n == 0) {
	}
	if (n == 1) {
		$('#timing-function').removeClass('hide');
		$('#back-function').removeClass('hide');
	} else {
		$('#main-function').removeClass('hide');
	}
	if (n == 2) {
		SetController();
		page = n;
	}
	if (n == 3) {
		SetPiano();
		page = n;
	}
}

function InitController() {
	$.get('./recorder.html', function(html_string) {
		recorderHTML = html_string;
		for (let i = 0; i < 6; i++) {
			let tempRecorderHTML = recorderHTML.replace(/{{ index }}/g, i);
			$('#recorder_row').append(tempRecorderHTML);
			$.get('./main_button.html', function(html_string) {
				let mainButtonHTML = html_string;
				mainButtonHTML = mainButtonHTML.replace(/{{ index }}/g, i);
				$('#recorder_top' + i).append(mainButtonHTML);
			});
		}
	});
}

function SetController() {
	$('#main').removeClass('instrument');
	$('#instrument').empty();
}

async function SetPiano() {
	if (!pageLoad[0]) {
		$('#loading_spinner').removeClass('hide');
	}
	$('#main').addClass('instrument');
	await $('#instrument').empty();
	await $('#instrument').append('<div id="piano_container"></div>');
	await $('#piano_container').append('<div id="piano_keyboard"></div>');
	await RenderPianoKeySet();
	PianoAudioList = await document.getElementsByClassName('piaon_audio');
	PianoKeys = await document.getElementsByClassName('key');
	let listLength = PianoAudioList.length;

	for (let i = 0; i < PianoKeys.length; i++) {
		if (!pageLoad[0]) {
			PianoAudioList[i].onended = () => {
				PianoAudioList[i].muted = false;
				PianoAudioList[i].onended = null;
				listLength--;
				if (!listLength) {
					console.log('finish');
					$('#loading_spinner').addClass('hide');
					pageLoad[0] = true;
				}
			};
			PianoAudioList[i].muted = true;
			PianoAudioList[i].play();
		}
		PianoKeys[i].addEventListener('mousedown', (e, index) => {
			PianoAudioList[i].currentTime = 0;
			PianoAudioList[i].play();
			if (recording) {
				let time = new Date().getTime() - startListenTime;
				let audio = new Audio(PianoAudioList[i].src);
				looperList[inputRecorder].recorderList[
					listIndex
				].audioList.push({ time: time, audio: audio });
			}
		});
	}
}
