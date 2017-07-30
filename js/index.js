function onload() {
	var midiMonitorScreenOutput = new MidiMonitorScreenOutput(new MidiMonitorMaster(this.document.getElementById('midimonitor')));

	var midiMonitorOutput = midiMonitorScreenOutput;

	window.addEventListener('load', function() {
		var player = new MidiMonitorInput(midiMonitorOutput);
	});
	if(FileReader) {
		function cancelEvent(e) {
			e.stopPropagation();
			e.preventDefault();
			e.dataTransfer.dropEffect = 'link';
		}
		function dropEvent(e) {
			cancelEvent(e);
			for(var i = 0; i < e.dataTransfer.files.length; ++i) {
				var file = e.dataTransfer.files[i];
				var reader = new FileReader();
				reader.onload = function(e) {
					let midiMonitorPlayer = new MidiMonitorPlayer(midiMonitorOutput);
					midiMonitorPlayer.load(e.target.result);
					midiMonitorPlayer.play();
				};
				reader.readAsArrayBuffer(file);
			}
		}
		document.body.addEventListener('dragenter', cancelEvent, false);
		document.body.addEventListener('dragover', cancelEvent, false);
		document.body.addEventListener('drop', dropEvent, false);
	}
}