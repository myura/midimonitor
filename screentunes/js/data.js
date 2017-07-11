function MIDI(midiFile, dom = document.body) {
	var mTracks = [];
	dom.className = 'DATA';
	
	var midiFileJoined = new MidiFileJoined(midiFile);
	
	
	for (t in midiFileJoined.header.noteTracks) {
		mTracks[t] = new MIDITrack(dom.appendChild(document.createElement("canvas")));
	}
	var mTicksPerBeat = midiFileJoined.header.ticksPerBeat;
	var mTempoScale = 1.0;
	var eventGroups = midiFileJoined.eventGroups;
	
	
	this.resize = function() {
		for (t in mTracks) {
			mTracks[t].resize(window.innerHeight, window.innerWidth / mTracks.length);
		}
	}
	
	this.render = function() {
		for (t in mTracks) {
			mTracks[t].render();
		}
	}
		
	this.play = function () {
		setTempo();
		playMidi();
	}
	
	
	function noteOn(trackNum, noteNumber, velocity) {
		mTracks[trackNum].noteOn(noteNumber, velocity);
	}
	
	function noteOff(trackNum, noteNumber, velocity) {
		mTracks[trackNum].noteOff(noteNumber, velocity);
	}
	
	function setTempo(microsecondsPerBeat = 500000) {
		mTempoScale = microsecondsPerBeat / mTicksPerBeat / 1000;
	}
	
	function playMidi() {
		var eventGroup = eventGroups.shift();
		for (trackNum in eventGroup.trackEvents) {
			for (e in eventGroup.trackEvents[trackNum]) {
				var event = eventGroup.trackEvents[trackNum][e];
				switch (event.subtype) {
					case 'noteOn':
						noteOn(trackNum, event.noteNumber, event.velocity);
						break;
					case 'noteOff':
						noteOff(trackNum, event.noteNumber, event.velocity);
						break;
					case 'setTempo':
						setTempo(event.microsecondsPerBeat);
						break;
				}
			}
		}
		if (eventGroups.length > 0) {
			setTimeout(
				function() {
					playMidi();
				},
				eventGroups[0].deltaTime * mTempoScale
			);
		}
	}
}
