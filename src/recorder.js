class Recorder {

    constructor(stream) {
        _mediaRecorder = new MediaRecorder(stream);

        _mediaRecorder.addEventListener("dataavailable", event => {
            _audioChunks.push(event.data);
        });
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
        });   
    }
    resolve(){ start, stop };
}
let _mediaRecorder;
let _audioChunks = [];
let audioBlob;
let audioUrl;
let audio;