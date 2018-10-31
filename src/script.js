window.onload = function(){

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    var recorder;
  
    var s = document.getElementById('s');
    var p = document.getElementById('p');
    var r = document.getElementById('r');
    var timer;
    var context = new AudioContext();
    var audioList = [];
  
    navigator.getUserMedia({audio: true}, function(stream) {
      var microphone = context.createMediaStreamSource(stream);
      var analyser = context.createAnalyser();
  
      s.onclick = function(){
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
      }
  
    }, function(){
      console.log('error');
    });
    };