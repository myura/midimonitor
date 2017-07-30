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

class MidiMonitorScreenOutput extends MidiMonitorOutput{
	constructor(midiMonitorMaster) {
		super();
		this.midiMonitorMaster = midiMonitorMaster;
	}

	_send(midiMonitorMessage) {
		switch (midiMonitorMessage.type) {
			case MIDIEvents.EVENT_MIDI_NOTE_OFF:
				this.midiMonitorMaster.removeTone(midiMonitorMessage.param1, midiMonitorMessage.param2)
				break;
			case MIDIEvents.EVENT_MIDI_NOTE_ON:
				this.midiMonitorMaster.addTone(midiMonitorMessage.param1, midiMonitorMessage.param2)
				break;
			case MIDIEvents.EVENT_MIDI_NOTE_AFTERTOUCH:
				console.warn("Unimplemented Event: NOTE_AFTERTOUCH");
				break;
			case MIDIEvents.EVENT_MIDI_CONTROLLER:
				console.warn("Unimplemented Event: CONTROLLER");
				break;
			case MIDIEvents.EVENT_MIDI_PROGRAM_CHANGE:
				console.warn("Unimplemented Event: PROGRAM_CHANGE");
				break;
			case MIDIEvents.EVENT_MIDI_CHANNEL_AFTERTOUCH:
				console.warn("Unimplemented Event: CHANNEL_AFTERTOUCH");
				break;
			case MIDIEvents.EVENT_MIDI_PITCH_BEND:
				this.midiMonitorMaster.setBend(midiMonitorMessage.param1, midiMonitorMessage.param2);
				break;
			default:
				console.warn("Unimplemented Event: SYSTEM");
				break;
		}
	}
}
