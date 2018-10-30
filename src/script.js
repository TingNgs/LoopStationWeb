window.onload = async function () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;

    audio_context = new AudioContext;
    stream = await navigator.mediaDevices.getUserMedia({
        audio: true
    });
}
var stream
const sleep = time => new Promise(resolve => setTimeout(resolve, time));
var audio_context;
//var testLooper = new Looper(audio_context)

async function RecordTest() {
    var input = audio_context.createMediaStreamSource(stream);
    recorder = new Recorder(input);
    recorder && recorder.record();
}

function stopRecording(button) {
    recorder && recorder.stop();

    // create WAV download link using audio data blob
    createDownloadLink();

    recorder.clear();
}

function createDownloadLink() {
    recorder && recorder.exportWAV(function (blob) {
        var url = URL.createObjectURL(blob);
        var au = document.createElement('audio');
        au.controls = true;
        au.src = url;
        au.play();
    });
}