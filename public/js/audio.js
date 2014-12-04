// Thanks to http://webaudiodemos.appspot.com/AudioRecorder/index.html for much of this code

window.AudioContext = window.AudioContext ||
                      window.webkitAudioContext;
var audioContext = new AudioContext();
var audioInput = null, realAudioInput = null, inputPoint = null, audioRecorder = null;

function playRecording( buffers ){

	var newSource = audioContext.createBufferSource();
  var newBuffer = audioContext.createBuffer( 2, buffers[0].length, audioContext.sampleRate );
  newBuffer.getChannelData(0).set(buffers[0]);
  newBuffer.getChannelData(1).set(buffers[1]);
  newSource.buffer = newBuffer;

  newSource.connect( audioContext.destination );
  newSource.start(0);
}

function processBuffer( buffers ){
	audioRecorder.exportWAV( function( audioBlob ) {
		// Do some post-export stuff with the file here
		// i.e. make it available to download
		console.log("finished exporting wav");
		//Recorder.setupDownload( blob, "myRecording.wav" );

		playRecording( buffers );
	} );
}

function gotStream(stream) {
	inputPoint = audioContext.createGain();
	realAudioInput = audioContext.createMediaStreamSource(stream);
	audioInput = realAudioInput;
	audioInput.connect(inputPoint);

	var config = {
		workerPath: 'vendor/Recorderjs/recorderWorker.js'
	};
	audioRecorder = new Recorder( inputPoint, config );
}

function initAudio() {
	if ( hasGetUserMedia() ){
  	navigator.getUserMedia  = navigator.getUserMedia ||
                          							navigator.webkitGetUserMedia ||
                          							navigator.mozGetUserMedia ||
                          							navigator.msGetUserMedia;
  	navigator.getUserMedia({audio: true}, gotStream);
  }
}

window.addEventListener('load', function(){
	initAudio();

	document.getElementById('control').addEventListener('click', function( e ){
		var el = e.srcElement;
		if (el.classList.contains("is_recording")) {
			audioRecorder.stop();
			el.classList.remove("is_recording");
			el.innerHTML = "Record";
			audioRecorder.getBuffer( processBuffer );
		} else {
			if (!audioRecorder) return;
			el.classList.add("is_recording");
			el.innerHTML = "Stop";
			audioRecorder.clear();
			audioRecorder.record();
		}
	});
});

function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}