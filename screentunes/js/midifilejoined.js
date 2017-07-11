/*
class to join simultaneous parsed .mid file events into groups
(depends on midifile.js)
*/
function MidiFileJoined(midiFile) {
	function MidiTrackEventGroup(deltaTime = 0) {
		this.trackEvents = [];
		this.deltaTime = deltaTime;
		this.addEvent = function(midiEvent, trackNum) {
			if (!(trackNum in this.trackEvents)) {
				this.trackEvents[trackNum] = [];
			}
			this.trackEvents[trackNum].push(midiEvent);
		}
	}
	
	var header = Object.create(midiFile.header);
	var tracks = Object.create(midiFile.tracks);
	
	header.noteTracks = [];
	for (t in midiFile.tracks) {
		var toTrack = false;
		for (e in tracks[t]) {
			if (tracks[t][e].type == 'channel' && tracks[t][e].subtype == 'noteOn') {
				header.noteTracks.push(t);
				break;
			}
		}
	}
	
	var eventGroups = [];
	var theLoop = 1;
	while(theLoop) {
		theLoop = 0;
		var minDeltaTime = undefined;
		for (t in tracks) {
			var event = tracks[t][0];
			if (event && (minDeltaTime == undefined || event.deltaTime < minDeltaTime)) {
				minDeltaTime = event.deltaTime;
			}
		}
		var trackEventGroup = new MidiTrackEventGroup(minDeltaTime);
		for (t in tracks) {
			if (tracks[t][0]) {
				if (tracks[t][0].deltaTime <= minDeltaTime) {
					trackEventGroup.addEvent(tracks[t].shift(), t);
					while(tracks[t][0] && tracks[t][0].deltaTime == 0) {
						trackEventGroup.addEvent(tracks[t].shift(), t);
					}
				}
				else {
					tracks[t][0].deltaTime -= minDeltaTime;
				}
			}
		}
		eventGroups.push(trackEventGroup);
		for (t in tracks) {
			theLoop += tracks[t].length;
		}
	}
	
	return {
		'header': header,
		'eventGroups': eventGroups
	}
}
