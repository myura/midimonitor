class MidiMonitorInitializer {
	constructor(canvas) {
		this.canvas = canvas;
		this.canvas.midiMonitorOutput = new MidiMonitorScreenOutput(new MidiMonitorController(this.canvas));
	}

	initInputDirect() {
		var player = new MidiMonitorInput(this.canvas.midiMonitorOutput);
	}

	static _cancelEvent(e) {
		e.dataTransfer = e.dataTransfer || e.target;

		e.stopPropagation();
		e.preventDefault();
		e.dataTransfer.dropEffect = 'link';
	}

	static _fileEvent(e) {
		e.dataTransfer = e.dataTransfer || e.target;

		MidiMonitorInitializer._cancelEvent(e);
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

	initInputFileInput(inputElement) {
		inputElement.midiMonitorOutput = this.canvas.midiMonitorOutput;

		inputElement.addEventListener('change', MidiMonitorInitializer._fileEvent);
	}

	initInputFileDragover(dragoverElement) {
		dragoverElement.midiMonitorOutput = this.canvas.midiMonitorOutput;

		dragoverElement.addEventListener('dragenter', cancelEvent);
		dragoverElement.addEventListener('dragover', cancelEvent);
		dragoverElement.addEventListener('drop', dropEvent);
	}
}
