class MidiMonitorPlayer {
	constructor(midiMonitorOutput) {
		this.midiPlayer = new MIDIPlayer(
			{
				output: midiMonitorOutput
			}
		);
	}

	load(arrayBuffer) {
		this.midiPlayer.load(new MIDIFile(arrayBuffer));
	}

	play(endCallback = null) {
		this.midiPlayer.play(endCallback);
	}

	pause() {
		this.midiPlayer.resume();
	}

	resume(endCallback = null) {
		this.midiPlayer.resume(endCallback);
	}

	stop() {
		this.midiPlayer.stop();
	}
}
