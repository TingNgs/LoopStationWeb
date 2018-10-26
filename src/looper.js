class Looper
{
    constructor(audio_context)
    {
        _audio_context = audio_context;
        recorderList = [];
    }
    startRecord(stream)
    {
        var input = audio_context.createMediaStreamSource(stream);
        _recorder = new Recorder(input)
    }
}

let _recorder;
let _audio_context;
let recorderList;