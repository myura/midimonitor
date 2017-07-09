class MidiInputter {
	
}

class MidiDirectInputter extends MidiInputter{
	constructor(midiMonitor) {
		super();
		navigator.requestMIDIAccess().then(this._initSuccess.bind(this), this._initFailure.bind(this));
		// this.midiPlayer = new MidiSoundPlayer();
		this.midiPlayer = new MidiMonitorPlayer(midiMonitor);
		this.midiSystem = new MidiSystem(this.midiPlayer);
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
		this.midiSystem.process(event.data);
	}
}