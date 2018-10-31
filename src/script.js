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
            let tempVolume = 0
            if (LooperList[clickedButton].looping) {
              for (let j = 0; j < LooperList[clickedButton].recorderList.length; j++)
                LooperList[clickedButton].recorderList[j].play()
              tempVolume = 1;
            }

            state_text.innerText = "volume to " + tempVolume;
            await sleep(3000 - (new Date().getTime() - loopstart))
            for (let j = 0; j < LooperList[clickedButton].recorderList.length; j++)
              LooperList[clickedButton].recorderList[j].volume = tempVolume;
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
          console.log(LooperList[i].recorderList[j].volume)
        }
      }
    }
  }
};

const sleep = time => new Promise(resolve => setTimeout(resolve, time));