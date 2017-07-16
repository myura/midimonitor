class MidiBend {
	static _rangePercent(value, max, min) {
		return (value - min) / (max - min);
	}

	get _maxByteValue() {
		//return MidiUtil.combineByteValue(0xff, 0xff);	// 16383
		return 8191;
	}

	get _minByteValue() {
		//return MidiUtil.combineByteValue(0x00, 0x00);	// 0
		return -8192;
	}

	get _midByteValue() {
		//return MidiUtil.combineByteValue(0x40, 0x00);	// 8192
		return 0;
	}

	constructor(bendByteValue = this.midByteValue) {
		this.bend = bendByteValue;
	}

	get bend() {
		return this.bendByteValue;
	}
	set bend(bendByteValue) {
		this.bendByteValue = bendByteValue;
	}

	get bendPercent() {
		if(this.bend == this._midByteValue) {
			return 0;
		}
		else if(this.bend > this._midByteValue) {
			return MidiBend._rangePercent(this.bend, this._maxByteValue, this._midByteValue);
		}
		else if(this.bend < this._midByteValue) {
			return MidiBend._rangePercent(this.bend, this._midByteValue, this._minByteValue);
		}
		return NaN;
	}
}


class MidiMessage {
	constructor(byteValues, status = null) {
		var byte0 = byteValues.next().value;
		if(MidiUtil.isStatusByte(byte0)) {
			status = new MessageStatus(byte0);
			byte0 = null;
		} else if (status == null) {
			console.error("Status not initialized");
		}
		this.status = status;
		this.data = new MESSAGE_DATA_CLASSES[this.status.type](byteValues, byte0);
	}
}

class MessageStatus {
	constructor(statusByte) {
		this.type = MidiUtil.MESSAGE_TYPES[MidiUtil.byteMessageType(statusByte)];
		if(this.type == 'System') {
			this.channel = null;
			console.error("TODO: System Messages")	// TODO: System Messages
		} else {
			this.channel = statusByte & 0x0f;
		}
	}
}

class MessageData {
	constructor(byteValues, byte0 = null) {
		var dataBytes = [];
		for(let i = 0; i < this.messageLength(); i++) {
			if(byte0) {
				dataBytes[i] = byte0;
				byte0 = null;
			}
			else {
				dataBytes[i] = byteValues.next().value;
			}
		}
		this.parseData(dataBytes);
	}
	messageLength() {
		return 0;
	}
	parseData(dataBytes) {
		console.log("UNDEFINED MESSAGE");
	}
}

var MESSAGE_DATA_CLASSES = {
	undefined: class extends MessageData {
	},
	NoteOff: class extends MessageData {
		messageLength() {
			return 2;
		}
		parseData(dataBytes) {
			this.tone = dataBytes[0];
			this.velocity = dataBytes[1];
		}
	},
	NoteOn: class extends MessageData {
		parseData(dataBytes) {
			this.tone = dataBytes[0];
			this.velocity = dataBytes[1];
		}
		messageLength() {
			return 2;
		}
	},
	KeyPressure: class extends MessageData {
		parseData(dataBytes) {
			this.tone = dataBytes[0];
			this.pressure = dataBytes[1];
		}
		messageLength() {
			return 2;
		}
	},
	ControlChange: class extends MessageData {
		parseData(dataBytes) {
			this.controller = dataBytes[0];
			this.value = dataBytes[1];
		}
		messageLength() {
			return 2;
		}
	},
	ProgramChange: class extends MessageData {
		parseData(dataBytes) {
			this.value = dataBytes[0];
		}
		messageLength() {
			return 1;
		}
	},
	ChannelPressure: class extends MessageData {
		parseData(dataBytes) {
			this.pressure = dataBytes[0];
		}
		messageLength() {
			return 1;
		}
	},
	PitchBend: class extends MessageData {
		parseData(dataBytes) {
			this.bend = MidiUtil.combineByteValue(dataBytes[1], dataBytes[0]);
		}
		messageLength() {
			return 2;
		}
	},
	System: class extends MessageData {
	}
}


class MidiChannel {
	constructor(player) {
		this.player = player;

		this.notes = [];
		this.pressures = [];
		this.pressureChannel = 0;
		this.bend = new MidiBend();
	}

	_addNote(note, velocity = 0) {
		velocity <= 0 ? this._removeNote(note) : this.notes[note] = velocity;
		console.log("process")
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

	process(message) {
		switch(message.status.type) {
			case 'NoteOff':
				this.player.removeNote(message.data.tone, message.data.velocity);
				break;
			case 'NoteOn':
				this.player.addNote(message.data.tone, message.data.velocity);
				break;
			case 'PitchBend':
				var bendPercent = MidiUtil.bendPercent(message.data.bend);
				this.player.changeBend(bendPercent);
		}
	}
}


class MidiSystem {
	constructor(player) {
		this.player = player;

		this.runningStatus = null;
		this.channels = [];
		for (var c = 0; c < 16; c++) {
    		this.channels.push(new MidiChannel(this.player));
		}
	}

	process(byteValues) {
		var midiMessage = new MidiMessage(byteValues, this.runningStatus);
		this.runningStatus = midiMessage.status || this.runningStatus;

		var midiChannel = this.channels[midiMessage.status.channel];
		if (midiChannel) {
			midiChannel.process(midiMessage);
		}
	}
}
