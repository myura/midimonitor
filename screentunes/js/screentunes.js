$(document).ready(function() {
	if(FileReader){
		function cancelEvent(e){
			e.stopPropagation();
			e.preventDefault();
			e.dataTransfer.dropEffect = 'link';
		}
		document.body.addEventListener('dragenter', cancelEvent, false);
		document.body.addEventListener('dragover', cancelEvent, false);
		document.body.addEventListener('drop', function(e){
			cancelEvent(e);
			document.getElementById("info").style.display = "none";
			for(var i=0;i<e.dataTransfer.files.length;++i){
				var file = e.dataTransfer.files[i];
				var reader = new FileReader();
				reader.onload = function(e){
					screentunes(MidiFile(e.target.result));
				};
				reader.readAsBinaryString(file);
			}
		}, false);
	}
});

function screentunes(midiFile) {
	var start = null;
	var t = null;
	
	var midi;

	var AnimationFrame = (function() {
		var FPS = 16.6666666667; // 1000 / 60 = Frames Per Second
		var RAF = window.requestAnimationFrame
					|| window.webkitRequestAnimationFrame
					|| window.mozRequestAnimationFrame
					|| window.msRequestAnimationFrame
					|| window.oRequestAnimationFrame
					|| function(a) { window.setTimeout(a, FPS); }
		var CAF = window.cancelAnimationFrame
					|| window.webkitCancelAnimationFrame
					|| window.mozCancelAnimationFrame
					|| window.msCancelAnimationFrame
					|| window.oCancelAnimationFrame
					|| function(a) { window.clearTimeout(a); }
		return {
			request: function(a) {
				RAF(a);
			},
			cancel: function(a) {
				CAF(a);
			}
		}
	})();

	function render() {
		midi.render();
	}

	function frame(timestamp) {
		if (start === null) start = timestamp;
		t = timestamp - start;
		render();
		AnimationFrame.request(frame);
	}

	$(document).ready(function() {
		midi = new MIDI(midiFile);
		$(window).bind("resize", midi.resize);
		midi.resize();
		
		AnimationFrame.request(frame);
		midi.play();
	});
};
