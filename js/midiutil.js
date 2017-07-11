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


	static combineByteValue(msb, lsb) {
		return (this.byteValue(msb) << 7) + this.byteValue(lsb);
	}


	static isStatusByte(byte) {
		return Boolean(byte >> 7);
	}

	static byteMessageType(statusByte) {
		return statusByte >> 4;
	}

	static byteValue(valueByte) {
		return valueByte & 0x7f;
	}

	static noteFrequency(noteNumber, referenceFrequency = 440, referenceNumber = 69) {
		var noteOffset = 12;
		return isNaN(noteNumber) ? 0 : Math.pow(2, (noteNumber + noteOffset - referenceNumber) / 12) * referenceFrequency;
	}

	static bendPercent(bendNumber, bendMin = 0, bendMax = 16383, bendMid = 8192) {
		if(bendNumber > bendMid) {
			return bendNumber / (bendMax - bendMid);
		} else if(bendNumber < bendMid) {
			return -1 + (bendNumber / (bendMid - bendMin));
		}
		return 0;
	}
}
