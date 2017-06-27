class MidiMonitor {
	static freq2Px(frequency, screenHeight = window.screen.height, fps = 60) {
		var minFrequency = fps;
		var maxFrequency = minFrequency * screenHeight / 2;
		return frequency > 0 ? maxFrequency / frequency : 0;
	}

	constructor(canvas) {
		this.canvas = canvas;
	}

	setFrequency(frequency) {
		var size = MidiMonitor.freq2Px(frequency);
		this.canvas.style.backgroundSize = '100% ' + size + 'px';
	}

	setVelocity(velocity) {
		var opacity = velocity;
		this.canvas.opacity = opacity;
	}
}
