class MidiMonitorInitializer {
	constructor(canvas) {
		this.canvas = canvas;
		this.canvas.midiMonitorOutput = new MidiMonitorScreenOutput(new MidiMonitorController(this.canvas));
	}

	initInputDirect() {
		var player = new MidiMonitorInput(this.canvas.midiMonitorOutput);
	}

	initInputFile(dragoverElement) {
		console.log(dragoverElement);
		if(!dragoverElement) {
			dragoverElement = this.canvas;
		}
		console.log('2nd:', dragoverElement);
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

			dragoverElement.addEventListener('dragenter', cancelEvent, false);
			dragoverElement.addEventListener('dragover', cancelEvent, false);
			dragoverElement.addEventListener('drop', dropEvent, false);
		}
	}
}
