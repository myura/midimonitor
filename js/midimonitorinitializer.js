class MidiMonitorInitializer {
	constructor(canvas) {
		this.canvas = canvas;
		this.canvas.midiMonitorOutput = new MidiMonitorScreenOutput(new MidiMonitorController(this.canvas));
	}

	initInputDirect() {
		var player = new MidiMonitorInput(this.canvas.midiMonitorOutput);
	}

	initInputFile() {
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
					reader.midiMonitorOutput = e.target.midiMonitorOutput;
					reader.onload = function(e) {
						let midiMonitorPlayer = new MidiMonitorPlayer(e.target.midiMonitorOutput);
						midiMonitorPlayer.load(e.target.result);
						midiMonitorPlayer.play();
					};
					reader.readAsArrayBuffer(file);
				}
			}

			this.canvas.addEventListener('dragenter', cancelEvent, false);
			this.canvas.addEventListener('dragover', cancelEvent, false);
			this.canvas.addEventListener('drop', dropEvent, false);
		}
	}
}
