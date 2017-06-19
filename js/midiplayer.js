function noteFrequency(noteNumber, referenceFrequency = 440, referenceNumber = 69) {
	return isNaN(noteNumber) ? 0 : Math.pow(2, (noteNumber - referenceNumber) / 12) * referenceFrequency;
}

class SoundTone {
	constructor(audioContext) {
		this.audioContext = audioContext;
		this.gainNode = this.audioContext.createGain();
		this.gainNode.connect(this.audioContext.destination);
		this.setGain();
	}

	setGain(gain = 0.01) {
		this.gainNode.gain.value = gain;
	}

	playTone(toneNumber) {
		this.oscillatorNode = this.audioContext.createOscillator();
		this.oscillatorNode.type = 'square';
		this.oscillatorNode.frequency.value = noteFrequency(toneNumber);
		this.oscillatorNode.connect(this.gainNode);

		this.oscillatorNode.start();
	}

	stopTone() {
		this.oscillatorNode.stop();
	}
}

/*
class MidiSoundPlayer {
	playTone(tone, velocity = 0) {
		console.log("play tone");
		this.soundTones[tone] = new SoundTone(this.audioContext);
		this.soundTones[tone].playTone(tone);
	}

	stopTone(tone, velocity = 0) {
		if(this.soundTones[tone]) {
			this.soundTones[tone].stopTone();
			delete this.soundTones[tone];
		}
	}

	constructor() {
		navigator.requestMIDIAccess().then(this._initSuccess.bind(this), this._initFailure.bind(this));
		this.runningMessageStatus = null;
		this.soundTones = [];
		this.audioContext = new window.AudioContext();

		this.midiSystem = new MidiSystem();
	}

	_initSuccess(midiAccess) {
		var haveAtLeastOneDevice = false;
		var inputs = midiAccess.inputs.values();
		for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
			input.value.onmidimessage = this._messageEventHandler.bind(this);
			haveAtLeastOneDevice = true;
		}
		if (!haveAtLeastOneDevice) {
			alert("No MIDI input devices present.");
		}
	}

	_initFailure(err) {
		alert("The MIDI system failed to start.");
	}

	_messageEventHandler(event) {

		this.midiSystem.process(event.data);

		// var message = new MidiMessage(event.data, this.runningMessageStatus);
		// this.runningMessageStatus = message.status;

		// var tone = message.data.tone;
		// var velocity = message.data.velocity;
		// switch(message.status.type) {
		// 	case 'NoteOff':
		// 		this.stopTone(tone, velocity);
		// 		break;
		// 	case 'NoteOn':
		// 		this.playTone(tone, velocity);
		// 		break;
		// }

	}
}
*/





class MidiInputter {
	constructor() {
		navigator.requestMIDIAccess().then(this._initSuccess.bind(this), this._initFailure.bind(this));
		this.midiPlayer = new MidiSoundPlayer();
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





class MidiPlayer {
	addNote(tone, velocity) {
		this._addNote(tone, velocity);
	}
	_addNote(tone, velocity) {
		//console.warn("TO IMPLEMENT: " + arguments.callee.name);
		console.warn("TO IMPLEMENT: " + "_addNote");
	}

	removeNote(tone) {
		this._removeNote(tone);
	}
	_removeNote(tone) {
		//console.warn("TO IMPLEMENT: " + arguments.callee.name);
		console.warn("TO IMPLEMENT: " + "_removeNote");
	}

	changePressure(tone, pressure) {
		this._changePressure(tone, pressure)
	}
	_changePressure(tone, pressure) {
		//console.warn("TO IMPLEMENT: " + arguments.callee.name);
		console.warn("TO IMPLEMENT: " + "_changePressure");
	}

	changePressureChannel(pressure) {
		this._changePressureChannel(pressure);
	}
	_changePressureChannel(pressure) {
		//console.warn("TO IMPLEMENT: " + arguments.callee.name);
		console.warn("TO IMPLEMENT: " + "_changePressureChannel");
	}

	changeBend(bendPercent) {
		this._changeBend(bendPercent);
	}
	_changeBend(bendPercent) {
		//console.warn("TO IMPLEMENT: " + arguments.callee.name);
		console.warn("TO IMPLEMENT: " + "_changeBend");
	}
}

class MidiSoundPlayer extends MidiPlayer {
	constructor() {
		super();
		this.soundTones = [];
		this.audioContext = new window.AudioContext();
	}

	_addNote(tone, velocity) {
		this.soundTones[tone] = new SoundTone(this.audioContext);
		this.soundTones[tone].playTone(tone);
	}

	_removeNote(tone, velocity) {
		this.soundTones[tone].stopTone();
		delete this.soundTones[tone];
	}

}