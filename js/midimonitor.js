class MidiMonitor {
	static minFrequency(fps) {
		return fps;
	}
	static maxFrequency(fps, screenHeight) {
		return fps * screenHeight / 2;
	}
	static frequency2Pixels(frequency, fps = 60, screenHeight = window.screen.height) {
		return frequency <= 0 ? 0 : this.maxFrequency(fps, screenHeight) / frequency;
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

	constructor(canvas) {
		this.canvas = canvas;

		//var derp = 'linear-gradient(to bottom, black, black 50%, white 50%, white)';
		this.canvas.style.backgroundImage = Array(16).fill('linear-gradient(to bottom, black, black 50%, white 50%, white)').join(',');
	}

	setFrequency(frequency) {
		this.canvas.style.backgroundSize = '100% ' + MidiMonitor.frequency2Pixels(frequency) + 'px';
	}

	setVelocity(velocity) {
		//this.canvas.opacity = MidiMonitor.velocity2Opacity(velocity);
	}

	setVelocityAll(velocity) {
		this.canvas.opacity = MidiMonitor.velocity2Opacity(velocity);
	}

	setTones(tones) {
		var backgroundSizeArray = [];
		var backgroundPositionArray = [];

		var length = Object.keys(tones).length
		var percent = 100 / length;
		let i = 1;

		for (let toneNumber in tones) {
			backgroundSizeArray.push('' + (i * percent) + '% ' + MidiMonitor.frequency2Pixels(tones[toneNumber].frequency) + 'px');
			i++;
		}
		this.canvas.style.backgroundSize = backgroundSizeArray.join(',');
	}
}

class MidiMonitorMaster {
	constructor(canvas) {
		this.canvas = canvas;
	}


}
