class Looper
{
    constructor()
    {
        this.recorded = false;
        _audio_context = new AudioContext();
        this.recorderList = [];
        this.looping = false;
    }
    RecordAudio(stream)
    {
        console.log("start record");
        this.recorded = true;
        var input = _audio_context.createMediaStreamSource(stream);
        _recorder = new Recorder(input)
        _recorder.record();
    }
    async StopReocrd()
    {
        var temp_audio = document.createElement("AUDIO");
        temp_audio.controls = true; 
        //temp_audio.loop = true;
        _recorder.stop();
        _recorder.exportWAV(function(blob) {
            temp_audio.src = URL.createObjectURL(blob);
        });
        this.recorderList.push(temp_audio);
        _recorder.clear();
        console.log("stop reocrd")
    }
}
this.recorded;
this.looping;
let _recorder;
let _audio_context;
this.recorderList = [];