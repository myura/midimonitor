class RtxPlayer {
	constructor(midiMonitor) {
		this.isPlaying = false;
	}

	setGain(gain = 1) {
		this._setGain(Math.max(Math.min(gain, 1), 0));
	}
	_setGain(gain) {
		console.warn("TO IMPLEMENT: " + "_setGain");
	}

	playTones(rtx) {
		if (this.isPlaying) {
			this._stopTones(rtx)
			this.isPlaying = false;
		} else {
			this._playTones(rtx);
			this.isPlaying = true;
		}
		return this.isPlaying;
	}
	_playTones(rtx) {
		console.warn("TO IMPLEMENT: " + "_playTones");
	}

	_stopTones() {
		console.warn("TO IMPLEMENT: " + "_stopTones");
	}
}

class RtxSoundPlayer extends RtxPlayer {
	constructor(midiMonitor) {
		super();
		this.audioContext = new window.AudioContext();

		this.gainNode = this.audioContext.createGain();
		this.gainNode.connect(this.audioContext.destination);
		this.setGain();
	}

	_setGain(gain) {
		this.gainNode.gain.value = gain * 0.1;
	}

	_playTones(rtx) {
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

	_stopTones() {
		this.oscillatorNode.stop();
	}
}

class RtxMonitorPlayer extends RtxPlayer {
	constructor(midiMonitor) {
		super();
		this.midiMonitor = midiMonitor;
		this.timeoutIds = [];
	}

	_setGain(gain) {
		this.midiMonitor.setVelocity(gain);
	}

	_playTones(rtx) {
		var totalTimeout = 0;
		for (let rtxLoop = 0; rtxLoop <= rtx.controls.LOOPS; rtxLoop++) {
			for (let rtxTone of rtx.tones) {
				this.timeoutIds.push(window.setTimeout(function(frequency) {
					this.midiMonitor.setFrequency(frequency);
				}, totalTimeout, rtxTone.noteFrequency));
				this.timeoutIds.push(window.setTimeout(function(frequency) {
					this.midiMonitor.setFrequency(frequency);
				}, totalTimeout + (rtxTone.durationStyleTime * 1000), 0));
				totalTimeout += rtxTone.durationTime * 1000;
			}
		}
	}

	_stopTones() {
		this.timeoutIds.forEach(function(item) {
			 window.clearTimeout(item);
		});
		this.timeoutIds = [];
		this.midiMonitor.setFrequency(0);
	}
}
