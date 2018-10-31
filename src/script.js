window.onload = function(){

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    var recorder;
  
    var s = document.getElementById('s');
    var p = document.getElementById('p');
    var r = document.getElementById('r');
    var defual_audio = new Audio();
    var timer;
    var context = new AudioContext();
  
    navigator.getUserMedia({audio: true}, function(stream) {
      var microphone = context.createMediaStreamSource(stream);
      var analyser = context.createAnalyser();
      microphone.connect(analyser);
      //analyser.connect(context.destination);
      analyser.fftSize = 2048;
      var dataArray = new Uint8Array(analyser.fftSize);
      analyser.getByteFrequencyData(dataArray);
  
      s.onclick = function(){
        recorder.stop();
        recorder.exportWAV(function(blob) {
          defual_audio.src = URL.createObjectURL(blob);
        });
        defual_audio.play();
        recorder.clear();
      };
  
      p.onclick = function(){
        recorder = new Recorder(microphone);
        recorder.record();
      };
      r.onclick = function(){
        defual_audio.play();
      }
      function createDownloadLink(){
      }
  
    }, function(){
      console.log('error');
    });
    };