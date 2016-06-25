/**
 * @author brapifra
 */
(function () {
    var videos;
    var video;
    var tracklist;
    var track;
    var cues;
    var colors = [];
    window.onload = function () {
        videos = document.querySelectorAll("video[data-multisub]");
        for (var i = 0; i < videos.length; i++) {
            video = videos[i];
            colors = video.dataset.multisub.split(",");
            for (var j = 0; j < video.textTracks.length; j++) {
                video.textTracks[j].mode = "hidden";
            }
            var start = function () {
                updateCues();
            };
            video.addEventListener("play", start);
        }
        function updateCues() {
            video.pause();
            tracklist = video.textTracks;
            for (var i = 0; i < tracklist.length; i++) {
                track = tracklist[i];
                cues = track.cues;
                for (var j = 0; j < cues.length; j++) {
                    if ((i + 1) % 2 == 0) {
                        cues[j].line = 1;
                    }
                    cues[j].text = "<c." + colors[i] + ">" + cues[j].text + "</c.>";
                }
                track.mode = "showing";
            }
            video.removeEventListener("play", start);
            video.addEventListener('contextmenu', function (ev) {
                ev.preventDefault();
                hideshowCues();
            });
            video.play();
        };
        function hideshowCues() {
            tracklist = video.textTracks;
            for (var i = 0; i < tracklist.length; i++) {
                if (i == 0) {
                    continue;
                }
                track = tracklist[ij];
                if (track.mode == "showing") {
                    track.mode = "hidden";
                } else {
                    video.pause();
                    track.mode = "showing";
                }
            }
        }
    };
})();
