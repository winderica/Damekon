(function () {
    var options = {};
    var api = {
        setVideo: function (videoClass) {
            this.videos = document.getElementsByClassName(videoClass);
        },
        setNumber: function (number) {
            this.number = number;
        },
        setPlayButton: function (buttonClass) {
            this.playButtonClass = buttonClass;
        },
        togglePlaying: function () {
            var videos = this.videos,
                buttonClass = this.playButtonClass;
            for (var i = 0; i < this.number; i++) {
                videos[i].controls = false;
            }
            var playButtons = document.getElementsByClassName(buttonClass);
            for (i = 0; i < this.number; i++) {
                playButtons[i].addEventListener("click", this.updatePlayClass(buttonClass, videos[i], playButtons[i], i));
                videos[i].addEventListener("timeupdate", this.updateProgress(videos[i], i));
            }
        },
        updatePlayClass: function (buttonClass, video, play, i) {
            return function () {
                if (video.paused || video.ended) {
                    play.className = buttonClass + " pause";
                    video.play();
                    if (i === 0) {
                        document.getElementsByClassName("small-video")[0].play();
                    }
                } else {
                    play.className = buttonClass + " play";
                    video.pause();
                    if (i === 0) {
                        document.getElementsByClassName("small-video")[0].pause();
                    }
                }
            }
        },
        updateProgress: function (video, i) {
            return function () {
                var progress = document.getElementsByClassName("progress")[i],
                    time = document.getElementsByClassName("time")[i],
                    value = 0,
                    presentMinutes,
                    presentSeconds,
                    totalMinutes,
                    totalSeconds;
                presentMinutes = parseInt(video.currentTime / 60);
                presentSeconds = parseInt(video.currentTime % 60);
                totalMinutes = parseInt(video.duration / 60);
                totalSeconds = parseInt(video.duration % 60);
                function format(t) {
                    if (t < 10) {
                        t = "0" + t;
                    }
                    return t;
                }
                presentSeconds = format(presentSeconds);
                totalSeconds = format(totalSeconds);
                if (totalSeconds) {
                    time.innerHTML = presentMinutes + ":" + presentSeconds + "/" + totalMinutes + ":" + totalSeconds;
                }
                if (video.currentTime > 0) {
                    value = (100 / video.duration) * video.currentTime;
                }
                progress.style.width = value + "%";
            }
        },
        changeVolume: function () {
            var volumeRanges = document.getElementsByClassName("volume-range"),
                volumeButtons = document.getElementsByClassName("volume");
            for (var i = 0; i < this.number; i++) {
                volumeRanges[i].addEventListener("change", this.updateVolume(this.videos[i], volumeRanges[i]));
                volumeButtons[i].addEventListener("click", this.updateMuteButton(this.videos[i], volumeButtons[i]))
            }
        },
        updateVolume: function (video, range) {
            return function () {
                video.volume = range.value;
            }
        },
        updateMuteButton: function (video, button) {
            return function () {
                if (!video.muted) {
                    button.className = "command off volume";
                } else {
                    button.className = "command on volume";
                }
                video.muted = !video.muted;
            }
        },
        fullScreen: function () {
            var fullButtons = document.getElementsByClassName("full"),
                playInfos = document.getElementsByClassName("play-info"),
                number = this.number,
                videos = this.videos;
            for (var i = 0; i < number; i++) {
                fullButtons[i].addEventListener("click", this.toggleFull(videos[i]));
            }
            document.addEventListener("fullscreenchange", function () {
                for (i = 0; i < number; i++) {
                    if (document.fullscreenElement) {
                        playInfos[i].style.position = "fixed";
                    } else {
                        playInfos[i].style.position = "relative";
                    }
                }
            })
        },
        toggleFull: function (video) {
            return function () {
                if (!document.fullscreenElement) {
                    video.requestFullscreen();
                } else {
                    document.exitFullscreen();
                }
            }
        },
        showFloatingVideo: function () {
            var video = this.videos[0],
                small = document.getElementsByClassName("small-video-container")[0];
            window.addEventListener("scroll", function () {
                var toTop = video.getBoundingClientRect().top;
                if (toTop + video.offsetHeight < 0) {
                    small.style.display = "block";
                } else {
                    small.style.display = "none";
                }
            })
        },
        dragVideo: function () {
            var drag = document.getElementsByClassName("drag-bar")[0],
                small = document.getElementsByClassName("small-video-container")[0],
                x1 = 0, x2 = 0, y1 = 0, y2 = 0;
            drag.addEventListener("mousedown", dragMouseDown);
            function dragMouseDown(e) {
                e = e || window.event;
                x2 = e.clientX;
                y2 = e.clientY;
                window.addEventListener("mousemove", elementDrag);
                window.addEventListener("mouseup", closeDragElement)
            }
            function elementDrag(e) {
                e = e || window.event;
                x1 = x2 - e.clientX;
                y1 = y2 - e.clientY;
                x2 = e.clientX;
                y2 = e.clientY;
                small.style.top = (small.offsetTop - y1) + "px";
                small.style.left = (small.offsetLeft - x1) + "px";
            }
            function closeDragElement() {
                window.removeEventListener("mouseup", closeDragElement);
                window.removeEventListener("mousemove", elementDrag);
            }
        },
        resizeVideo: function () {
            var small = document.getElementsByClassName("small-video")[0],
                resize = document.getElementsByClassName("resize-bar")[0],
                x, y, w, h;
            resize.addEventListener("mousedown", resizeMouseDown);
            function resizeMouseDown(e) {
                e = e || window.event;
                x = e.clientX;
                y = e.clientY;
                w = small.offsetWidth;
                h = small.offsetHeight;
                window.addEventListener("mousemove", elementResize);
                window.addEventListener("mouseup", closeResizeElement)
            }
            function elementResize(e) {
                e = e || window.event;
                small.style.width = (w + e.clientX - x) + "px";
                small.style.height = (h + e.clientY - y) + "px";
            }
            function closeResizeElement() {
                window.removeEventListener("mouseup", closeResizeElement);
                window.removeEventListener("mousemove", elementResize);
            }
        },
        closeSmallVideo: function () {
            var close = document.getElementsByClassName("close")[0];
            close.addEventListener("click", function () {
                document.getElementsByClassName("small-video-container")[0].style.visibility = "hidden";
            })
        },
        sendDanmaku: function () {
            var sendButton = document.getElementsByClassName("send")[0],
                danmakuContent = document.getElementsByClassName("danmaku-content")[0];
                danmakuList = [];
            sendButton.addEventListener("click", function () {
                danmakuList.push(danmakuContent.value);
                localStorage.setItem('danmakuList', danmakuList);
                danmakuContent.value = null;
            })
        },
        launch: function () {
            this.togglePlaying();
            this.changeVolume();
            this.fullScreen();
            this.showFloatingVideo();
            this.dragVideo();
            this.resizeVideo();
            this.closeSmallVideo();
            this.sendDanmaku();
        }
    };
    this.danmakuPlayer = api;
})();

danmakuPlayer.setVideo("video");
danmakuPlayer.setNumber(1);
danmakuPlayer.setPlayButton("command playpause");
danmakuPlayer.launch();
