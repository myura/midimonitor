class MidiFileChunk {
	
}



class MidiFileReader {
	constructor(arrayBuffer) {
		var byteArray = new Uint8Array(arrayBuffer);
		console.log(MidiFileReader.readChunk(byteArray.values()));
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

	static readChunkData(iterator, length) {
		var arr = [];
		for(let i = 0; i < length; i++){
			arr.push(iterator.next().value);
		}
		return arr;
	}

	static readChunk(iterator) {
		var type = MidiFileReader.readChunkType(iterator);
		var length = MidiFileReader.readChunkLength(iterator);
		var data = MidiFileReader.readChunkData(iterator, length);

		return {
			'type': type,
			'length': length,
			'data': data
		};
	}
}

