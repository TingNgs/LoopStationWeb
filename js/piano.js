$(function () {
    let keyNum = display_keys.length;
    for (let i = 0; i < keyNum; i++) {
        $('#audio_list').append('<audio class="piaon_audio" controls src="./pianosound_mp3/' + display_keys[i].num + '.mp3" type="audio/mp3" />');
    }
})

var display_keys = [
    { num: 1, key: 32, type: 'white' },
    { num: 2, key: 33, type: 'black' },
    { num: 3, key: 34, type: 'white' },

    { num: 4, key: 35, type: 'white' },
    { num: 5, key: 36, type: 'black' },
    { num: 6, key: 37, type: 'white' },
    { num: 7, key: 38, type: 'black' },
    { num: 8, key: 39, type: 'white' },
    { num: 9, key: 40, type: 'white' },
    { num: 10, key: 41, type: 'black' },
    { num: 11, key: 42, type: 'white' },
    { num: 12, key: 43, type: 'black' },
    { num: 13, key: 44, type: 'white' },
    { num: 14, key: 45, type: 'black' },
    { num: 15, key: 46, type: 'white' },

    { num: 16, key: 47, type: 'white' },
    { num: 17, key: 48, type: 'black' },
    { num: 18, key: 49, type: 'white' },
    { num: 19, key: 50, type: 'black' },
    { num: 20, key: 51, type: 'white' },
    { num: 21, key: 52, type: 'white' },
    { num: 22, key: 53, type: 'black' },
    { num: 23, key: 54, type: 'white' },
    { num: 24, key: 55, type: 'black' },
    { num: 25, key: 56, type: 'white' },
    { num: 26, key: 57, type: 'black' },
    { num: 27, key: 58, type: 'white' },

    { num: 28, key: 59, type: 'white' },
    { num: 29, key: 60, type: 'black' },
    { num: 30, key: 61, type: 'white' },
    { num: 31, key: 62, type: 'black' },
    { num: 32, key: 63, type: 'white' },
    { num: 33, key: 64, type: 'white' },
    { num: 34, key: 65, type: 'black' },
    { num: 35, key: 66, type: 'white' },
    { num: 36, key: 67, type: 'black' },
    { num: 37, key: 68, type: 'white' },
    { num: 38, key: 69, type: 'black' },
    { num: 39, key: 70, type: 'white' },

    { num: 40, key: 71, type: 'white' },
    { num: 41, key: 72, type: 'black' },
    { num: 42, key: 73, type: 'white' },
    { num: 43, key: 74, type: 'black' },
    { num: 44, key: 75, type: 'white' },
    { num: 45, key: 76, type: 'white' },
    { num: 46, key: 77, type: 'black' },
    { num: 47, key: 78, type: 'white' },
    { num: 48, key: 79, type: 'black' },
    { num: 49, key: 80, type: 'white' },
    { num: 50, key: 81, type: 'black' },
    { num: 51, key: 82, type: 'white' },

    { num: 52, key: 83, type: 'white' },
    { num: 53, key: 84, type: 'black' },
    { num: 54, key: 85, type: 'white' },
    { num: 55, key: 86, type: 'black' },
    { num: 56, key: 87, type: 'white' },
    { num: 57, key: 88, type: 'white' },
    { num: 58, key: 89, type: 'black' },
    { num: 59, key: 90, type: 'white' },
    { num: 60, key: 91, type: 'black' },
    { num: 61, key: 92, type: 'white' },
    { num: 62, key: 93, type: 'black' },
    { num: 63, key: 94, type: 'white' },

    { num: 64, key: 95, type: 'white' },
    { num: 65, key: 96, type: 'black' },
    { num: 66, key: 97, type: 'white' },
    { num: 67, key: 98, type: 'black' },
    { num: 68, key: 99, type: 'white' },
    { num: 69, key: 100, type: 'white' },
    { num: 70, key: 101, type: 'black' },
    { num: 71, key: 102, type: 'white' },
    { num: 72, key: 103, type: 'black' },
    { num: 73, key: 104, type: 'white' },
    { num: 74, key: 105, type: 'black' },
    { num: 75, key: 106, type: 'white' },

    { num: 76, key: 107, type: 'white' },
    { num: 77, key: 108, type: 'black' },
    { num: 78, key: 109, type: 'white' },
    { num: 79, key: 110, type: 'black' },
    { num: 80, key: 111, type: 'white' },
    { num: 81, key: 112, type: 'white' },
    { num: 82, key: 113, type: 'black' },
    { num: 83, key: 114, type: 'white' },
    { num: 84, key: 115, type: 'black' },
    { num: 85, key: 116, type: 'white' },
    { num: 86, key: 117, type: 'black' },
    { num: 87, key: 118, type: 'white' },

    { num: 88, key: 119, type: 'white' }
]

let PianoAudioList = [];

function RenderPianoKey(i) {
    return '<div class="key ' + display_keys[i].type + '"></div>';
}

function RenderPianoKeySet() {
    let keyNum = display_keys.length;
    for (let i = 0; i < keyNum; i++) {
        let keyElement = RenderPianoKey(i)
        if (i < keyNum - 1) {
            if (display_keys[i + 1].type == 'black') {
                i++;
                keyElement += RenderPianoKey(i)
            }
        }
        $('#piano_keyboard').append('<div class="key_set">' + keyElement + '</div>');
    }

}