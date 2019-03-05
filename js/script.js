$(function() {
    $("#main").load("record_control.html");
    rec = Recorder({ bitRate: 320, sampleRate: 48000 });
    rec.open(
      function() {
        //Open the mic and grant for recorder
      },
      function(msg) {}
    );
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

function StartLooping(){
    loopFunction = setInterval(LoopFunction,maxDuration)
    LoopFunction()
}

function CheckEndLoop(){
    var endLoop = true;
    looperList.forEach(element => {
        if(element.looping) endLoop = false;
    });
    if(endLoop) {
        clearInterval(loopFunction);
        anyLooping = false;
        console.log("Stop Loop");
    }
}

function LoopFunction(){
    console.log(new Date().getTime() - loopStartTime);
    loopStartTime = new Date().getTime();
    console.log("Loop starting time : " + loopStartTime);
    looperList.forEach(element => {
        if(element.looping == true){
            element.recorderList.forEach(element=>{
                element.currentTime = 0;
                element.play();
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
        console.log("Recorder " +x+ " stop looping");
        looperList[x].recorderList.forEach(element => {
            element.pause();
        });
        CheckEndLoop();
    } else {
        console.log("Recorder " +x+ " start looping");

        if(anyLooping){
            var timeouttTime = maxDuration - (new Date().getTime() - loopStartTime);
            console.log("Recorder " +x+ " start at "+timeouttTime);
            setTimeout(looperList[x].looping = true,timeouttTime);
        }
        else{
            looperList[x].looping = true;
            StartLooping();
            anyLooping = true;
        }
    }
  } else {
    //Not recorded, ready to record
    console.log(x);
    if(recording){
        rec.stop(
            function(blob, duration) {
              var audio = document.createElement("AUDIO");
              audio.src = URL.createObjectURL(blob);
              looperList[x].recorderList.push(audio);
              looperList[x].recorded = true;
              console.log("New audio duration : " + duration);
              var newDuration = false;
              if(duration > maxDuration) {
                  maxDuration = duration;
                  newDuration = true;
              }
              if(anyLooping){
                  var timeouttTime = 0;
                if(!newDuration)
                    timeouttTime = maxDuration - (new Date().getTime() - loopStartTime);
                setTimeout(StartLooping,timeouttTime);
              }
            },
            function(msg) {
              console.log("Fail:" + msg);
            }
        );
    }
    else{
        var timeouttTime = 1500;
        if(anyLooping){
            timeouttTime = maxDuration - (new Date().getTime() - loopStartTime);
            clearInterval(loopFunction);
        }
        console.log("Record start at : " + timeouttTime);
        setTimeout(function(){
            rec.start(); //start recorded
            if(anyLooping)LoopFunction();
        },timeouttTime);
    }
    recording = !recording;
  }
}

function OnClickReset(x) {
  //Reset button for recorder
  looperList[x].Reset();
  CheckEndLoop();
}
