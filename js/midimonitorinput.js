class MidiMonitorInput {
	constructor(midiMonitorOutput) {
		this.midiMonitorOutput = midiMonitorOutput;
		navigator.requestMIDIAccess().then(this._initSuccess.bind(this), this._initFailure.bind(this));
	}

	_initSuccess(midiAccess) {
		var devices = 0;
		var inputs = midiAccess.inputs.values();
		for(let input = inputs.next(); input && !input.done; input = inputs.next()) {
			input.value.onmidimessage = this._messageEventHandler.bind(this);
			devices++;
		}

		if(!Boolean(devices)) {
			alert("No MIDI input devices present.");
		}
	}
	_initFailure(err) {
		alert("The MIDI system failed to start.");
	}

	_messageEventHandler(event) {
		this.send(event.data);
	}

	send(data) {
		this.midiMonitorOutput.send(data);
	}
}
