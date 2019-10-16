$(function() {
	$('#function_bar').load('function_bar.html', function() {
		timingText = document.getElementById('textid');
		timingText.textContent = Math.round(RecordingTime / 100) / 10;

		timingText.setAttribute('x', (timingText.textContent.length - 1) * 3);
	});
	$('#tips').load('tips.html');
	InitController();
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		audioContext = new AudioContext();
		input = audioContext.createMediaStreamSource(stream);
		rec = [
			new Recorder(input, { numChannels: 2 }),
			new Recorder(input, { numChannels: 2 })
		];
		tempRec = new Recorder(input, { numChannels: 2 });
		tempRec2 = new Recorder(input, { numChannels: 2 });
	});
});
const _toggleFullScreen = function _toggleFullScreen() {
	if (
		document.fullscreenElement ||
		document.mozFullScreenElement ||
		document.webkitFullscreenElement
	) {
		if (document.cancelFullScreen) {
			document.cancelFullScreen();
		} else {
			if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else {
				if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				}
			}
		}
	} else {
		const _element = document.documentElement;
		if (_element.requestFullscreen) {
			_element.requestFullscreen();
		} else {
			if (_element.mozRequestFullScreen) {
				_element.mozRequestFullScreen();
			} else {
				if (_element.webkitRequestFullscreen) {
					_element.webkitRequestFullscreen(
						Element.ALLOW_KEYBOARD_INPUT
					);
				}
			}
		}
	}
	const element = document.getElementById('fullScreenButton');
	if (element !== null) {
		if (userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
			element.className += ' hidden';
		} else if (userAgent.match(/iPad/i) && iOS().majorReleaseNumber < 12) {
			element.className += ' hidden';
		} else if (userAgent.match(/iPad/i) && !iPadSafari) {
			element.className += ' hidden';
		} else {
			element.addEventListener('click', _toggleFullScreen, false);
		}
	}
};
const userAgent = window.navigator.userAgent;

const iPadSafari =
	!!userAgent.match(/iPad/i) && // Detect iPad first.
	!!userAgent.match(/WebKit/i) && // Filter browsers with webkit engine only
	!userAgent.match(/CriOS/i) && // Eliminate Chrome & Brave
	!userAgent.match(/OPiOS/i) && // Rule out Opera
	!userAgent.match(/FxiOS/i) && // Rule out Firefox
	!userAgent.match(/FocusiOS/i); // Eliminate Firefox Focus as well!

function is_touch_device() {
	return 'ontouchstart' in window;
}

const isTouchDevice = is_touch_device();
function iOS() {
	if (userAgent.match(/ipad|iphone|ipod/i)) {
		const iOS = {};
		iOS.majorReleaseNumber = +userAgent
			.match(/OS (\d)?\d_\d(_\d)?/i)[0]
			.split('_')[0]
			.replace('OS ', '');
		return iOS;
	}
}

var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var constraints = { audio: true, video: false };
var rec;
var useRecorder = 1;
var tempRec, tempRec2;
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //audio context to help us record

var anyLooping = false;
var recording = false;
var loopStartTime;
var minDuration = 999999;
var maxDuration = 0;
var playingDur = 0;
var tempAudioDur = 0;
var RecordingTime = 3000;

var tempAudio;
var tempAudio2;
var recordingAudio;
var startListenTime;
var listIndex;
var loopFunction; // For setInterval and clear interval
var inputRecorder;
var looperList = [];
var dragIndex;
var settingRecorder;
var dragAudio = false;

var wavefromStyle = document.querySelector('[data="waveform_data"]');
var timingText;
var listLength = 0;

var RECORDER_STATE = {
	EMPTY: 0,
	WAITING: 1,
	RECORDING: 2,
	RECORDED: 3,
	LOOPING: 4
};

for (var i = 0; i < 6; i++) {
	looperList.push(new Looper());
}

function ChangeMainButtonState(x, n) {
	let id = 'recorder' + x;
	document.getElementById(id).classList.remove('empty');
	document.getElementById(id).classList.remove('waiting');
	document.getElementById(id).classList.remove('recording');
	document.getElementById(id).classList.remove('recorded');
	document.getElementById(id).classList.remove('looping');
	if (n == 0) document.getElementById(id).classList.add('empty');
	if (n == 1) document.getElementById(id).classList.add('waiting');
	if (n == 2) document.getElementById(id).classList.add('recording');
	if (n == 3) document.getElementById(id).classList.add('recorded');
	if (n == 4) document.getElementById(id).classList.add('looping');
}

function setAnimation(x, time) {
	$('#background_circle_content' + x + '.content_box').css('animation', '');
	let element = document.getElementById('background_circle_content' + x);
	element.classList.remove('content_box');
	void element.offsetWidth;
	element.classList.add('content_box');
	$('#background_circle_content' + x + '.content_box').css(
		'animation',
		'rotateS ' + time + 's linear infinite'
	);
}
function stopAnimation(x) {
	$('#background_circle_content' + x).css('animation', '');
}

function hideAlert() {
	$('#alert').addClass('hide');
}

function showAlert(alertMessage) {
	$('#alert').html(alertMessage);
	$('#alert').removeClass('hide');
	setTimeout(hideAlert, 3000);
}

function OnClickToggleTips() {
	$('#tips').toggleClass('hide');
}
