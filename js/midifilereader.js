class MidiFileMessage {
	constructor(byteValues, status = null) {
		var statusValue = byteValues.next();
		this.isDone = statusValue.done

		var statusByte = statusValue.value;
		if(MidiUtil.isStatusByte(statusByte)) {
			status = new MidiFileMessageStatus(statusByte);
		} else if (status == null) {
			console.error("Status not initialized");
			return;
		}
		else {
			console.error("inherited status!")
		}

		this.status = status;
		console.warn(this.status.type, statusByte.toString(16));
		this.data = new FILE_MESSAGE_DATA_CLASSES[this.status.type](byteValues);
	}
}

class MidiFileMessageStatus {
	constructor(statusByte, byteValues) {
		this.type = MidiUtil.MESSAGE_TYPES[MidiUtil.byteMessageType(statusByte)];
		if(this.type == 'System') {
			this.channel = null;
			console.error("TODO: System Messages")	// TODO: System Messages
		} else {
			this.channel = statusByte & 0x0f;
		}
	}
}

class MidiFileMessageData {
	constructor(dataBytes) {
		this.parseData(dataBytes);
	}
	parseData(dataBytes) {
		console.error("UNDEFINED MESSAGE");
	}
}

var FILE_MESSAGE_DATA_CLASSES = {
	undefined: class extends MidiFileMessageData {
	},
	NoteOff: class extends MidiFileMessageData {
		parseData(dataBytes) {
			this.tone = dataBytes.next().value;
			this.velocity = dataBytes.next().value;
		}
	},
	NoteOn: class extends MidiFileMessageData {
		parseData(dataBytes) {
			this.tone = dataBytes.next().value;
			this.velocity = dataBytes.next().value;
		}
	},
	KeyPressure: class extends MidiFileMessageData {
		parseData(dataBytes) {
			this.tone = dataBytes.next().value;
			this.pressure = dataBytes.next().value;
		}
	},
	ControlChange: class extends MidiFileMessageData {
		parseData(dataBytes) {
			this.controller = dataBytes.next().value;
			this.value = dataBytes.next().value;
		}
	},
	ProgramChange: class extends MidiFileMessageData {
		parseData(dataBytes) {
			this.value = dataBytes.next().value;
		}
	},
	ChannelPressure: class extends MidiFileMessageData {
		parseData(dataBytes) {
			this.pressure = dataBytes.next().value;
		}
	},
	PitchBend: class extends MidiFileMessageData {
		parseData(dataBytes) {
			this.bend = MidiUtil.combineByteValue(dataBytes.next().value, dataBytes.next().value);
		}
	},
	System: class extends MidiFileMessageData {
		parseData(dataBytes) {
			console.warn("SYSTEM MESSAGE");
		}
	}
}










class MidiFileChunk {
	static readBytes(byteValues, bytes = 1) {
		var value = 0;
		for(let i = 0; i < bytes; i++) {
			let nextValue = byteValues.next().value;
			value = (value << 8) + (nextValue);
		}
		return value;
	}

	static readVlq(byteValues) {
		var value = 0;
		var toContinue = 1;
		while(toContinue) {
			let nextValue = byteValues.next().value;
			toContinue = nextValue >> 7;
			value = (value << 7) + (nextValue & 0x7f);
		}
		return value;
	}

	constructor(data) {
		this.manageData(data);
	}

	manageData(dataBytes) {
		this._manageData(dataBytes);
	}
	_manageData(dataBytes) {
		console.warn("TO IMPLEMENT: " + "_manageData");
	}
}

class MidiFileHeaderChunk extends MidiFileChunk {
	static division(divisionValue) {
		if(divisionValue >> 15) {
			console.error("SMTPE division format not yet implemented");
			return 0;
		}
		return divisionValue;
	}

	_manageData(dataBytes) {
		var values = dataBytes.values();

		this.format = MidiFileChunk.readBytes(values, 2);
		this.tracks = MidiFileChunk.readBytes(values, 2);
		this.division = MidiFileHeaderChunk.division(MidiFileChunk.readBytes(values, 2));
	}
}

class MidiFileTrackChunk extends MidiFileChunk {
	_manageData(dataBytes) {
		var values = dataBytes.values();
		var runningStatus = null;
		var isDone = false;

		while(!isDone) {
			this.deltaTime = MidiFileChunk.readVlq(values);
			this.message = new MidiFileMessage(values, runningStatus);

			console.log(this.deltaTime, this.message);
			runningStatus = this.message.status;

			isDone = this.message.isDone;
		}
		//console.log(values.next().value);
		//this.midiMessage = new MidiMessage(values);
		//console.log(this.midiMessage);
	}
}


class MidiFileReader {
	constructor(arrayBuffer) {
		this.midiPlayer = new MidiSoundPlayer();
		this.midiSystem = new MidiSystem(this.midiPlayer);


		var byteArray = new Uint8Array(arrayBuffer);

		var values = byteArray.values();
		var headerChunk = MidiFileReader.readChunk(values);

		for(let i = 0; i < headerChunk.data.tracks; i++) {
			let channel = MidiFileReader.readChunk(values);
			console.log(channel);
		}
	}


	static readChunkType(iterator) {
		var arr = [];
		for(let i = 0; i < 4; i++){
			arr.push(iterator.next().value);
		}
		return String.fromCharCode.apply(null, arr);
	}

	static readChunkLength(iterator) {
		var arr = [];
		for(let i = 0; i < 4; i++){
			arr.push(iterator.next().value);
		}
		return arr.reduce(function(total, value) {
			return (total << 8) + value;
		});
	}

	static readChunkData(iterator, length, type) {
		var arr = [];
		for(let i = 0; i < length; i++){
			arr.push(iterator.next().value);
		}

		var dataBytes = new Uint8Array(arr);
		return type == 'MThd' ? new MidiFileHeaderChunk(dataBytes) : new MidiFileTrackChunk(dataBytes);
	}

	static readChunk(iterator) {
		var type = MidiFileReader.readChunkType(iterator);
		var length = MidiFileReader.readChunkLength(iterator);
		var data =  MidiFileReader.readChunkData(iterator, length, type);
		return {
			'type': type,
			'length': length,
			'data': data
		};
	}
}
