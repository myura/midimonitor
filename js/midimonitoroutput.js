class MidiMonitorOutput {
	send(data, timestamp = 0) {
		this._send(new MidiMonitorMessage(data));
	}

	_send(midiMonitorMessage) {
		console.error("TO IMPLEMENT: ",  "MidiMonitorOutput._send(", midiMonitorMessage, ")");
	}

	clear() {
		this._clear();
	}

	_clear() {
		console.error("TO IMPLEMENT: ", "MidiMonitorOutput._clear()");
	}
}

class MidiMonitorScreenOutput extends MidiMonitorOutput {
	constructor(midiMonitorController) {
		super();
		this.midiMonitorController = midiMonitorController;
	}

	_send(midiMonitorMessage) {
		switch (midiMonitorMessage.type) {
			case MIDIEvents.EVENT_MIDI_NOTE_OFF:
				this.midiMonitorController.removeTone(midiMonitorMessage.param1, midiMonitorMessage.param2);
				break;
			case MIDIEvents.EVENT_MIDI_NOTE_ON:
				this.midiMonitorController.addTone(midiMonitorMessage.param1, midiMonitorMessage.param2);
				break;
			case MIDIEvents.EVENT_MIDI_NOTE_AFTERTOUCH:
				this.midiMonitorController.setToneAftertouch(midiMonitorMessage.param1, midiMonitorMessage.param2);
				break;
			case MIDIEvents.EVENT_MIDI_CONTROLLER:
				console.warn("Unimplemented Event: CONTROLLER");
				break;
			case MIDIEvents.EVENT_MIDI_PROGRAM_CHANGE:
				console.warn("Unimplemented Event: PROGRAM_CHANGE");
				break;
			case MIDIEvents.EVENT_MIDI_CHANNEL_AFTERTOUCH:
				this.midiMonitorController.setAftertouch(midiMonitorMessage.param1);
				break;
			case MIDIEvents.EVENT_MIDI_PITCH_BEND:
				this.midiMonitorController.setBend(midiMonitorMessage.param1, midiMonitorMessage.param2);
				break;
			default:
				console.warn("Unimplemented Event: SYSTEM");
				break;
		}
	}
}
