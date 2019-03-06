$(function () {
    $("#main").load("record_control.html");
    rec = Recorder({
        bitRate: 320,
        sampleRate: 48000
    });
    rec.open();
});

var rec;
var anyLooping = false;
var recording = false;
var recordingX = 0;
var loopStartTime;
var maxDuration = 0;
var loopFunction; // For setInterval and clear interval
var looperList = [];
for (var i = 0; i < 6; i++) looperList.push(new Looper());

function StartLooping() {
    loopFunction = setInterval(LoopFunction, maxDuration)
    LoopFunction()
}

function CheckEndLoop() {
    var endLoop = true;
    looperList.forEach(element => {
        if (element.looping) endLoop = false;
    });
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
    looperList.forEach(element => {
        if (element.looping == true) {
            element.recorderList.forEach(element => {
                element.currentTime = 0;
                element.play();
                console.log(element);
            });
        }
    });
}

function OnClickRrecorder(x) {
    //Main control button
    if (looperList[x].recorded) {
        //Recorded, play or stop loop
        if (looperList[x].looping) {
            looperList[x].looping = false;
            console.log("Recorder " + x + " stop looping");
            ChangeMainButtonState(x, 3);
            looperList[x].recorderList.forEach(element => {
                element.pause();
            });
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
    } else {
        //Not recorded, ready to record
        console.log(x);
        if (recording) {
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
                    ChangeMainButtonState(x, 3);
                },
                function (msg) {
                    console.log("Fail:" + msg);
                }
            );
        } else {
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
        recording = !recording;
    }
}

function OnClickIosOnLoad() {
    for (var i = 0; i < 6; i++) {
        ChangeMainButtonState(i, 1);
    }
    looperList.forEach(element => {
        if (element.recorded) {
            element.recorderList.forEach(element => {
                element.muted = true;
                element.play();
                setTimeout(
                    function () {
                        element.muted = false;
                    }, maxDuration + 2000);
            });
        }
    });
    setTimeout(
        function () {
            for (var i = 0; i < 6; i++) {
                if(looperList[i].recorded)ChangeMainButtonState(i, 3);
                else ChangeMainButtonState(i,0);
            }
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