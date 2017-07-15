class MidiTone {
	static minVelocity() {
		return 0;
	}
	static maxVelocity() {
		return 127;
	}

	setVelocity(velocity = 72) {
		this._setVelocity(velocity);
	}
	_setVelocity(velocity) {
		console.warn("TO IMPLEMENT: " + "_setVelocity");
	}

	playTone(toneNumber, bendPercent = 0) {
		this._playTone(toneNumber, bendPercent);
	}
	_playTone(toneNumber) {
		console.warn("TO IMPLEMENT: " + "_playTone");
	}

	stopTone() {
		this._stopTone();
	}
	_stopTone() {
		console.warn("TO IMPLEMENT: " + "_stopTone");
	}

	changeBend(bendPercent) {
		this._changeBend(bendPercent);
	}
	_changeBend(bendPercent, scale) {
		console.warn("TO IMPLEMENT: " + "_changeBend");
	}
}

class MidiSoundTone extends MidiTone {
	constructor(audioContext) {
		super();
		this.audioContext = audioContext;
		this.gainNode = this.audioContext.createGain();
		this.gainNode.connect(this.audioContext.destination);
	}

	_setVelocity(velocity = 72) {
		this._setGain(Math.max(Math.min(velocity, MidiTone.maxVelocity()), MidiTone.minVelocity()) / MidiTone.maxVelocity());
	}


	_setGain(gain = 1) {
		this.gainNode.gain.value = gain * 0.1;
	}

	_playTone(toneNumber, bendPercent) {
		this.oscillatorNode = this.audioContext.createOscillator();
		this.oscillatorNode.type = 'square';
		this.oscillatorNode.frequency.value = MidiUtil.noteFrequency(toneNumber);
		this.oscillatorNode.connect(this.gainNode);

		this.oscillatorNode.start();
	}

	_stopTone() {
		this.oscillatorNode.stop();
	}

	_changeBend(bendPercent) {
		this.oscillatorNode.detune.value = (bendPercent * MidiUtil.bendScale()) * 100;
	}
}


class MidiMonitorTone extends MidiTone {
	constructor() {
		super();
	}

	_setVelocity(velocity = 72) {
		// TODO: implement velocity
	}

	_playTone(toneNumber, bendPercent) {
		this.toneNumber = toneNumber;

		this.frequency = MidiUtil.noteFrequency(this.toneNumber, bendPercent, MidiUtil.bendScale());
		//this.midiMonitor.setFrequency(MidiUtil.noteFrequency(toneNumber));
	}

	_stopTone() {
		this.playTone(0);
	}

	_changeBend(bendPercent, scale) {
		this.frequency = MidiUtil.noteFrequency(this.toneNumber, bendPercent, MidiUtil.bendScale());
	}
}



class MidiPlayer {
	constructor(midiMonitor) {
		this.midiMonitor = midiMonitor;
		this.bendPercent = 0;
	}

	addNote(tone, velocity) {
		this._addNote(tone, velocity, this.bendPercent);
	}
	_addNote(tone, velocity, bendPercent) {
		console.warn("TO IMPLEMENT: " + "_addNote");
	}

	removeNote(tone) {
		this._removeNote(tone);
	}
	_removeNote(tone) {
		console.warn("TO IMPLEMENT: " + "_removeNote");
	}

	changePressure(tone, pressure) {
		this._changePressure(tone, pressure)
	}
	_changePressure(tone, pressure) {
		console.warn("TO IMPLEMENT: " + "_changePressure");
	}

	changePressureChannel(pressure) {
		this._changePressureChannel(pressure);
	}
	_changePressureChannel(pressure) {
		console.warn("TO IMPLEMENT: " + "_changePressureChannel");
	}

	changeBend(bendPercent) {
		this.bendPercent = bendPercent;
		this._changeBend(this.bendPercent);
	}
	_changeBend(bendPercent) {
		console.warn("TO IMPLEMENT: " + "_changeBend");
	}
}

class MidiSoundPlayer extends MidiPlayer {
	constructor(midiMonitor) {
		super(midiMonitor);
		this.soundTones = [];
		this.audioContext = new window.AudioContext();
	}

	_addNote(tone, velocity, bendPercent) {
		this.soundTones[tone] = new MidiSoundTone(this.audioContext);
		this.soundTones[tone].setVelocity(velocity);
		this.soundTones[tone].playTone(tone, bendPercent);
	}

	_removeNote(tone, velocity) {
		this.soundTones[tone].stopTone();
		delete this.soundTones[tone];
	}

	_changeBend(bendPercent) {
		for(let toneNum in this.soundTones) {
			this.soundTones[toneNum].changeBend(bendPercent);
		}
	}
}

class MidiMonitorPlayer extends MidiPlayer {
	constructor(midiMonitor) {
		super(midiMonitor);
		this.monitorTones = {};
	}

	_addNote(tone, velocity, bendPercent) {
		this.monitorTones[tone] = new MidiMonitorTone(this.midiMonitor);
		this.monitorTones[tone].setVelocity(velocity);
		this.monitorTones[tone].playTone(tone, bendPercent);

		this.midiMonitor.setTones(this.monitorTones);
	}

	_removeNote(tone, velocity) {
		this.monitorTones[tone].stopTone();
		delete this.monitorTones[tone];

		this.midiMonitor.setTones(this.monitorTones);
	}

	_changeBend(bendPercent) {
		for(let toneNum in this.monitorTones) {
			this.monitorTones[toneNum].changeBend(bendPercent);
		}
		this.midiMonitor.setTones(this.monitorTones);
	}
}