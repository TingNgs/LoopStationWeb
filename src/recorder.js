class Recorder {

    constructor(stream) {
        _mediaRecorder = new MediaRecorder(stream);
        _mediaRecorder.addEventListener("dataavailable", event => {
            _audioChunks.push(event.data);
        });
        

        audioTracks = stream.getAudioTracks();
        console.log('Using audio device: ' + audioTracks[0].label);
        stream.oninactive = function() {
          console.log('Stream ended');
        };
        window.stream = stream; // make variable available to browser console
        defual_audio.srcObject = stream;
    }
    start() {
        _mediaRecorder.start();
    }

    stop() {
        return new Promise(resolve => {
            _mediaRecorder.addEventListener("stop", () => {
                audioBlob = new Blob(_audioChunks);
                audioUrl = URL.createObjectURL(audioBlob);
                audio = new Audio(audioUrl);
                const play = () => audio.play();
                resolve({
                    audioBlob,
                    audioUrl, 
                    play
                });
            });
            _mediaRecorder.stop();
            defual_audio.srcObject = null;
        });   
    }
    resolve(){ start, stop };
}
let _mediaRecorder;
let _audioChunks = [];
let audioBlob;
let audioUrl;
let audio;
let defual_audio = document.getElementById('defual_audio')
let audioTracks;