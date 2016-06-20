/**
 * @author brais
 */
window.onload = function() {
	var videos = document.querySelectorAll("video[data-subing]");
	for (var i = 0; i < videos.length; i++) {
		var video = videos[i];
		for (var k = 0; k < video.textTracks.length; k++) {
			video.textTracks[k].mode = "hidden";
		}
		var start = function() {
			updateCues(video);
		};
		video.addEventListener("play", start);
	}
	function updateCues(video) {
		var track;
		var cues;
		video.pause();
		tracklist = video.textTracks;
		for (var j = 0; j < tracklist.length; j++) {
			track = tracklist[j];
			if ((j + 1) % 2 == 0) {
				cues = track.cues;
				for (var k = 0; k < cues.length; k++) {
					cues[k].line = 0;
					cues[k].text = "<c.red>" + cues[k].text + "</c>";
				}
			}
			track.mode = "showing";
		}
		video.removeEventListener("play", start);
		video.addEventListener('contextmenu', function(ev) {
			ev.preventDefault();
			hideshowCues(video);
		});
		video.play();
	};
	function hideshowCues(video) {
		var track;
		var cues;
		tracklist = video.textTracks;
		for (var j = 0; j < tracklist.length; j++) {
			if ((j + 1) % 2 == 0) {
				track = tracklist[j];
				if (track.mode == "showing") {
					track.mode = "hidden";
				} else {
					video.pause();
					track.mode = "showing";
				}
			}
		}
	}

};
