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

	playTone(toneNumber) {
		this._playTone(toneNumber);
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
}

class MidiSoundTone extends MidiTone {
	constructor(audioContext) {
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

	_playTone(toneNumber) {
		this.oscillatorNode = this.audioContext.createOscillator();
		this.oscillatorNode.type = 'square';
		this.oscillatorNode.frequency.value = MidiUtil.noteFrequency(toneNumber);
		this.oscillatorNode.connect(this.gainNode);

		this.oscillatorNode.start();
	}

	_stopTone() {
		this.oscillatorNode.stop();
	}
}


class MidiMonitorTone extends MidiTone {
	constructor() {
		super();
	}

	_playTone(toneNumber) {
		this.frequency = MidiUtil.noteFrequency(toneNumber);
		//this.midiMonitor.setFrequency(MidiUtil.noteFrequency(toneNumber));

	}

	_stopTone() {
		this.playTone(0);
	}
}



class MidiPlayer {
	addNote(tone, velocity) {
		this._addNote(tone, velocity);
	}
	_addNote(tone, velocity) {
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
		this._changeBend(bendPercent);
	}
	_changeBend(bendPercent) {
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
		this.soundTones[tone] = new MidiSoundTone(this.audioContext);
		this.soundTones[tone].setVelocity(velocity);
		this.soundTones[tone].playTone(tone);
	}

	_removeNote(tone, velocity) {
		this.soundTones[tone].stopTone();
		delete this.soundTones[tone];
	}

}

class MidiMonitorPlayer extends MidiPlayer {
	constructor(midiMonitor) {
		super();
		this.monitorTones = {};
		this.midiMonitor = midiMonitor;
	}

	_addNote(tone, velocity) {
		this.monitorTones[tone] = new MidiMonitorTone(this.midiMonitor);
		this.monitorTones[tone].setVelocity(velocity);
		this.monitorTones[tone].playTone(tone);

		this.midiMonitor.setTones(this.monitorTones);
	}

	_removeNote(tone, velocity) {
		this.monitorTones[tone].stopTone();
		delete this.monitorTones[tone];

		this.midiMonitor.setTones(this.monitorTones);
	}
}