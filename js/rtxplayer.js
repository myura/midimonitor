class RtxPlayer {
	constructor() {
		this.audioContext = new window.AudioContext();

		this.gainNode = this.audioContext.createGain();
		this.gainNode.connect(this.audioContext.destination);
		this.setGain();
	}

	setGain(gain = 0.005) {
		this.gainNode.gain.value = gain;
	}

	playTones(rtx) {
		if (this.isPlaying) {
			this.oscillatorNode.stop();
			this.isPlaying = false;
		}
		else {
			this.oscillatorNode = this.audioContext.createOscillator();
			this.oscillatorNode.type = 'square';
			this.oscillatorNode.frequency.value = 0;
			this.oscillatorNode.connect(this.gainNode);

			var relativeTime = this.audioContext.currentTime;
			for (let rtxLoop = 0; rtxLoop <= rtx.controls.LOOPS; rtxLoop++) {
				for (let rtxTone of rtx.tones) {
					this.oscillatorNode.frequency.setValueAtTime(rtxTone.noteFrequency, relativeTime);
					this.oscillatorNode.frequency.setValueAtTime(0, relativeTime + rtxTone.durationStyleTime);
					relativeTime += rtxTone.durationTime;
				}
			}
			this.oscillatorNode.start();
			this.oscillatorNode.stop(relativeTime);
			this.isPlaying = true;
		}

		return this.isPlaying;
	}
}
