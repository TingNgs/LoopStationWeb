class Recorder {

    constructor(stream) {
        _mediaRecorder = new MediaRecorder(stream);
        /*_mediaRecorder.addEventListener("dataavailable", event => {
            _audioChunks.push(event.data);
        });*/
    }
    start() {
        _mediaRecorder.start();
    }

    stop() {
        /*return new Promise(resolve => {
            _mediaRecorder.addEventListener("stop", () => {
                _audioBlob = new Blob(_audioChunks);
                _audioUrl = URL.createObjectURL(_audioBlob);
                _audio = new Audio(_audioBlob);
                const play = () => _audio.play();
                resolve({
                    _audioBlob,
                    _audioBlob, 
                    play
                });
            });
            _mediaRecorder.stop();
            _defual_audio.srcObject = null;
        });*/
    }
    resolve(){ start, stop };
}
let _mediaRecorder;
let _audioChunks = [];
let _audioBlob;
let _audioUrl;
let _audio;
