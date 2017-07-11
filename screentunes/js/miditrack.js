function MIDITrack(canvas) {
	this.mCanvas = canvas;
	this.mCtx = this.mCanvas.getContext("2d");
	
	this.toRender = true;
	
	this.notes = {};
	
	this.resize = function(height, width) {
		this.mCanvas.height = height;
		if (width) {
			this.mCanvas.width = width;
		}
	}
	
	this.noteOn = function(note, velocity = 127) {
		this.notes[note] = new MIDINote(note, velocity, 12);
		this.toRender = true;
	}
	
	this.noteOff = function(note, velocity = 127) {
		delete this.notes[note];
		this.toRender = true;
	}
	
	this.render = function() {
		if (this.toRender) {
			clearWave(this.mCtx);
			var totalWaveNum = Object.keys(this.notes).length;
			for (n in this.notes) {
				drawWave(this.mCtx, this.notes[n].wavelength, this.notes[n].value, totalWaveNum);
			}
			this.toRender = false;
		}
	}
	
	function clearWave(ctx) {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}

	function drawWave(ctx, wavelength = 0, value = 1, totalWaveNum = 1, methodWavePattern, compositeOperation = "overlay") {
		if (ctx.canvas && wavelength > 0 && totalWaveNum > 0) {
			var pCanvas = WavePatternCanvas(wavelength, ctx.canvas.width, value, totalWaveNum, methodWavePattern);
			var pattern = ctx.createPattern(pCanvas, 'repeat');
			ctx.fillStyle = pattern;
			//ctx.globalCompositeOperation = compositeOperation;
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		}
	}
}
