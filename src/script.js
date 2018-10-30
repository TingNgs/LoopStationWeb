window.onload = async function(){
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
}
var stream
const sleep = time => new Promise(resolve => setTimeout(resolve, time));
//var audio_context = new AudioContext;
//var testLooper = new Looper(audio_context)

async function RecordTest(){
    //var testRecorder = new Recorder(stream);
    let _defual_audio = document.getElementById('defual_audio')
    _defual_audio.srcObject = stream;
    /*testRecorder.start();
    await sleep(3000);
    _defual_audio.pause();
    const audio = await testRecorder.stop();
    console.log(audio);
    while(1)
    {
        //await audio.play();
    }*/
    
}


