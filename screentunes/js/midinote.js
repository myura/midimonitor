function MIDINote(noteNum, velocity, transposition = 0) {
	this.value = velocityValue(velocity);
	this.wavelength = noteNumberToWavelength(noteNum + transposition);
	
	
	function velocityValue(velocity, maxVelocity = 127, minVelocity = 0) {
		//return (velocity - minVelocity) / (maxVelocity - minVelocity);
		return maxVelocity;
	}

	function minFrequency() {
		return 60;
	}

	function maxFrequency(screenHeight) {
		return minFrequency() * screenHeight / 2;
	}

	function noteNumberToFrequency(noteNum, refFreq = 440, refNum = 69) {
		return typeof noteNum == 'number' ? Math.pow(2, (noteNum - refNum) / 12) * refFreq : 0;
	}

	function frequencyToWavelength(freq, screenHeight = screen.height) {
		return freq > 0 ? maxFrequency(screenHeight) / freq : 0;
	}

	function noteNumberToWavelength(noteNum, screenHeight) {
		return frequencyToWavelength(noteNumberToFrequency(noteNum));
	}
}
