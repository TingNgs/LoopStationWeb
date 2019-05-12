$(function() {
	SetController();
	rec = Recorder({
		bitRate: 320,
		sampleRate: 48000
	});
	rec.open();
});

function SetController() {
	$('#main').load('record_control.html', function() {
		$.get('./recorder.html', function(html_string) {
			recorderHTML = html_string;
			for (let i = 0; i < 6; i++) {
				let tempRecorderHTML = recorderHTML.replace(/{{ index }}/g, i);
				$('#recorder_row').append(tempRecorderHTML);
				$.get('./main_button.html', function(html_string) {
					let mainButtonHTML = html_string;
					mainButtonHTML = mainButtonHTML.replace(/{{ index }}/g, i);
					$('#recorder_top' + i).append(mainButtonHTML);
					/*var className = '#background_circle' + i;
					var sektor = new Sektor(className, {
						size: 240,
						stroke: 10,
						arc: true,
						angle: 0,
						sectorColor: '#bD2828',
						circleColor: '#3d3d3d',
						fillCircle: false
					});
					svgBackgroundCircleList.push(sektor);*/
				});
			}
		});
	});
}

var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var rec;
var anyLooping = false;
var recording = false;
var loopStartTime;
var maxDuration = 0;
var loopFunction; // For setInterval and clear interval
var looperList = [];
var svgBackgroundCircleList = [];
for (var i = 0; i < 6; i++) {
	looperList.push(new Looper());
}

console.log(iOS);

function StartLooping() {
	loopFunction = setInterval(LoopFunction, maxDuration);
	LoopFunction();
}

function CheckEndLoop() {
	var endLoop = true;
	for (let i = 0; i < looperList.length; i++) {
		if (looperList[i].looping) endLoop = false;
	}
	if (endLoop) {
		clearInterval(loopFunction);
		anyLooping = false;
	}
}

function LoopFunction() {
	loopStartTime = new Date().getTime();
	for (let i = 0; i < looperList.length; i++) {
		if (looperList[i].looping) {
			for (let j = 0; j < looperList[i].recorderList.length; j++) {
				looperList[i].recorderList[j].currentTime = 0;
				looperList[i].recorderList[j].play();
				//console.log(looperList[i].recorderList[j]);
			}
			svgBackgroundCircleList[i].changeAngle(0);
			svgBackgroundCircleList[i].animateTo(360, maxDuration);
		}
	}
}

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
			MainButtonStopRecord(x);
		} else {
			MainButtonStartRecord(x);
		}
		recording = !recording;
	}
}

function MainButtonLoopControl(x) {
	if (looperList[x].looping) {
		looperList[x].looping = false;
		ChangeMainButtonState(x, 3);
		/*for (let i = 0; i < looperList[x].recorderList.length; i++)
            looperList[x].recorderList[i].pause();*/
		CheckEndLoop();
	} else {
		ChangeMainButtonState(x, 1);
		var timeouttTime = 0;
		looperList[x].looping = true;
		if (anyLooping)
			timeouttTime = maxDuration - (new Date().getTime() - loopStartTime);
		else StartLooping();
		anyLooping = true;
		setTimeout(function() {
			ChangeMainButtonState(x, 4);
		}, timeouttTime);
	}
}

function MainButtonStartRecord(x) {
	var timeouttTime = 1500;
	rec.open();
	ChangeMainButtonState(x, 1);
	if (anyLooping) {
		timeouttTime = maxDuration - (new Date().getTime() - loopStartTime);
		clearInterval(loopFunction);
	}
	setTimeout(function() {
		rec.start(); //start recorded
		ChangeMainButtonState(x, 2);
		if (anyLooping) LoopFunction();
	}, timeouttTime);
}

function MainButtonStopRecord(x) {
	ChangeMainButtonState(x, 1);
	rec.stop(
		function(blob, duration) {
			var audio = document.createElement('AUDIO');
			audio.src = URL.createObjectURL(blob);
			looperList[x].recorderList.push(audio);
			looperList[x].recorded = true;
			looperList[x].looping = true;
			var newDuration = false;
			if (duration > maxDuration) {
				maxDuration = duration;
				newDuration = true;
			}
			ChangeMainButtonState(x, 1);
			var timeouttTime = 0;
			if (!newDuration)
				timeouttTime =
					maxDuration - (new Date().getTime() - loopStartTime);
			setTimeout(function() {
				anyLooping = true;
				console.log(looperList[x].recorderList);
				ChangeMainButtonState(x, 4);
				StartLooping();
			}, timeouttTime);

			//if (iOS) IosOnLoad(x);
			//else
		},
		function(msg) {
			console.log('Fail:' + msg);
		}
	);
}

function OnClickIosOnLoad() {
	for (let i = 0; i < 6; i++) {
		ChangeMainButtonState(i, 1);
		if (looperList[i].recorded) {
			for (let j = 0; j < looperList[i].recorderList.length; j++) {
				looperList[i].recorderList[j].muted = true;
				looperList[i].recorderList[j].play();
				setTimeout(function() {
					looperList[i].recorderList[j].muted = false;
				}, maxDuration + 2000);
			}
		}
		setTimeout(function() {
			if (looperList[i].recorded) ChangeMainButtonState(i, 3);
			else ChangeMainButtonState(i, 0);
		}, maxDuration + 2000);
	}
}

function IosOnLoad(i) {
	ChangeMainButtonState(i, 1);
	for (let j = 0; j < looperList[i].recorderList.length; j++) {
		looperList[i].recorderList[j].muted = true;
		looperList[i].recorderList[j].play();
		setTimeout(function() {
			looperList[i].recorderList[j].muted = false;
		}, maxDuration + 2000);
	}
	setTimeout(function() {
		ChangeMainButtonState(i, 3);
	}, maxDuration + 2000);
}

function OnClickReset(x) {
	//Reset button for recorder
	looperList[x].Reset();
	ChangeMainButtonState(x, 0);
	CheckEndLoop();
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
