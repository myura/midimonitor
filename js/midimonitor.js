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
		//this.canvas.style.backgroundImage = Array(16).fill('linear-gradient(to bottom, black, black 50%, white 50%, white)').join(',');
		//this.canvas.style.backgroundImage = Array(16).fill('linear-gradient(to bottom, hsla(0,0,0,1), hsla(0,0,0,1) 50%, hsla(0,0,,0) 50%, hsla(0,0,0,0))').join(',');
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
		var backgroundImageArray = [];

		var length = Object.keys(tones).length
		var percent = 1 / length;

		for (let toneNumber in tones) {
			backgroundSizeArray.push(MidiMonitor.toneBackgroundSize(tones[toneNumber]));
			backgroundImageArray.push(MidiMonitor.toneBackgroundImage(percent));
		}
		this.canvas.style.backgroundSize = backgroundSizeArray.join(',');
		this.canvas.style.backgroundImage = backgroundImageArray.join(',');
	}


	static toneBackgroundSize(tone, widthPercent = 1) {
		return '' + (widthPercent * 100) + '% ' + MidiMonitor.frequency2Pixels(tone.frequency) + 'px';
	}

	static toneBackgroundImage(alpha = 1) {
		var black = 'hsla(0, 0%, 0%, ' + alpha + ')';
		var white = 'hsla(0, 0%, 100%, ' + alpha + ')';
		return 'linear-gradient(to bottom, ' + black + ', ' + black + ' 50%, ' + white + ' 50%, ' + white + ')';
	}

}

class MidiMonitorMaster {
	constructor(canvas) {
		this.canvas = canvas;
	}


}
