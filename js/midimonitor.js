class MidiMonitor {
	static noteOffset() {
		return 12;
	}

	static bendScale() {
		return 2;
	}

	static fps() {
		return 60;
	}

	static screenHeight() {
		return window.screen.height;
	}

	static minFrequency(fps = MidiMonitor.fps()) {
		return fps;
	}
	static maxFrequency(fps = MidiMonitor.fps(), screenHeight = MidiMonitor.screenHeight()) {
		return fps * screenHeight / 2;
	}
	static frequency2Pixels(frequency, fps, screenHeight) {
		return frequency <= 0 ? 0 : this.maxFrequency(fps, screenHeight) / frequency;
	}

	static frequency2Percent(frequency, fps, screenHeight) {
		return frequency <= 0 ? 0 : this.maxFrequency(fps, screenHeight);	// TODO
	}

	static tone2Frequency(toneNumber, bendPercent = 0, bendScale = MidiMonitor.bendScale(), referenceFrequency = 440, referenceNumber = 69) {
		return isNaN(toneNumber) ? 0 : Math.pow(2, (toneNumber + (bendPercent * bendScale) + MidiMonitor.noteOffset() - referenceNumber) / 12) * referenceFrequency;
	}

	static tone2Pixels(toneNumber, bendPercent, bendScale) {
		return MidiMonitor.frequency2Pixels(MidiMonitor.tone2Frequency(toneNumber, bendPercent, bendScale));
	}

	static tone2Percent(toneNumber, bendPercent, bendScale) {
		return MidiMonitor.frequency2Percent(MidiMonitor.tone2Frequency(toneNumber, bendPercent, bendScale));
	}

	static minVelocity() {
		return 0;
	}
	static maxVelocity() {
		return 1;
	}
	static velocity2Opacity(velocity) {
		return Math.max(Math.min(velocity, MidiMonitor.maxVelocity()), MidiMonitor.minVelocity()) / MidiMonitor.maxVelocity();
	}

	static bendRaw(bendMsb, bendLsb) {
		return ((bendMsb & 0x7f) << 7) + (bendLsb & 0x7f);
	}

	static bendPercent(bendRaw, bendMin = 0x0, bendMax = 0x3FFF, bendMid = 0x2000) {
		if(bendRaw > bendMid) {
			return bendRaw / (bendMax - bendMid);
		} else if(bendRaw < bendMid) {
			return -1 + (bendRaw / (bendMid - bendMin));
		}
		return 0;
	}

	static toneBackgroundSizeString(toneNumber, bendPercent = 0, widthPercent = 1) {
		return '' + (widthPercent * 100) + '% ' + MidiMonitor.tone2Pixels(toneNumber, bendPercent) + 'px';
		//return '' + (widthPercent * 100) + '% ' + MidiMonitor.tone2Percent(toneNumber, bendPercent) + '%';
	}
	
	static toneBackgroundImageString(alpha = 1) {
		var black = 'hsla(0, 0%, 0%, ' + alpha + ')';
		var white = 'hsla(0, 0%, 100%, ' + alpha + ')';
		return 'linear-gradient(to bottom, ' + black + ', ' + black + ' 50%, ' + white + ' 50%, ' + white + ')';
	}

	constructor(canvas) {
		this.canvas = canvas;
	}

	setVelocityAll(velocity) {
		this.canvas.opacity = MidiMonitor.velocity2Opacity(velocity);
	}

	setTones(tones, bendPercent = 0) {
		var backgroundSizeArray = [];
		var backgroundImageArray = [];

		var length = Object.keys(tones).length
		var percent = 1 / length;

		for (let toneNumber in tones) {
			toneNumber = parseInt(toneNumber);
			let toneVelocity = tones[toneNumber];

			backgroundSizeArray.push(MidiMonitor.toneBackgroundSizeString(toneNumber, bendPercent));
			backgroundImageArray.push(MidiMonitor.toneBackgroundImageString(percent));
		}

		this.canvas.style.backgroundSize = backgroundSizeArray.join(',');
		this.canvas.style.backgroundImage = backgroundImageArray.join(',');
	}
}

class MidiMonitorMaster {
	constructor(canvas) {
		this.midiMonitor = new MidiMonitor(canvas);
		this.tones = {};
	}

	render() {
		this.midiMonitor.setTones(this.tones, this.bendPercent);
	}

	addTone(toneNumber, velocity) {
		this.tones[toneNumber] = velocity;
		this.render();
	}

	changeTone(toneNumber, velocity) {
		this.tones[toneNumber] = velocity;
		this.render();
	}

	removeTone(toneNumber, velocity) {
		delete this.tones[toneNumber];
		this.render();
	}

	setBend(bendParam1, bendParam2) {
		var bendRaw = MidiMonitor.bendRaw(bendParam2, bendParam1);
		this.bendPercent = MidiMonitor.bendPercent(bendRaw);
		this.render();
	}

	send(data) {
		var midiMessage = new MidiMessage(data);

		switch (midiMessage.type) {
			case MIDIEvents.EVENT_MIDI_NOTE_OFF:
				this.removeTone(midiMessage.param1, midiMessage.param2)
				break;
			case MIDIEvents.EVENT_MIDI_NOTE_ON:
				this.addTone(midiMessage.param1, midiMessage.param2)
				break;
			case MIDIEvents.EVENT_MIDI_NOTE_AFTERTOUCH:
				console.warn("Unimplemented Event: NOTE_AFTERTOUCH");
				break;
			case MIDIEvents.EVENT_MIDI_CONTROLLER:
				console.warn("Unimplemented Event: CONTROLLER");
				break;
			case MIDIEvents.EVENT_MIDI_PROGRAM_CHANGE:
				console.warn("Unimplemented Event: PROGRAM_CHANGE");
				break;
			case MIDIEvents.EVENT_MIDI_CHANNEL_AFTERTOUCH:
				console.warn("Unimplemented Event: CHANNEL_AFTERTOUCH");
				break;
			case MIDIEvents.EVENT_MIDI_PITCH_BEND:
				this.setBend(midiMessage.param1, midiMessage.param2);
				break;
			default:
				console.warn("Unimplemented Event: SYSTEM");
				break;
		}
	}
}

class MidiMessage {
	constructor(data) {
		this.type = data[0] >> 4;
		if (this.type == 0xF) {
			console.error("Unimplemented Message: SYSTEM")	
			return;
		}
		this.channel = data[0] & 0x0F;
		this.param1 = data[1];
		if (MIDIEvents.MIDI_2PARAMS_EVENTS.indexOf(this.type) != -1) {
			this.param2 = data[2];
		}
	}
}