$(function() {
    for(let i=0; i<6; i++){
        let recorderHTML = '<div class="recorder col-4"><button class="mainButton" onclick="OnClickRrecorder('+i+')">Record</button><br><button onclick="OnClickReset('+i+')">Reset</button></div>';
        $('#recorder_row').append(recorderHTML);
    }
 });