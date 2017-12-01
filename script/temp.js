(function (window) {

    /**
     * represents a danmaku player.
     * @constructor
     * @param className - the class name of the video container
     * @param i - the index of current video
     */
    function DanmakuPlayer(className, i) {
        this.className = className;
        this.videoContainer = document.getElementsByClassName(this.className)[i];
        this.i = i;
    }

    /**
     * initialize private variables
     * @type {{width: number, height: number, isFullScreen: boolean, video: string, volume: number}}
     * @private
     */
    var _options = {
        width : 0,
        height : 0,
        isFullScreen : false,
        video : "",
        volume : 0.5
    };

    /**
     * initialize private variables
     * @type {{position: string, color: string, content: string}}
     */
    var danmaku = {
        position : "flow|top|bottom",
        color : "white",
        content : "",
        flowY : 0,
        topY : 0,
        bottomY : 0
    };

    /**
     * go into full screen mode
     * @param e - video element
     * @private
     */
    function _requestFullscreen(e) {
        if (e.requestFullscreen) {
            e.requestFullscreen();
        } else if (e.mozRequestFullScreen) {
            e.mozRequestFullScreen();
        } else if (e.msRequestFullscreen) {
            e.msRequestFullscreen();
        } else if (e.webkitRequestFullscreen) {
            e.webkitRequestFullscreen();
        } else {
            console.log("Your browser doesn't support requestFullscreen");
        }
    }

    /**
     * exit full screen mode
     * @private
     */
    function _exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else {
            console.log("Your browser doesn't support exitFullscreen");
        }
    }

    /**
     * format time to **:**
     * @param t - time to be formatted
     * @returns {string} - formatted time
     * @private
     */
    function _formatTime(t) {
        var m = parseInt(t / 60),
            s = parseInt(t % 60);
        function format(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
        return format(m) + ":" + format(s);
    }

    /**
     * play/pause the video and change the icon of the playpause button(when click)
     * @private
     */
    function _changePlayPause(i) {
        return function () {
            var videos = document.getElementsByClassName("video"),
                video = videos[i],
                playPauses = document.getElementsByClassName("playpause"),
                playPause = playPauses[i];
            if (video.paused || video.ended) {
                playPause.className = "command playpause" + " pause";
                video.play();
            } else {
                playPause.className = "command playpause" + " play";
                video.pause();
            }
        }
    }

    /**
     * initialize
     * @param url - url of the video
     */
    DanmakuPlayer.prototype.initialize = function (url) {
        _options.video = url;
        this.createVideo(url);
        this.createPlayingComponents();
        this.setPlaying();
        this.setVolume();
        this.createDanmakuComponents();
    };

    /**
     * create the video
     * @param url
     */
    DanmakuPlayer.prototype.createVideo = function (url) {
        var playBlock = document.createElement("div"),
            video = document.createElement("video"),
            danmakuBlock = document.createElement("div");
        playBlock.className = "play-block";
        video.className = "video";
        danmakuBlock.className = "danmaku-block";

        video.innerHTML = "<source src='" + url + "'>";
        video.style.height = this.videoContainer.offsetHeight + "px";

        playBlock.appendChild(video);
        playBlock.appendChild(danmakuBlock);
        this.videoContainer.appendChild(playBlock);
    };

    /**
     * create components in the playing bar
     */
    DanmakuPlayer.prototype.createPlayingComponents = function () {
        var playInfo = document.createElement("div"),
            progressBar = document.createElement("div"),
            commandBlock = document.createElement("div"),
            playPause = document.createElement("button"),
            volumeBlock = document.createElement("div"),
            volume = document.createElement("button"),
            volumeRange = document.createElement("input"),
            time = document.createElement("div"),
            danmaku = document.createElement("button"),
            fullScreen = document.createElement("button"),
            playBlocks = document.getElementsByClassName("play-block"),
            playBlock = playBlocks[this.i],
            videos = document.getElementsByClassName("video"),
            video = videos[this.i];

        playInfo.className = "play-info";
        progressBar.className = "progress-bar";
        commandBlock.className = "command-block";
        playPause.className = "command playpause play";
        volumeBlock.className = "volume-block";
        volume.className = "command volume on";
        volumeRange.className = "volume-range";
        time.className = "time";
        danmaku.className = "command danmaku";
        fullScreen.className = "command full";

        volumeRange.setAttribute("min", "0");
        volumeRange.setAttribute("max", "1");
        volumeRange.setAttribute("step", "0.05");
        volumeRange.setAttribute("type", "range");

        progressBar.innerHTML = "<span class='progress'></span>";
        time.innerHTML = "<span class='present-time'>00:00</span>/<span class='total-time'>00:00</span>";
        fullScreen.addEventListener("click", function () {
            if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
                _exitFullscreen();
                playInfo.style.position = "relative";
            } else {
                _requestFullscreen(video);
                playInfo.style.position = "fixed";
            }
        });
        document.addEventListener("fullscreenchange", function () {
            if (!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement)) {
                playInfo.style.position = "relative";
            }
        });
        danmaku.addEventListener("click", function () {

        });
        volumeBlock.appendChild(volume);
        volumeBlock.appendChild(volumeRange);
        commandBlock.appendChild(playPause);
        commandBlock.appendChild(volumeBlock);
        commandBlock.appendChild(time);
        commandBlock.appendChild(fullScreen);
        commandBlock.appendChild(danmaku);
        playInfo.appendChild(progressBar);
        playInfo.appendChild(commandBlock);
        playBlock.appendChild(playInfo);


    };
    DanmakuPlayer.prototype.setPlaying = function () {
        var i = this.i,
            videos = document.getElementsByClassName("video"),
            video = videos[i],
            playPauses = document.getElementsByClassName("playpause"),
            playPause = playPauses[i];



        /**
         * set total time of the video
         */
        video.addEventListener("canplaythrough", function () {
            var totalTimes = document.getElementsByClassName("total-time"),
                totalTime = totalTimes[i];
            totalTime.innerHTML = _formatTime(video.duration);
        });

        /**
         * buffered
         */
        video.addEventListener("progress", function () {

        });

        /**
         * update progress
         */
        video.addEventListener("timeupdate", function () {
            var presentTimes = document.getElementsByClassName("present-time"),
                presentTime = presentTimes[i],
                progresses = document.getElementsByClassName("progress"),
                progress = progresses[i];
            presentTime.innerHTML = _formatTime(video.currentTime);
            progress.style.width = (video.currentTime / video.duration * 100) + "%";
        });

        /**
         * switch between play and pause
         */
        video.addEventListener("click", _changePlayPause(this.i));
        playPause.addEventListener("click", _changePlayPause(this.i));

        /**
         * drag the play bar
         */
        function foo() {

        }

        /**
         * auto hide the play bar
         */
        function bar() {

        }


    };
    DanmakuPlayer.prototype.setVolume = function () {
        var volumeRanges = document.getElementsByClassName("volume-range"),
            volumeRange = volumeRanges[this.i],
            volumeButtons = document.getElementsByClassName("volume"),
            volumeButton = volumeButtons[this.i],
            videos = document.getElementsByClassName("video"),
            video = videos[this.i];
        volumeRange.addEventListener("change", function () {
            video.volume = volumeRange.value;
        });
        volumeButton.addEventListener("click", function () {
            if (!video.muted) {
                volumeButton.className = "command volume off";
            } else {
                volumeButton.className = "command volume on";
            }
            video.muted = !video.muted;
        })
    };
    DanmakuPlayer.prototype.createDanmakuComponents = function () {

    };

    window.DanmakuPlayer = function (className, i) {
        return new DanmakuPlayer(className, i);
    }
})(window);

var test1 = window.DanmakuPlayer("test", 0);
test1.initialize("http://o8lfqzxlh.bkt.clouddn.com/1.mp4");
var test2 = window.DanmakuPlayer("test", 1);
test2.initialize("http://o8lfqzxlh.bkt.clouddn.com/1.mp4");
var test3 = window.DanmakuPlayer("test", 2);
test3.initialize("http://o8lfqzxlh.bkt.clouddn.com/1.mp4");