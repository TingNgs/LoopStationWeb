window.onload = function(){

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    var recorder;
  
    var s = document.getElementById('s');
    var p = document.getElementById('p');
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
        createDownloadLink();
        recorder.clear();
      };
  
      p.onclick = function(){
        recorder = new Recorder(microphone);
        recorder.record();
      };
  
      function createDownloadLink(){
        recorder.exportWAV(function(blob) {
          var url = URL.createObjectURL(blob);
          var au = document.createElement('audio');
          au.controls = true;
          au.src = url;
          //au.play();
        });
      }
  
    }, function(){
      console.log('error');
    });
    };