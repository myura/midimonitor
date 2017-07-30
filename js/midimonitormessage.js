class MidiMonitorMessage {
	constructor(data) {
		this.type = data[0] >> 4;
		if (this.type == 0xF) {
			console.error("Unimplemented MidiMessage: SYSTEM")	
			return;
		}
		this.channel = data[0] & 0x0F;
		this.param1 = data[1];
		if (MIDIEvents.MIDI_2PARAMS_EVENTS.indexOf(this.type) != -1) {
			this.param2 = data[2];
		}
	}
}
