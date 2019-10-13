const DOWNLOAD_ICON = './svg/download.svg';
function ShowDownloadPage() {
	$('#recorder_download').removeClass('hide');
	$('#download_record_container').empty();
	looperList.forEach((looper, i) => {
		$('#download_record_container').append(
			`<div class='download_record_row'><p> Looper ${i + 1}</p></div>`
		);
		looper.recorderList.forEach((record, j) => {
			if (!record.instrument) {
				$('#download_record_container').append(
					`<div class='download_record_row'><div class='download_wave' id='downloadRecord${i}${j}'/><div class='download_button_container'>` +
						`<img src="${DOWNLOAD_ICON}" onclick="DownloadRecording(${i},${j})"/></div></div>`
				);
				loadRecorderDownload(
					`downloadRecord${i}${j}`,
					record.audio._src
				);
			}
		});
	});
}

function loadRecorderDownload(id, src) {
	let wavesurfer = WaveSurfer.create({
		container: '#' + id,
		barWidth: 2,
		barHeight: 4,
		barGap: null,
		waveColor: '#FFF',
		height: 128 / 2
	});
	wavesurfer.load(src);
}

function OnClickDownloadCross() {
	$('#recorder_download').addClass('hide');
}

function DownloadRecording(x, index) {
	if (!looperList[x].recorderList[index].instrument) {
		var a = document.createElement('a');
		var url = looperList[x].recorderList[index].audio._src;
		var filename = 'myfile.wav';
		a.href = url;
		a.download = filename;
		a.click();
	}
}
