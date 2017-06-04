class RtxUtil {
	static get CONTROL_NAMES() {
		return {
			o: 'SCALE',
			d: 'DURATION',
			b: 'BPM',
			s: 'STYLE',
			l: 'LOOPS'
		};
	}

	static get NOTE_NUMBER() {
		return {
			p: NaN,
			a: 21,
			h: 23,
			c: 12,
			d: 14,
			e: 16,
			f: 17,
			g: 19
		};
	}

	static get STYLE_DURATIONS() {
		return {
			s: 0.4,
			n: 0.8,
			c: 0.99
		};
	}


	static scale(scale) {
		scale = parseInt(scale) || 6;
		return scale;
	}

	static duration(duration) {
		duration = parseInt(duration) || 4;
		if (duration <= 1) {
			duration = 1;
		}
		return duration;
	}

	static bpm(bpm) {
		bpm = parseInt(bpm) || 63;
		if (bpm <= 1) {
			bpm = 1;
		}
		return bpm;
	}

	static style(style) {
		style = style in this.STYLE_DURATIONS ? style : 'n';
		return style;
	}

	static loops(loops) {
		loops = parseInt(loops) || 0;
		if (loops >= 15) {
			loops = Infinity;
		} else if (loops <= 0) {
			loops = 0;
		}
		return loops;
	}


	

	static noteNumber(note) {
		var noteNumber = Number(this.NOTE_NUMBER[note.charAt(0)] || this.NOTE_NUMBER['p']);
		return isNaN(noteNumber) ? noteNumber : noteNumber + (note.split('#').length - 1);
	}

	static scaleNumber(scale) {
		return (this.scale(scale) - 2) * 12;
	}

	static noteScaleNumber(note, scale) {
		return this.noteNumber(note) + this.scaleNumber(scale);
	}

	static noteFrequency(noteNumber, referenceFrequency = 440, referenceNumber = 69) {
		return isNaN(noteNumber) ? 0 : Math.pow(2, (noteNumber - referenceNumber) / 12) * referenceFrequency;
	}

	static beats(duration, dot) {
		return (4 / duration) * this.dotMultiplier(dot);
	}

	static dotMultiplier(dot) {
		return 2 - (1 / Math.pow(2, dot.split('.').length - 1));
	}

	static durationTime(beats, bpm) {
		return beats / bpm * 60;
	}

	static durationStyleTime(duration, style) {
		return duration * this.STYLE_DURATIONS[this.style(style)];
	}
}
