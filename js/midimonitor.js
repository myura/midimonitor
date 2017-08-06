class MidiMonitor {
	static toneAlphaConstant(number, totalNumber) {
		return 1 / totalNumber;
	}

	static toneAlphaLinear(number, totalNumber) {
		return number / totalNumber;
	}

	static toneAlpha(number, totalNumber) {
		return MidiMonitor.toneAlphaFunction ?  MidiMonitor.toneAlphaFunction(number, totalNumber) : MidiMonitor.toneAlphaLinear(number, totalNumber);
	}


	static imageScale() {
		return MidiMonitor.imageScaleValue || 10;
	}

	static noteOffset() {
		return MidiMonitor.noteOffsetValue || 12;
	}

	static bendScale() {
		return MidiMonitor.bendScaleValue || 2;
	}

	static fps() {
		return MidiMonitor.fpsValue || 60;
	}

	static screenHeight() {
		return window.screen.height;
	}

	static minFrequency(fps) {
		return fps;
	}
	static maxFrequency(fps, screenHeight) {
		return fps * screenHeight / 2;
	}
	static frequency2Pixels(frequency, fps = MidiMonitor.fps(), screenHeight = MidiMonitor.screenHeight()) {
		return frequency <= 0 ? 0 : this.maxFrequency(fps, screenHeight) / frequency;
	}

	static tone2Frequency(toneNumber, bendPercent = 0, bendScale = MidiMonitor.bendScale(), referenceFrequency = 440, referenceNumber = 69) {
		return isNaN(toneNumber) ? 0 : Math.pow(2, (toneNumber + (bendPercent * bendScale) + MidiMonitor.noteOffset() - referenceNumber) / 12) * referenceFrequency;
	}

	static tone2Pixels(toneNumber, bendPercent, bendScale) {
		return MidiMonitor.frequency2Pixels(MidiMonitor.tone2Frequency(toneNumber, bendPercent, bendScale));
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

	static aftertouchPercent(aftertouchRaw) {
		return MidiMonitor.velocity2Opacity(velocity);
	}

	static toneBackgroundSizeString(toneNumber, bendPercent, widthPercent = 1.0, imageScale = MidiMonitor.imageScale()) {
		var widthStr = '' + (widthPercent * 100) + '%';
		var heightStr = '' + (MidiMonitor.tone2Pixels(toneNumber, bendPercent) * imageScale) + 'px';
		return widthStr + ' ' + heightStr;
	}
	
	static toneBackgroundImageString(alpha = 1, imageScale = MidiMonitor.imageScale()) {
		var black = 'hsla(0,0%,0%,' + alpha + ')';
		var white = 'hsla(0,0%,100%,' + alpha + ')';

		var gradientArray = ['to bottom'];
		for(let i = 0; i < imageScale; i++) {
			let percentLower = 100 * (i / imageScale);
			let percentMiddle = 100 * ((i + 0.5) / imageScale);
			let percentUpper = 100 * ((i + 1) / imageScale);
			gradientArray.push(
				black + ' ' + (percentLower == 0 ? '' : percentLower + '%'),
				black + ' ' + percentMiddle + '%',
				white + ' ' + percentMiddle + '%',
				white + ' ' + (percentUpper == 100 ? '' : percentUpper + '%')
			);
		}
		return 'linear-gradient(' + gradientArray.join(', ') + ')';
	}

	constructor(canvas) {
		this.canvas = canvas;
	}

	setVelocityAll(velocity) {
		this.canvas.opacity = MidiMonitor.velocity2Opacity(velocity);
	}

	setTones(tones, bendPercent, aftertouchPercent = null) {
		var backgroundSizeArray = [];
		var backgroundImageArray = [];

		var length = Object.keys(tones).length
		var alpha = 1 / length;

		var i = 0;
		for (let toneNumber in tones) {
			i++;
			let alpha = MidiMonitor.toneAlpha(i, length);

			toneNumber = parseInt(toneNumber);
			let toneVelocity = tones[toneNumber];

			backgroundSizeArray.push(MidiMonitor.toneBackgroundSizeString(toneNumber, bendPercent));
			backgroundImageArray.push(MidiMonitor.toneBackgroundImageString(alpha));
		}

		this.canvas.style.backgroundSize = backgroundSizeArray.join(',');
		this.canvas.style.backgroundImage = backgroundImageArray.join(',');

		if (aftertouchPercent) {
			this.canvas.opacity = aftertouchPercent;
		}
	}
}

class MidiMonitorController {
	constructor(canvas) {
		this.midiMonitor = new MidiMonitor(canvas);
		this.tones = {};
	}

	render() {
		this.midiMonitor.setTones(this.tones, this.bendPercent);
	}

	addTone(toneParam, velocityParam) {
		var toneNumber = toneParam;
		var velocity = velocityParam;
		this.tones[toneNumber] = velocity;
		this.render();
	}

	removeTone(toneParam, velocityParam) {
		var toneNumber = toneParam;
		var velocity = velocityParam;
		delete this.tones[toneNumber];
		this.render();
	}

	setToneAftertouch(toneParam, aftertouchParam) {
		console.warn("Unimplemented Controller: NOTE_AFTERTOUCH");
	}

	setAftertouch(aftertouchParam) {
		this.aftertouchPercent = MidiMonitor.aftertouchPercent(aftertouchParam);
		this.render();
	}

	setBend(bendParam1, bendParam2) {
		var bendRaw = MidiMonitor.bendRaw(bendParam2, bendParam1);
		this.bendPercent = MidiMonitor.bendPercent(bendRaw);
		this.render();
	}
}
