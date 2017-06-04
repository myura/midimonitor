class RtxTone {
	constructor(duration, note, scale, dot, bpm, style) {
		this.duration = duration;
		this.note = note;
		this.scale = scale;
		this.dot = dot;
		this.bpm = bpm;
		this.style = style;
	}

	get duration() {
		return this._duration;
	}
	set duration(duration) {
		this._duration = RtxUtil.duration(duration);
	}

	get note() {
		return this._note;
	}
	set note(note) {
		this._note = note;				/////////////////////////////////////////////////////////////////////////////////////////////////
	}

	get scale() {
		return this._scale;
	}
	set scale(scale) {
		this._scale = RtxUtil.scale(scale);
	}

	get dot() {
		return this._dot;
	}
	set dot(dot) {
		this._dot = dot;				/////////////////////////////////////////////////////////////////////////////////////////////////
	}

	get bpm() {
		return this._bpm;
	}
	set bpm(bpm) {
		this._bpm = RtxUtil.bpm(bpm);
	}

	get style() {
		return this._style;
	}
	set style(style) {
		this._style = RtxUtil.style(style);
	}

	get beats() {
		return RtxUtil.beats(this.duration, this.dot);
	}

	get durationTime() {
		return RtxUtil.durationTime(this.beats, this.bpm);
	}

	get durationStyleTime() {
		return RtxUtil.durationStyleTime(this.durationTime, this.style);
	}

	get noteNumber() {
		return RtxUtil.noteScaleNumber(this.note, this.scale);
	}

	get noteFrequency() {
		return RtxUtil.noteFrequency(this.noteNumber);
	}
}


class RtxControl {
	constructor(value) {
		this.value = value;
	}

	get value() {
		return this._value;
	}
	set value(value) {
		this._value = this._setValue(value);
	}
}

var CONTROL_CLASSES = {
	SCALE: class extends RtxControl {
		_setValue(value) {
			return RtxUtil.scale(value);
		}
	},

	DURATION: class extends RtxControl {
		_setValue(value) {
			return RtxUtil.duration(value);
		}
	},

	BPM: class extends RtxControl {
		_setValue(value) {
			return RtxUtil.bpm(value);
		}
	},

	STYLE: class extends RtxControl {
		_setValue(value) {
			return RtxUtil.style(value);
		}
	},

	LOOPS: class extends RtxControl {
		_setValue(value) {
			return RtxUtil.loops(value);
		}
	}
}













class Rtx {
	constructor(rtxString) {
		this.title = '';
		this.controls = [];
		this.tones = [];
		this.parseString(rtxString);
	}

	parseString(rtxString) {
		if (rtxString) {
			let rtxArray = rtxString.replace(/\s+/g, '').split(':');

			this.title = this.constructor.titleSectionReader(rtxArray[0]);
			this.controls = this.constructor.controlSectionReader(rtxArray[1].toLowerCase());
			this.tones = this.constructor.toneSectionReader(this.controls, rtxArray[2].toLowerCase());
		}
	}

	static titleSectionReader(titleSectionStr) {
		return titleSectionStr;
	}

	static controlSectionReader(controlSectionStr) {
		var controls = [];
		for (let controlNameStr in RtxUtil.CONTROL_NAMES) {
			let [controlName, controlValue] = this.controlPair(controlNameStr);
			controls[controlName] = controlValue;
		}

		var controlSectionArray = controlSectionStr.split(',');
		for (let controlPairIndex in controlSectionArray) {
			let [controlName, controlValue] = this.controlPairReader(controlSectionArray[controlPairIndex], false);
			controls[controlName] = controlValue;
		}

		return controls;
	}

	static controlPairReader(controlPairStr, isToneSectionBool) {
		var controlArray = controlPairStr.match(/^(\w)=?(\w+)$/);

		if (controlArray) {
			let controlNameStr = controlArray[1];
			let controlValueStr = controlArray[2];
			return this.controlPair(controlNameStr, controlValueStr);
		}
	}
	static controlPair(controlNameStr, controlValueStr) {
		var controlName = RtxUtil.CONTROL_NAMES[controlNameStr];
		var controlValue = new CONTROL_CLASSES[controlName](controlValueStr).value;
		return [controlName, controlValue];
	}

	static toneSectionReader(controls, toneSectionStr) {
		var tones = [];

		var toneSectionArray = toneSectionStr.split(',');
		for (let toneCommand of toneSectionArray) {
			tones.push(this.toneCommandReader(controls, toneCommand));

		}

		return tones;
	}

	static toneCommandReader(controls, toneCommandStr) {
		var toneArray = toneCommandStr.match(/^(\d*)(\w#?)(\d*)(\.*)$/);
		if (toneArray) {
			let toneDurationStr = toneArray[1];
			let toneNoteStr = toneArray[2];
			let toneScaleStr = toneArray[3];
			let toneDotStr = toneArray[4];

			return this.toneCommand(controls, toneDurationStr, toneNoteStr, toneScaleStr, toneDotStr);
		}
	}

	static toneCommand(controls, toneDurationStr, toneNoteStr, toneScaleStr, toneDotStr) {
		var tone = new RtxTone();

		tone.duration = toneDurationStr ? toneDurationStr : controls.DURATION;
		tone.note = toneNoteStr;
		tone.scale = toneScaleStr ? toneScaleStr : controls.SCALE;
		tone.dot = toneDotStr;
		tone.bpm = controls.BPM;
		tone.style = controls.STYLE;

		return tone;
	}


}






