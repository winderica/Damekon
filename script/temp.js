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
    var _danmaku = {
        position : "flow",
        color : "white",
        content : "",
        flowY : 0,
        topY : 0,
        bottomY : 0
    };


    var _times = localStorage.getItem('times') ? localStorage.getItem('times').split(',') : [];

    var _danmakus = localStorage.getItem('danmakus') ? localStorage.getItem('danmakus').split(',') : [];
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
                playPause = playPauses[i],
                smallVideo = document.getElementsByClassName("small-video")[0];
            if (video.paused || video.ended) {
                playPause.className = "command playpause" + " pause";
                video.play();
                if (i === 0) {
                    smallVideo.play();
                }
            } else {
                playPause.className = "command playpause" + " play";
                video.pause();
                if (i === 0) {
                    smallVideo.pause();
                }
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
        this.loadDanmaku();
        this.createSmallVideo(url);
        this.setSmallVideo();
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

        danmakuBlock.appendChild(video);
        playBlock.appendChild(danmakuBlock);
        this.videoContainer.appendChild(playBlock);
    };

    /**
     * create components in the playing bar
     */
    DanmakuPlayer.prototype.createPlayingComponents = function () {
        var i = this.i,
            playInfo = document.createElement("div"),
            progressBar = document.createElement("div"),
            commandBlock = document.createElement("div"),
            playPause = document.createElement("button"),
            volumeBlock = document.createElement("div"),
            volume = document.createElement("button"),
            volumeRange = document.createElement("input"),
            time = document.createElement("div"),
            float =  document.createElement("button"),
            danmaku = document.createElement("button"),
            fullScreen = document.createElement("button"),
            playBlocks = document.getElementsByClassName("play-block"),
            playBlock = playBlocks[i],
            videos = document.getElementsByClassName("video"),
            video = videos[i];

        playInfo.className = "play-info";
        progressBar.className = "progress-bar";
        commandBlock.className = "command-block";
        playPause.className = "command playpause play";
        volumeBlock.className = "volume-block";
        volume.className = "command volume on";
        volumeRange.className = "volume-range";
        time.className = "time";
        float.className = "command float";
        danmaku.className = "command danmaku";
        fullScreen.className = "command full";

        volumeRange.setAttribute("min", "0");
        volumeRange.setAttribute("max", "1");
        volumeRange.setAttribute("step", "0.05");
        volumeRange.setAttribute("type", "range");

        progressBar.innerHTML = "<span class='progress'></span>";
        time.innerHTML = "<span class='present-time'>00:00</span>/<span class='total-time'>00:00</span>";



        /**
         * execute function _exitFullscreen or _requestFullscreen when click the fullScreen button
         */
        fullScreen.addEventListener("click", function () {
            if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement) {
                _exitFullscreen();
                playInfo.style.position = "relative";
                playInfo.style.zIndex = "0";

            } else {
                _requestFullscreen(video);
                playInfo.style.position = "fixed";
                playInfo.style.zIndex = "2147483647";
            }
        });

        /**
         * change the style of play bar when exit fullScreen mode
         */
        document.addEventListener("fullscreenchange", function () {
            if (!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement)) {
                playInfo.style.position = "relative";
                playInfo.style.zIndex = "0";
            }
        });

        danmaku.addEventListener("click", function () {

        });

        /**
         * build DOM tree
         */
        volumeBlock.appendChild(volume);
        volumeBlock.appendChild(volumeRange);
        commandBlock.appendChild(playPause);
        commandBlock.appendChild(volumeBlock);
        commandBlock.appendChild(time);
        commandBlock.appendChild(fullScreen);
        commandBlock.appendChild(danmaku);
        commandBlock.appendChild(float);
        playInfo.appendChild(progressBar);
        playInfo.appendChild(commandBlock);
        playBlock.appendChild(playInfo);
    };

    /**
     * set relevant properties when playing
     */
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

    /**
     * apply the change of volume from user
     */
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

    /**
     * create components in danmaku bar
     */
    DanmakuPlayer.prototype.createDanmakuComponents = function () {
        var i = this.i,
            danmakuCommand = document.createElement("div"),
            input = document.createElement("input"),
            send = document.createElement("button"),
            settings = document.createElement("button"),
            danmakuStyle = document.createElement("div"),
            playBlock = document.getElementsByClassName("play-block")[i];

        danmakuCommand.className = "danmaku-command";
        input.className = "danmaku-input";
        send.className = "command danmaku-sender";
        settings.className = "command danmaku-settings";
        danmakuStyle.className = "danmaku-style";

        input.type = "text";
        input.placeholder = "输入弹幕";

        danmakuCommand.appendChild(input);
        danmakuCommand.appendChild(send);
        danmakuCommand.appendChild(settings);
        danmakuCommand.appendChild(danmakuStyle);
        playBlock.appendChild(danmakuCommand);

        settings.addEventListener("click", function () {
            if (danmakuStyle.style.display === "none") {
                danmakuStyle.style.display = "block";
            } else {
                danmakuStyle.style.display = "none";
            }
        });
        input.addEventListener("keydown", function (e) {
            if (e.keyCode === 13) {
                sendDanmaku();
            }
        });
        send.addEventListener("click", sendDanmaku);
        function sendDanmaku() {
            var video = document.getElementsByClassName("video")[i],
                input = document.getElementsByClassName("danmaku-input")[i],
                danmakuBlock = document.getElementsByClassName("danmaku-block")[i],
                time = video.currentTime.toFixed(1);
            if (input.value !== "") {
                _danmaku.content = input.value;
                input.value = "";

                _danmakus.push(_danmaku.content);
                _times.push(time);
                localStorage.setItem('danmakus', _danmakus);
                localStorage.setItem('times', _times);

                var item = document.createElement("div");
                item.className = "danmaku-item";
                item.innerHTML = _danmaku.content;
                danmakuBlock.appendChild(item);

                item.addEventListener("animationend", function () {
                    danmakuBlock.removeChild(item);
                })
            }
        }
    };


    DanmakuPlayer.prototype.loadDanmaku = function () {
        var danmakuBlock = document.getElementsByClassName("danmaku-block")[this.i],
            item;
        for (var j = 0; j < _danmakus.length; j++) {
            item = document.createElement("div");
            item.className = "danmaku-item";
            item.innerHTML = _danmakus[j];

            danmakuBlock.appendChild(item);

            item.addEventListener("animationend", remove(item));
            function remove(item) {
                return function () {
                    danmakuBlock.removeChild(item);
                }
            }
        }
    };


    /**
     * create a floating small video window
     * @param url
     */
    DanmakuPlayer.prototype.createSmallVideo = function (url) {
        if (this.i === 0) {
            var container = document.createElement("div"),
                move = document.createElement("button"),
                resize = document.createElement("button"),
                close = document.createElement("button"),
                smallVideo = document.createElement("video");

            container.className = "small-video-container";
            move.className = "drag-bar";
            resize.className = "resize-bar";
            close.className = "close";
            smallVideo.className = "small-video";

            move.innerHTML = "move";
            resize.innerHTML = "resize";
            close.innerHTML = "close";
            smallVideo.innerHTML = "<source src='" + url + "'>";

            container.appendChild(move);
            container.appendChild(resize);
            container.appendChild(close);
            container.appendChild(smallVideo);
            document.getElementsByTagName("body")[0].appendChild(container);
        }
    };

    /**
     * add event handlers of small video
     */
    DanmakuPlayer.prototype.setSmallVideo = function () {
        if (this.i === 0) {
            var container = document.getElementsByClassName("small-video-container")[0],
                move = document.getElementsByClassName("drag-bar")[0],
                resize = document.getElementsByClassName("resize-bar")[0],
                close = document.getElementsByClassName("close")[0],
                smallVideo = document.getElementsByClassName("small-video")[0],
                video = document.getElementsByClassName("video")[0],
                x1, x2, y1, y2, x, w;

            /**
             * show/hide the small video window when scroll
             */
            window.addEventListener("scroll", function () {
                var toTop = video.getBoundingClientRect().top;
                if (toTop + video.offsetHeight < 0) {
                    container.style.display = "block";
                } else {
                    container.style.display = "none";
                }
            });

            /**
             * drag the small video window
             */
            move.addEventListener("mousedown", dragMouseDown);
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
                container.style.top = (container.offsetTop - y1) + "px";
                container.style.left = (container.offsetLeft - x1) + "px";
            }
            function closeDragElement() {
                window.removeEventListener("mouseup", closeDragElement);
                window.removeEventListener("mousemove", elementDrag);
            }

            /**
             * resize the small video window
             */
            resize.addEventListener("mousedown", resizeMouseDown);
            function resizeMouseDown(e) {
                e = e || window.event;
                x = e.clientX;
                w = smallVideo.offsetWidth;
                window.addEventListener("mousemove", elementResize);
                window.addEventListener("mouseup", closeResizeElement)
            }
            function elementResize(e) {
                e = e || window.event;
                smallVideo.style.width = (w - e.clientX + x) + "px";
                container.style.width = smallVideo.style.width;
                smallVideo.style.height = ((w - e.clientX + x) / 16 * 9) + "px";
            }
            function closeResizeElement() {
                window.removeEventListener("mouseup", closeResizeElement);
                window.removeEventListener("mousemove", elementResize);
            }

            /**
             * close the small video window
             */
            close.addEventListener("click", function () {
                if (smallVideo.style.visibility === "hidden") {
                    smallVideo.style.visibility = "visible";
                    close.innerHTML = "close";
                } else {
                    smallVideo.style.visibility = "hidden";
                    close.innerHTML = "open";
                }
            })
        }
    };

    window.DanmakuPlayer = function (className, i) {
        return new DanmakuPlayer(className, i);
    }
})(window);

var test1 = window.DanmakuPlayer("test", 0);
test1.initialize("video/[SumiSora][LittleBusters][SP][GB][720p].mp4");
var test2 = window.DanmakuPlayer("test", 1);
test2.initialize("video/[SumiSora][LittleBusters_Refrain][01][GB][720p].mp4");
var test3 = window.DanmakuPlayer("test", 2);
test3.initialize("video/[SumiSora][LittleBusters_Refrain][02][GB][720p].mp4");