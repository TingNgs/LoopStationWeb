window.onload = async function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    window.URL = window.URL || window.webkitURL;
    var recordButtonList = [];
    var stateBoxList = [];
    var LooperList = [];
    var loopSide = true;
    var p = document.getElementById('p');
    var loopstart;
    var loopTime = 3000;
    var state_text = document.getElementById('state_text');
    recordButtonList.push(document.getElementById('r1'));
    recordButtonList.push(document.getElementById('r2'));
    recordButtonList.push(document.getElementById('r3'));
    recordButtonList.push(document.getElementById('r4'));
    recordButtonList.push(document.getElementById('r5'));
    recordButtonList.push(document.getElementById('r6'));
    stateBoxList.push(document.getElementById('state_box1'));
    stateBoxList.push(document.getElementById('state_box2'));
    stateBoxList.push(document.getElementById('state_box3'));
    stateBoxList.push(document.getElementById('state_box4'));
    stateBoxList.push(document.getElementById('state_box5'));
    stateBoxList.push(document.getElementById('state_box6'));
    console.log(recordButtonList[5].id);
    for (var i = 0; i < 6; i++) LooperList.push(new Looper());
    var context = new AudioContext();

    navigator.getUserMedia(
        {
            audio: true
        },
        function(stream) {
            var microphone = context.createMediaStreamSource(stream);

            for (let i = 0; i < recordButtonList.length; i++)
                recordButtonList[i].onclick = async function() {
                    let clickedButton;
                    for (let j = 0; j < recordButtonList.length; j++) {
                        if (recordButtonList[j].id == this.id) clickedButton = j;
                    }
                    if (!LooperList[clickedButton].recorded) {
                        stateBoxList[clickedButton].classList.add('waiting');
                        stateBoxList[clickedButton].classList.remove('empty');
                        await sleep(loopTime - (new Date().getTime() - loopstart));
                        state_text.innerText = 'Start record';
                        stateBoxList[clickedButton].classList.add('recording');
                        stateBoxList[clickedButton].classList.remove('waiting');
                        LooperList[clickedButton].RecordAudio(microphone);
                        await sleep(loopTime);
                        await LooperList[clickedButton].StopReocrd();
                        stateBoxList[clickedButton].classList.remove('recording');
                        stateBoxList[clickedButton].classList.add('recorded');
                        state_text.innerText = 'Stop record';
                    } else {
                        LooperList[clickedButton].looping = !LooperList[clickedButton].looping;
                        state_text.innerText = 'loop state to';
                        if (LooperList[clickedButton].looping) {
                            state_text.innerText = 'loop start';
                            stateBoxList[clickedButton].classList.add('waiting');
                            stateBoxList[clickedButton].classList.remove('recorded');
                            await sleep(loopTime - (new Date().getTime() - loopstart));
                            stateBoxList[clickedButton].classList.remove('waiting');
                            stateBoxList[clickedButton].classList.add('looping');
                            for (let j = 0; j < LooperList[clickedButton].recorderList.length; j++) {
                                LooperList[clickedButton].recorderList[j].play();
                                LooperList[clickedButton].recorderList[j].currentTime = (new Date().getTime() - loopstart) / 1000;
                                console.log(new Date().getTime() - loopstart);
                            }
                        } else {
                            stateBoxList[clickedButton].classList.add('recorded');
                            stateBoxList[clickedButton].classList.remove('looping');
                            state_text.innerText = 'loop stop';
                            for (let j = 0; j < LooperList[clickedButton].recorderList.length; j++) {
                                LooperList[clickedButton].recorderList[j].pause();
                            }
                        }
                    }
                };
        },
        function() {
            console.log('error');
        }
    );
    var tempBeat = document.getElementById('path');
    tempBeat.setAttribute('class', 'loop');
    setInterval(loopSideChange, loopTime);
    start = true;
    function loopSideChange() {
        if (start) {
            start = false;
            state_text.innerText = 'Ready';
        }
        loopSide = !loopSide;
        loopstart = new Date().getTime();
        for (let i = 0; i < LooperList.length; i++) {
            if (LooperList[i].looping == true) {
                for (let j = 0; j < LooperList[i].recorderList.length; j++) {
                    LooperList[i].recorderList[j].currentTime = 0;
                }
            } else {
                for (let j = 0; j < LooperList[i].recorderList.length; j++) {
                    LooperList[i].recorderList[j].pause();
                }
            }
        }
    }
};

const sleep = time => new Promise(resolve => setTimeout(resolve, time));
