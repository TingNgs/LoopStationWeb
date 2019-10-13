var page = 2;
var pageLoad = [false, false];
function FunctionBarOnClick(n) {
	if (n > 1 && recording) {
		showAlert("You can't change page while recording");
		return;
	}
	if (n == -1) {
		_toggleFullScreen();
		$('#full-screen-exit').addClass('hide');
		$('#full-screen-entry').removeClass('hide');
	} else if (n == -2) {
		_toggleFullScreen();
		$('#full-screen-entry').addClass('hide');
		$('#full-screen-exit').removeClass('hide');
	}
	$('.main-function').addClass('hide');
	$('#back-function').addClass('hide');
	$('#timing-function').addClass('hide');
	if (n == 1) {
		$('#timing-function').removeClass('hide');
		$('#back-function').removeClass('hide');
	} else {
		$('.main-function').removeClass('hide');
	}
	if (page == n) {
		return;
	} else if (page == 4) {
		document.removeEventListener('keydown', drumKeyDown);
	}
	if (n == 2) {
		SetController();
		page = n;
	}
	if (n == 3) {
		SetPiano();
		page = n;
	}
	if (n == 4) {
		SetDrum();
		page = n;
	}
	if (n == 5) {
		ShowDownloadPage();
	}
}

function GetInstrumentType() {
	if (page == 3) return 'Piano';
	else if (page === 4) return 'Drum';
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
	let PianoKeys = await document.getElementsByClassName('key');
	listLength = PianoAudioList.length;

	$('#piano_keyboard').scrollLeft(
		$('#piano_keyboard').prop('scrollWidth') / 3
	);
	$('#loading_spinner').addClass('hide');
}

async function SetDrum() {
	if (!pageLoad[1]) {
		$('#loading_spinner').removeClass('hide');
	}
	$('#main').addClass('instrument');
	await $('#instrument').empty();
	await $('#instrument').append('<div id="drum-machine"></div>');
	await $('#drum-machine').append('<div id="drum-pad"></div>');
	await RenderDrumSet();
	$('#loading_spinner').addClass('hide');
	document.addEventListener('keydown', drumKeyDown);
}
