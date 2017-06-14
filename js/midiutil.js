class MidiUtil {
	static get MESSAGE_TYPES() {
		return {
			0x8: 'NoteOff',
			0x9: 'NoteOn',
			0xa: 'KeyPressure',
			0xb: 'ControlChange',
			0xc: 'ProgramChange',
			0xd: 'ChannelPressure',
			0xe: 'PitchBend',
			0xf: 'System'
		};
	}

	static combine7bit(msb, lsb) {
		msb = msb & 0x7f;
		lsb = lsb & 0x7f;
		return (msb << 7) + lsb;
	}
}
