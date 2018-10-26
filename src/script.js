window.onload = async function(){
    var stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    var testRecorder = new Recorder(stream);
    testRecorder.start();
    await sleep(3000);
    const audio = await testRecorder.stop();
    console.log(audio);
    audio.play();
}
const sleep = time => new Promise(resolve => setTimeout(resolve, time));
var audio_context = new AudioContext;
var testLooper = new Looper(audio_context)


