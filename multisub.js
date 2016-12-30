/**
 * @author brapifra
 */
(function () {
    var videos;
    var maxSubNum=3;//config here
    document.addEventListener("DOMContentLoaded", function () {
        videos = document.querySelectorAll("video[data-multisub]");
        for (var i = 0; i < videos.length; i++) {
            var video = videos[i];
            video.addEventListener(
                'dragenter'
                ,
                function (e) {
                    e.preventDefault();
                }, false)
            ;
            video.addEventListener(
                'dragover'
                ,
                function (e) {
                    e.preventDefault();
                }, false)
            ;
            video.addEventListener(
                'drop'
                , function (e) {
                    soltado(e, this);
                },
                false)
            ;
            for (var j = 0; j < video.textTracks.length; j++) {
                if (j > maxSubNum-1) {
                    var tracktoremove = video.querySelectorAll("track")[j];
                    video.removeChild(tracktoremove);
                    continue;
                }
                video.textTracks[j].mode = "hidden";
            }
            var attr = document.createAttribute("data-subnum");
            attr.value = 0;
            video.setAttributeNode(attr);
            video.addEventListener("play", function (e) {
                e.target.removeEventListener(e.type, arguments.callee);
                return prepareTracks(this, true);
            });
        }
    });
    function prepareTracks(video, listener) {
        var colors = video.dataset.multisub.split(",");
        var tracklist;
        var track;
        var cues;
        video.pause();
        tracklist = video.textTracks;
        for (var i = 0; i < tracklist.length; i++) {
            track = tracklist[i];
            //track.mode = "hidden";
            cues = track.cues;
            for (var j = 0; j < cues.length; j++) {
                if (i == 1) {
                    cues[j].line = 1;
                } else {
                    cues[j].line = "auto";
                }
                if (cues[j].text.match(/<c.[a-z]+>/)) {
                    cues[j].text = cues[j].text.replace(/<c.[a-z]+>/, "<c." + colors[i] + ">");
                } else {
                    cues[j].text = "\<c." + colors[i] + ">" + cues[j].text + "\</c>";
                }
            }
            track.mode = "showing";
        }
        if (listener == true) {
            video.addEventListener('contextmenu', function (ev) {
                ev.preventDefault();
                hideshowCues(this);
            });
        }
        video.play();
    }

    function hideshowCues(video) {
        var tracklist;
        var track;
        tracklist = video.textTracks;
        for (var i = 0; i < tracklist.length; i++) {
            if (i == 0) {
                continue;
            }
            track = tracklist[i];
            if (track.mode == "showing") {
                track.mode = "hidden";
            } else {
                video.pause();
                track.mode = "showing";
            }
        }
    }

    function soltado(e, video) {
        e = e || window.event;
        if (e.preventDefault) {
            e.preventDefault();
        }
        var dt = e.dataTransfer;
        var files = dt.files;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            dragLoad(file, video);
        }
        return false;
    }

    function dragLoad(file, video) {
        var track;
        var parts = [];
        var ini = [];
        var end = [];
        var type = file.name.split('.').pop();
        if (type == "srt" || type == "vtt") {
            video.pause();
            var regex;
            if (type == "srt") {
                regex = /[0-9]+:[0-9]+:[0-9]+,[0-9]+\s-->\s[0-9]+:[0-9]+:[0-9]+,[0-9]+/g;
            } else {
                regex = /[0-9]+:[0-9]+:[0-9]+.[0-9]+\s-->\s[0-9]+:[0-9]+:[0-9]+.[0-9]+/g
            }
            if (video.textTracks.length == 2) {
                track = video.textTracks[video.dataset.subnum % 2];
                video.dataset.subnum++;
                track.src = "";
                track.mode = "hidden";
                while (track.cues.length > 0) {
                    track.removeCue(track.cues[0]);
                }
            } else {
                video.addTextTrack("subtitles");
                var x = video.textTracks.length - 1;
                track = video.textTracks[x];
                track.mode = "hidden";
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                var txt = e.target.result.split("\n", -1);
                var texto = "";
                for (var i = 0; i < txt.length; i++) {
                    if (!isNaN(txt[i])) {
                        continue;
                    }
                    if (txt[i].match(regex)) {
                        var linea = txt[i].replace(/,/g, ".");
                        parts = linea.split("-->");
                        ini = parts[0].split(":");
                        end = parts[1].split(":");
                        continue;
                    }
                    if (txt[i]) {
                        if (texto) {
                            texto += "<br>" + txt[i];
                        } else {
                            texto += txt[i];
                        }
                        if (txt[i + 1] == "\r" || txt[i + 1] == "") {
                            track.addCue(new VTTCue((parseFloat(ini[0] * 3600) + parseFloat(ini[1] * 60) + parseFloat(ini[2])), (parseFloat(end[0] * 3600) + parseFloat(end[1] * 60) + parseFloat(end[2])), texto));
                            texto = "";
                        }
                    }
                }
                prepareTracks(video, false);
            }
            ;
            reader.readAsText(file);
        } else {
            console.log("mal archivo");
        }
    }
})();
