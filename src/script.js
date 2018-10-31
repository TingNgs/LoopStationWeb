window.onload = async function () {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  navigator.getUserMedia =
    navigator.getUserMedia || navigator.webkitGetUserMedia;
  window.URL = window.URL || window.webkitURL;
  var recorder;
  var recordButtonList = [];
  var LooperList = [];
  var loopSide = true;
  var p = document.getElementById("p");
  var loopstart;
  recordButtonList.push(document.getElementById("r1"));
  recordButtonList.push(document.getElementById("r2"));
  recordButtonList.push(document.getElementById("r3"));
  recordButtonList.push(document.getElementById("r4"));
  recordButtonList.push(document.getElementById("r5"));
  recordButtonList.push(document.getElementById("r6"));
  console.log(recordButtonList[5].id);
  for (var i = 0; i < 6; i++) LooperList.push(new Looper());
  var context = new AudioContext();
  var audioList = [];

  navigator.getUserMedia({
      audio: true
    },
    function (stream) {
      var microphone = context.createMediaStreamSource(stream);

      for (let i = 0; i < recordButtonList.length; i++)
        recordButtonList[i].onclick = async function () {
          let clickedButton;
          for (let j = 0; j < recordButtonList.length; j++)
            if (recordButtonList[j].id == this.id) clickedButton = j;
          if (!LooperList[clickedButton].recorded) {
            await sleep(3000-(new Date().getTime()-loopstart))
            LooperList[clickedButton].RecordAudio(stream);
            await sleep(3000);
            LooperList[clickedButton].StopReocrd();
          } else {
            LooperList[clickedButton].looping = !LooperList[clickedButton].looping;
            await sleep(3000-(new Date().getTime()-loopstart))
            for (let j = 0; j < LooperList[i].recorderList.length; j++)
              LooperList[clickedButton].recorderList[j].play();
          }
        };
    },
    function () {
      console.log("error");
    }

  );
  var tempBeat = document.getElementById('path');
  tempBeat.setAttribute("class", "loop");
  setInterval(loopSideChange,3000);
function loopSideChange(){
  loopSide = !loopSide;
  loopstart = new Date().getTime()
  for(let i=0;i<LooperList.length;i++)
  {
    if(LooperList[i].looping == true){
      for (
        let j = 0; j < LooperList[i].recorderList.length; j++
      ) {
        LooperList[i].recorderList[j].currentTime = 0;
        console.log("play");
      }
    }
  }
}
};

const sleep = time => new Promise(resolve => setTimeout(resolve, time));