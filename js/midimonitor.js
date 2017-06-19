class MidiMonitor {
	constructor(canvas) {
		this.canvas = canvas;
		this.tempVar = false;
	}

	doit() {
		if (this.tempVar) {
			note('30px', 0.8)
		}
		else {
			note('50px', 0.3)
		}
		this.tempVar = !this.tempVar;
	}

	setPitch() {

	}
}


function midiMonitorElement() {
	var elementId = 'midimonitor';
	return document.getElementById(elementId)
}

function midiMonitorStyle() {
	var elementId = 'midimonitor';
	return document.getElementById(elementId).style
}

function screenHeight() {
	return window.screen.height
}


function duration(time) {
	midiMonitorStyle().transitionDuration = time;
}

function pitch(size) {
	midiMonitorStyle().backgroundSize = "100% " + size;
}

function velocity(opacity) {
	midiMonitorStyle().opacity = opacity;
}


function heightStyleString(pitch) {
	var size = pitch;
	return `background-size: 100% ${size}px;`
}
function opacityStyleString(opacity) {
	return `opacity: ${opacity};`
}



function note(pitch, velocity = 100) {

	midiMonitorElement().setAttribute('style', heightStyleString(pitch) + opacityStyleString(velocity));
}


