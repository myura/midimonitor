function ValueColor(value = 0, totalWaveNum = 1) {
	var lum = Math.cbrt(value) * 100;
	var alpha = 0.5 + (0.5/totalWaveNum);
	this.color = 'hsla(' + 0 + ',' + 0 + '%,' + lum + '%,' + alpha + ')';
	this.noColor = 'hsla(' + 0 + ',' + 0 + '%,' + 0 + '%,' + alpha + ')';
}


function WavePatternCanvas(wavelength, width, value, totalWaveNum, methodWavePattern = squareWavePattern) {
	var pCanvas = document.createElement('canvas');
	pCanvas.height = wavelength;
	pCanvas.width = width;
	
	var pCtx = pCanvas.getContext('2d');
	methodWavePattern(pCtx, new ValueColor(value, totalWaveNum));
	
	return pCanvas;
}


function squareWavePattern(ctx, valueColor) {
	ctx.fillStyle = valueColor.noColor;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height / 2);
	ctx.fillStyle = valueColor.color;
	ctx.fillRect(0, ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height);
}

function sawtoothWavePattern(ctx, valueColor) {
	var grd = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
	grd.addColorStop(0, valueColor.noColor);
	grd.addColorStop(1, valueColor.color);
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function triangleWavePattern(ctx, valueColor) {
	var grd = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
	grd.addColorStop(0, valueColor.noColor);
	grd.addColorStop(0.5, valueColor.color);
	grd.addColorStop(1, valueColor.noColor);
	ctx.fillStyle = grd;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/*
function whiteNoisePattern(ctx, valueColor) {
	var line = 0;
	var length = 1;
	while (line < ctx.canvas.height) {
		var vColor = new ValueColor(value * Math.random(), totalWaveNum);
		ctx.fillStyle = vColor.color;
		ctx.fillRect(0, line, ctx.canvas.width, line += length);
	}
}

function testNoisePattern(ctx, valueColor, maxLength = 10) {
	var line = 0;
	while (line < ctx.canvas.height) {
		var vColor = new ValueColor(value * Math.random(), totalWaveNum);
		ctx.fillStyle = vColor.color;
		var length = Math.random() * (maxLength);
		ctx.fillRect(0, line, ctx.canvas.width, line += length);
	}
}
*/
