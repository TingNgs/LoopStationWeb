window.onload = function() {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  navigator.getUserMedia =
    navigator.getUserMedia || navigator.webkitGetUserMedia;
  window.URL = window.URL || window.webkitURL;
  var recorder;
  var recordButtonList = [];
  var LooperList = [];
  var p = document.getElementById("p");
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

  navigator.getUserMedia(
    {
      audio: true
    },
    function(stream) {
      var microphone = context.createMediaStreamSource(stream);

      for (let i = 0; i < recordButtonList.length; i++)
        recordButtonList[i].onclick = async function() {
          let clickedButton;
          for (let j = 0; j < recordButtonList.length; j++)
            if (recordButtonList[j].id == this.id) clickedButton = j;
          if (!LooperList[clickedButton].recorded) {
            LooperList[clickedButton].RecordAudio(stream);
            await sleep(3000);
            await LooperList[clickedButton].StopReocrd();
          } else {
            for (
              let j = 0;
              j < LooperList[clickedButton].recorderList.length;
              j++
            ) {
              LooperList[clickedButton].recorderList[j].loop = true;
              LooperList[clickedButton].recorderList[j].play();
              console.log("play");
            }
          }
        };
      /*s.onclick = function(){
        var defual_audio = document.createElement("AUDIO");
        defual_audio.controls = true;  
        recorder.stop();
        recorder.exportWAV(function(blob) {
          defual_audio.src = URL.createObjectURL(blob);
        });
        defual_audio.play();
        audioList.push(defual_audio);
        recorder.clear();
      };
  
      p.onclick = function(){
        recorder = new Recorder(microphone);
        recorder.record();
      };
      r.onclick = function(){
        for(i=0;i<audioList.length;i++)
          audioList[i].play();
      }
      function createDownloadLink(){
      }*/
    },
    function() {
      console.log("error");
    }
  );
};
const sleep = time => new Promise(resolve => setTimeout(resolve, time));