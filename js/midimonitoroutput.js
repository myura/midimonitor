class MidiMonitorOutput {
	send(data, timestamp = 0) {
		console.error("TO IMPLEMENT: ",  "MidiMonitorOutput.send(", data, ",", timestamp, ")");
	}

	clear() {
		console.error("TO IMPLEMENT: ", "MidiMonitorOutput.clear()");
	}
}

class MidiMonitorScreenOutput extends MidiMonitorOutput{
	constructor(midiMonitorMaster) {
		super();
		this.midiMonitorMaster = midiMonitorMaster;
	}

	send(data, timestamp = 0) {
		this.midiMonitorMaster.send(data);
	}
}
