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
  var loopstart = new Date().getTime();
  var state_text = document.getElementById("state_text")
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
            await sleep(3000 - (new Date().getTime() - loopstart))
            state_text.innerText = "Start record";
            LooperList[clickedButton].RecordAudio(microphone);
            await sleep(3000);
            await LooperList[clickedButton].StopReocrd();
            state_text.innerText = "Stop record";
          } else {
            LooperList[clickedButton].looping = !LooperList[clickedButton].looping;
            state_text.innerText = "loop state to";
            if (LooperList[clickedButton].looping) {
              state_text.innerText = "loop start";
              for (let j = 0; j < LooperList[clickedButton].recorderList.length; j++) {
                LooperList[clickedButton].recorderList[j].load()
                LooperList[clickedButton].recorderList[j].play()
                console.log(LooperList[clickedButton].recorderList[j])
              }
            } else {
              state_text.innerText = "loop stop";
            }
          }
        };
    },
    function () {
      console.log("error");
    }

  );
  var tempBeat = document.getElementById('path');
  tempBeat.setAttribute("class", "loop");
  setInterval(loopSideChange, 3000);

  function loopSideChange() {
    loopSide = !loopSide;
    loopstart = new Date().getTime()
    for (let i = 0; i < LooperList.length; i++) {
      if (LooperList[i].looping == true) {
        for (
          let j = 0; j < LooperList[i].recorderList.length; j++
        ) {
          LooperList[i].recorderList[j].currentTime = 0;
        }
      } else {
        for (
          let j = 0; j < LooperList[i].recorderList.length; j++
        ) {
          LooperList[i].recorderList[j].pause();
        }
      }
    }
  };
}


const sleep = time => new Promise(resolve => setTimeout(resolve, time));