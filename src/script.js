var stream
const sleep = time => new Promise(resolve => setTimeout(resolve, time));
var audio_context;
var input;
var analyser;
//var testLooper = new Looper(audio_context)

async function RecordTest() {
    document.getElementById('r').innerText = "sd";
    recorder = new Recorder(input);
    recorder.record();
}

function stopRecording(button) {
    recorder.stop();

    // create WAV download link using audio data blob
    createDownloadLink();

    recorder.clear();
}
window.onload = async function () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    audio_context = new AudioContext;
    stream = await navigator.mediaDevices.getUserMedia({
        audio: true
    });
    input = audio_context.createMediaStreamSource(stream);
    analyser = context.createAnalyser();
    microphone.connect(analyser);
}

function createDownloadLink() {
    recorder.exportWAV(function (blob) {
        var url = URL.createObjectURL(blob);
        var au = document.createElement('audio');
        au.controls = true;
        au.src = url;
        au.play();
    });
}