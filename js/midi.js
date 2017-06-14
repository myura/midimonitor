class MidiMessage {
	constructor(dataBytes, status = null) {
		var statusRunning = dataBytes[0] >> 7;
		if(statusRunning || status == null) {
			status = new MessageStatus(dataBytes[0]);
			dataBytes = dataBytes.subarray(1);
		}
		this.status = status;
		this.data = new MESSAGE_DATA_CLASSES[this.status.type](dataBytes);
	}
}

class MessageStatus {
	constructor(statusByte) {
		this.type = MidiUtil.MESSAGE_TYPES[statusByte >> 4];
		if(this.type == 'System') {
			this.channel = null;
			// TODO: System Messages
		} else {
			this.channel = statusByte & 0x0f;
		}
	}
}

class MessageData {
	constructor(dataBytes) {
		this.parseData(dataBytes);
	}
}

var MESSAGE_DATA_CLASSES = {
	undefined: class extends MessageData {
		parseData() {
			console.log("UNDEFINED");
		}
	},
	NoteOff: class extends MessageData {
		parseData(dataBytes) {
			this.tone = dataBytes[0];
			this.velocity = dataBytes[1];
			//console.log("NOTE OFF:", this.tone, this.velocity);
		}
	},
	NoteOn: class extends MessageData {
		parseData(dataBytes) {
			this.tone = dataBytes[0];
			this.velocity = dataBytes[1];
			//console.log("NOTE ON", this.tone, this.velocity);
		}
	},
	KeyPressure: class extends MessageData {
		parseData(dataBytes) {
			this.tone = dataBytes[0];
			this.pressure = dataBytes[1];
		}
	},
	ControlChange: class extends MessageData {
		parseData(dataBytes) {
			this.controller = dataBytes[0];
			this.value = dataBytes[1];
		}
	},
	ProgramChange: class extends MessageData {
		parseData(dataBytes) {
			this.value = dataBytes[0];
		}
	},
	ChannelPressure: class extends MessageData {
		parseData(dataBytes) {
			this.pressure = dataBytes[0];
		}
	},
	PitchBend: class extends MessageData {
		parseData(dataBytes) {
			this.bend = MidiUtil.combine7bit(dataBytes[1], dataBytes[0]);
		}
	}
}



class MidiChannel {
	constructor() {
		this.runningStatus = null;

		this.notes = [];
		this.pressures = [];
		this.pressureChannel = undefined;
		this.bend = 0;
	}

	_addNote(note, velocity = 0) {
		velocity <= 0 ? this._removeNote(note) : this.notes[note] = velocity;
	}
	_removeNote(note) {
		delete this.notes[note];
	}

	_addPressure(note, pressure = 0) {
		pressure <= 0 ? this._removePressure(note) : this.pressures[note] = pressure;

	}
	_removePressure(note) {
		delete this.pressures[note];
	}

	process(messageData) {
	}
}
