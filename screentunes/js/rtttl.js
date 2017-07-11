function Command(note, scale, duration, specialDuration = undefined) {
	this.duration = duration;
	this.note = note.toLowerCase();
	this.scale = scale;
	this.specialDuration = specialDuration;
	Command.noteNames = {
		'c':	0,
		'c#':	1,
		'd':	2,
		'd#':	3,
		'e':	4,
		'f':	5,
		'f#':	6,
		'g':	7,
		'g#':	8,
		'a':	9,
		'a#':	10,
		'b':	11,
		'h':	11,
		'p':	null
	}
}

Command.prototype.midiNote = function() {
	mNote = Command.noteNames[this.note.toLowerCase()];
	return typeof mNote === 'number' ? 12 * (this.scale + 1) + mNote : null;
}

Command.prototype.midiDuration = function(bpm, beatDuration = 4) {
	mDuration = (60 / bpm  * 1000) * (beatDuration / this.duration);
	return this.specialDuration ? mDuration * 1.5 : mDuration;
}

Command.prototype.toString = function() {
	str = this.duration + this.note + this.scale + (this.specialDuration ? '.' : '');
	return str;
}

Command.prototype.midi = function(bpm) {
	return {
		'note': this.midiNote(),
		'duration': this.midiDuration(bpm),
	};
}

function RTTTL(str) {
	this.name = '';
	this.defDuration = 4;
	this.defScale = 6;
	this.bpm = 63;
	this.commands = [];
	str ? this.string(str) : false;
}

RTTTL.prototype.string = function(str) {
	var strArray = str.split(':');
	this.nameString(strArray[0]);
	this.defaultsString(strArray[1]);
	this.addCommandsString(strArray[2]);
}

RTTTL.prototype.nameString = function(str) {
	this.name = str.trim();
}

RTTTL.prototype.defaultDuration = function(defDuration) {
	this.defDuration = defDuration;
}

RTTTL.prototype.defaultScale = function(defScale) {
	this.defScale = defScale;
}

RTTTL.prototype.beatsPerMinute = function(bpm) {
	this.bpm = bpm;
}

RTTTL.prototype.defaultsString = function(str) {
	str = str.replace(/\s+/g, "");
	var strArray = str.split(',');
	var myRegexp = /^([dob])=(\d*)$/;
	for (var i in strArray) {
		var match = myRegexp.exec(strArray[i]);
		if (match && match[1] && match[2]) {
			switch (match[1].toLowerCase()) {
				case 'd':
					this.defaultDuration(parseInt(match[2]));
					break;
				case 'o':
					this.defaultScale(parseInt(match[2]));
					break;
				case 'b':
					this.beatsPerMinute(parseInt(match[2]));
					break;
			}
		}
	}
}

RTTTL.prototype.addCommand = function(note, scale = this.defScale, duration = this.defDuration, specialDuration = undefined) {
	this.commands.push(new Command(note, scale, duration, specialDuration));
}

RTTTL.prototype.addCommandString = function(str) {
	var myRegexp = /^(\d*)([A-Ha-hPp]#?)(\d*)(\.?)$/;
	var match = myRegexp.exec(str);
	if (match) {
		var duration = match[1] ? parseInt(match[1]) : this.defDuration;
		var note = match[2];
		var scale = match[3] ? parseInt(match[3]) : this.defScale;
		var specialDuration = match[4] ? match[4] : undefined;
		this.addCommand(note, scale, duration, specialDuration);
	}
}

RTTTL.prototype.addCommandsString = function(str) {
	str = str.replace(/\s+/g, "");
	var strArray = str.split(',');
	for(var i in strArray) {
		this.addCommandString(strArray[i]);
	}
}

RTTTL.prototype.midi = function() {
	midiArray = [];
	for(var i in this.commands) {
		midiArray.push(this.commands[i].midi(this.bpm));
	}
	return midiArray;
}

RTTTL.prototype.toString = function() {
	return this.name.toString() + ':' + 'd=' + this.defDuration.toString() + 'o=' + this.defScale.toString() + 'b=' + this.bpm.toString() + ':' + this.commands.toString();
}
