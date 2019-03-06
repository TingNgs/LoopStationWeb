$(function () {
    $("#main").load("record_control.html");
    rec = Recorder({
        bitRate: 320,
        sampleRate: 48000
    });
    rec.open();
    setTimeout(() => {
        for (let i = 0; i < 6; i++) {

            var className = "#background_circle" + i;
            var sektor = new Sektor(className, {
                size: 240,
                stroke: 60,
                arc: true,
                angle: 0,
                sectorColor: '#bD2828',
                circleColor: '#DDD',
                fillCircle: false
            });
            svgBackgroundCircleList.push(sektor);
        }
    }, 2000);



});

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
    loopFunction = setInterval(LoopFunction, maxDuration)
    LoopFunction()
}

function CheckEndLoop() {
    var endLoop = true;
    for (let i = 0; i < looperList.length; i++) {
        if (looperList[i].looping) endLoop = false;
    }
    if (endLoop) {
        clearInterval(loopFunction);
        anyLooping = false;
        console.log("Stop Loop");
    }
}

function LoopFunction() {
    console.log(new Date().getTime() - loopStartTime);
    loopStartTime = new Date().getTime();
    console.log("Loop starting time : " + loopStartTime);
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
    let id = "recorder" + x; // flood proofing
    if (document.getElementById(id).classList.contains("waiting")) return;
    if (looperList[x].recorded) {
        //Recorded, play or stop loop
        MainButtonLoopControl(x);
    } else {
        //Not recorded, ready to record
        console.log(x);
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
        console.log("Recorder " + x + " stop looping");
        ChangeMainButtonState(x, 3);
        /*for (let i = 0; i < looperList[x].recorderList.length; i++)
            looperList[x].recorderList[i].pause();*/
        CheckEndLoop();
    } else {
        ChangeMainButtonState(x, 1);
        var timeouttTime = 0;
        looperList[x].looping = true;
        if (anyLooping) timeouttTime = maxDuration - (new Date().getTime() - loopStartTime);
        else StartLooping()
        anyLooping = true;
        console.log("Recorder " + x + " start at " + timeouttTime);
        setTimeout(function () {
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
    console.log("Record start at : " + timeouttTime);
    setTimeout(function () {
        rec.start(); //start recorded
        ChangeMainButtonState(x, 2);
        if (anyLooping) LoopFunction();
    }, timeouttTime);
}

function MainButtonStopRecord(x) {
    ChangeMainButtonState(x, 1);
    rec.stop(
        function (blob, duration) {
            var audio = document.createElement("AUDIO");
            audio.src = URL.createObjectURL(blob);
            looperList[x].recorderList.push(audio);
            looperList[x].recorded = true;
            console.log("New audio duration : " + duration);
            var newDuration = false;
            if (duration > maxDuration) {
                maxDuration = duration;
                newDuration = true;
            }
            if (anyLooping) {
                var timeouttTime = 0;
                if (!newDuration)
                    timeouttTime = maxDuration - (new Date().getTime() - loopStartTime);
                setTimeout(StartLooping, timeouttTime);
            }
            if (iOS) IosOnLoad(x);
            else ChangeMainButtonState(x, 3);

        },
        function (msg) {
            console.log("Fail:" + msg);
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
                setTimeout(
                    function () {
                        looperList[i].recorderList[j].muted = false;
                    }, maxDuration + 2000);
            }
        }
        setTimeout(
            function () {
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
        setTimeout(
            function () {
                looperList[i].recorderList[j].muted = false;
            }, maxDuration + 2000);
    }
    setTimeout(
        function () {
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
    let id = "recorder" + x;
    console.log(id);
    document.getElementById(id).classList.remove("empty");
    document.getElementById(id).classList.remove("waiting");
    document.getElementById(id).classList.remove("recording");
    document.getElementById(id).classList.remove("recorded");
    document.getElementById(id).classList.remove("looping");
    if (n == 0) document.getElementById(id).classList.add("empty");
    if (n == 1) document.getElementById(id).classList.add("waiting");
    if (n == 2) document.getElementById(id).classList.add("recording");
    if (n == 3) document.getElementById(id).classList.add("recorded");
    if (n == 4) document.getElementById(id).classList.add("looping");
}