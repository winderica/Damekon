/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
(function (window) {
    /**
     * represents a danmaku
     * @param obj
     * @param canvas
     * @constructor
     */
    function Danmaku(obj, canvas) {

        var context = canvas.getContext('2d');

        this.value = obj.value;
        this.time = obj.time;

        /**
         * initialize the danmaku
         */
        this.init = function () {
            this.speed =  obj.speed;
            this.speed += this.speed ? obj.value.length / 100 : 0;

            this.fontSize = obj.fontSize;

            this.color = obj.color;

            this.range = obj.range;

            this.opacity = obj.opacity;

            /**
             * calc width of the content
             */
            var span = document.createElement('span');
            span.style.position = 'absolute';
            span.style.whiteSpace = 'nowrap';
            span.style.font = "bold " + this.fontSize + "px \"microsoft yahei\", sans-serif";
            span.innerText = obj.value;
            span.textContent = obj.value;
            document.body.appendChild(span);
            this.width = span.clientWidth;
            document.body.removeChild(span);

            this.x = canvas.width;
            if (this.speed === 0) {
                this.x = (this.x - this.width) / 2;
            }

            this.actualX = canvas.width;

            this.y = this.range[0] * canvas.height + (this.range[1] - this.range[0]) * canvas.height * Math.random();
        };

        /**
         * draw the danmaku
         */
        this.draw = function () {
            context.shadowColor = 'rgba(0,0,0,' + this.opacity + ')';
            context.shadowBlur = 2;
            context.font = this.fontSize + 'px "microsoft yahei", sans-serif';
            if (/rgb\(/.test(this.color)) {
                context.fillStyle = 'rgba('+ this.color.split('(')[1].split(')')[0] +','+ this.opacity +')';
            } else {
                context.fillStyle = this.color;
            }
            context.fillText(this.value, this.x, this.y);
        };
    }

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

        /**
         * default style of danmakus
         * @type {{opacity: number, fontSize: number, speed: number, range: [number,number], color: string, data: Array}}
         */
        this.defaults = {
            opacity: 1,
            fontSize: 24,
            speed: 2,
            range: [0, 1],
            color: 'white'
        };

        /**
         * danmakus that have been stored
         * @type {[]}
         */
        this.store = [];
    }


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
     * set default styles if necessary
     * @param opts
     */
    DanmakuPlayer.prototype.setDefaults = function (opts) {
        for (var k in opts) {
            if (this.defaults.hasOwnProperty(k)) {
                this.defaults[k] = opts[k];
            }
        }
    };

    /**
     * initialize
     * @param url - url of the video
     */
    DanmakuPlayer.prototype.initialize = function (url) {
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
        /**
         * initialize
         */
        var playBlock = document.createElement("div"),
            video = document.createElement("video"),
            danmakuBlock = document.createElement("canvas"),
            videoBlock = document.createElement("div");
        playBlock.className = "play-block";
        video.className = "video";
        danmakuBlock.className = "danmaku-block";
        videoBlock.className = "video-block";
        video.innerHTML = "<source src='" + url + "'>";

        /**
         * build DOM tree
         */
        videoBlock.appendChild(danmakuBlock);
        videoBlock.appendChild(video);
        playBlock.appendChild(videoBlock);
        this.videoContainer.appendChild(playBlock);
    };

    /**
     * create components in the playing bar
     */
    DanmakuPlayer.prototype.createPlayingComponents = function () {
        /**
         * initialize
         */
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
        /**
         * initialize
         */
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
         * TODO
         */
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
         * TODO
         */
        /**
         * drag the play bar
         */
        function foo() {

        }

        /**
         * TODO
         */
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
        /**
         * initialize
         */
        var volumeRanges = document.getElementsByClassName("volume-range"),
            volumeRange = volumeRanges[this.i],
            volumeButtons = document.getElementsByClassName("volume"),
            volumeButton = volumeButtons[this.i],
            videos = document.getElementsByClassName("video"),
            video = videos[this.i];

        /**
         * adjust the volume
         */
        volumeRange.addEventListener("change", function () {
            video.volume = volumeRange.value;
        });

        /**
         * turn on/off the volume
         */
        volumeButton.addEventListener("click", function () {
            if (!video.muted) {
                volumeButton.className = "command volume off";
            } else {
                volumeButton.className = "command volume on";
            }
            video.muted = !video.muted;
        });
    };

    /**
     * create components in danmaku bar
     */
    DanmakuPlayer.prototype.createDanmakuComponents = function () {
        /**
         * initialize
         */
        var i = this.i,
            store = this.store,
            defaults = this.defaults,
            canvas = document.getElementsByClassName("danmaku-block")[i],
            danmakuCommand = document.createElement("div"),
            input = document.createElement("input"),
            send = document.createElement("button"),
            settings = document.createElement("button"),
            danmakuStyle = document.createElement("div"),
            playBlock = document.getElementsByClassName("play-block")[i],
            danmakuButton = document.getElementsByClassName("danmaku")[i];

        danmakuCommand.className = "danmaku-command";
        input.className = "danmaku-input";
        send.className = "command danmaku-sender";
        settings.className = "command danmaku-settings";
        danmakuStyle.className = "danmaku-style";

        input.type = "text";
        input.placeholder = "输入弹幕";

        danmakuStyle.innerHTML =
            "<form>位置<br>" +
                "<input type='radio' name='range' value='[0, 1]'>全屏" +
                "<input type='radio' name='range' value='[0, 0.5]'>上方" +
                "<input type='radio' name='range' value='[0.5, 1]'>下方" +
            "</form>" +
            "<form>速度<br>" +
                "<input type='radio' name='speed' value='3'>快速" +
                "<input type='radio' name='speed' value='2'>普通" +
                "<input type='radio' name='speed' value='1'>慢速" +
                "<input type='radio' name='speed' value='0'>固定" +
            "</form>" +
            "<form>颜色<br>" +
                "<input type='radio' name='color' value='white'>白" +
                "<input type='radio' name='color' value='red'>红" +
                "<input type='radio' name='color' value='orange'>橙" +
                "<input type='radio' name='color' value='yellow'>黄" +
                "<input type='radio' name='color' value='green'>绿" +
                "<input type='radio' name='color' value='blue'>蓝" +
                "<input type='radio' name='color' value='purple'>紫" +
            "</form>";

        /**
         * build DOM tree
         */
        danmakuCommand.appendChild(input);
        danmakuCommand.appendChild(send);
        danmakuCommand.appendChild(settings);
        danmakuCommand.appendChild(danmakuStyle);
        playBlock.appendChild(danmakuCommand);

        /**
         * show/hide danmaku sending box
         */
        danmakuButton.addEventListener("click", function () {
            if (danmakuCommand.style.display === "block") {
                danmakuCommand.style.display = "none";
            } else {
                danmakuCommand.style.display = "block";
            }
        });

        /**
         * show/hide danmaku style settings
         */
        settings.addEventListener("click", function () {
            if (danmakuStyle.style.display === "block") {
                danmakuStyle.style.display = "none";
            } else {
                danmakuStyle.style.display = "block";
            }
        });

        /**
         * send danmaku when click the send button or press return key
         */
        input.addEventListener("keyup", function (e) {
            if (e.keyCode === 13) {
                sendDanmaku();
            }
        });
        send.addEventListener("click", sendDanmaku);

        /**
         * danmaku sender
         */
        function sendDanmaku() {
            /**
             * initailize
             */
            var video = document.getElementsByClassName("video")[i],
                input = document.getElementsByClassName("danmaku-input")[i],
                time = video.currentTime.toFixed(1),
                item = defaults,
                rangeRadios = document.getElementsByName("range"),
                speedRadios = document.getElementsByName("speed"),
                colorRadios = document.getElementsByName("color");

            /**
             * get danmakus info from localStorage
             */
            if (localStorage.getItem("danmakus")) {
                var danmakus = JSON.parse(localStorage.getItem("danmakus"));
            } else {
                danmakus = [];
                for (var j = 0; j < document.getElementsByClassName("video").length; j++) {
                    danmakus.push([]);
                }
            }

            /**
             * set options that user chose (use some magic numbers or it will be very complex)
             */
            for (j = 3 * i; j < (i + 1) * 3; j++) {
                if (rangeRadios[j].checked) {
                    item.range = eval(rangeRadios[j].value);
                }
            }
            for (j = 4 * i; j < (i + 1) * 4; j++) {
                if (speedRadios[j].checked) {
                    item.speed = eval(speedRadios[j].value);
                }
            }
            for (j = 7 * i; j < (i + 1) * 7; j++) {
                if (colorRadios[j].checked) {
                    item.color = colorRadios[j].value;
                }
            }
            item.value = input.value;
            item.time = time;

            /**
             * add danmaku info to localStorage
             */
            danmakus[i].push(item);
            localStorage.setItem("danmakus", JSON.stringify(danmakus));

            /**
             * store the danmaku
             */
            store[Object.keys(store).length] = new Danmaku(item, canvas);

            /**
             * reset the value of input box
             */
            input.value = "";
        }
    };

    /**
     * load and display the danmakus in localStorage and store
     */
    DanmakuPlayer.prototype.loadDanmaku = function () {
        /**
         * initialize
         */
        var store = this.store,
            i = this.i,
            video = document.getElementsByClassName("video")[i],
            canvas = document.getElementsByClassName("danmaku-block")[i],
            isPaused = true,
            time = video.currentTime,
            context = canvas.getContext('2d');

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        /**
         * get danmakus info from localStorage
         */
        if (localStorage.getItem("danmakus")) {
            var data = JSON.parse(localStorage.getItem("danmakus"));
        } else {
            data = [];
            for (var j = 0; j < document.getElementsByClassName("video").length; j++) {
                data.push([]);
            }
        }

        /**
         * and add them to store
         */
        data[i].forEach(function (obj, index) {
            store[index] = new Danmaku(obj, canvas);
        });

        /**
         * prepare the danmakus to be loaded
         */
        function load() {
            for (var index in store) {
                var danmaku = store[index];

                if (danmaku && !danmaku.disabled && time >= danmaku.time) {
                    if (!danmaku.inited) {
                        danmaku.init();
                        danmaku.inited = true;
                    }
                    danmaku.x -= danmaku.speed;
                    if (danmaku.speed === 0) {
                        danmaku.actualX -= 2;
                    } else {
                        danmaku.actualX = danmaku.x;
                    }
                    if (danmaku.actualX < -1 * danmaku.width) {
                        danmaku.x = danmaku.actualX;
                        danmaku.disabled = true;
                    }
                    danmaku.draw();
                }
            }
        }

        /**
         * load the danmakus while not paused
         */
        function loop() {
            time = video.currentTime;
            context.clearRect(0, 0, canvas.width, canvas.height);
            load();

            if (!isPaused) {
                requestAnimationFrame(loop);
            }
        }

        /**
         * play/pause/clear danmakus when the state of playing changes
         */
        video.addEventListener('play', function () {
            isPaused = false;
            loop();
        });
        video.addEventListener('pause', function () {
            isPaused = true;
        });
        video.addEventListener('seeked', function () {
            time = video.currentTime;

            context.clearRect(0, 0, canvas.width, canvas.height);

            for (var index in store) {
                var danmaku = store[index];
                if (danmaku) {
                    danmaku.disabled = true;
                    if (time < danmaku.time) {
                        danmaku.inited = null;
                    } else {
                        danmaku.disabled = true;
                    }
                }
            }
        });
    };

    /**
     * create a floating small video window
     * @param url
     */
    DanmakuPlayer.prototype.createSmallVideo = function (url) {
        if (this.i === 0) {
            /**
             * initialize
             */
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

            /**
             * build DOM tree
             */
            container.appendChild(move);
            container.appendChild(resize);
            container.appendChild(close);
            container.appendChild(smallVideo);
            document.body.appendChild(container);
        }
    };

    /**
     * add event handlers of small video
     */
    DanmakuPlayer.prototype.setSmallVideo = function () {
        if (this.i === 0) {
            /**
             * initialize
             */
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
    };
})(window);


var a = window.DanmakuPlayer("test", 1);
a.setDefaults({'color':'purple', 'speed': 1});
window.DanmakuPlayer("test", 0).initialize("video/[SumiSora][LittleBusters][SP][GB][720p].mp4");
a.initialize("video/[SumiSora][LittleBusters_Refrain][01][GB][720p].mp4");
window.DanmakuPlayer("test", 2).initialize("video/[SumiSora][LittleBusters_Refrain][02][GB][720p].mp4");



/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(2);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(4)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./index.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./index.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)(undefined);
// imports


// module
exports.push([module.i, "* {\r\n    box-sizing: border-box;\r\n}\r\n\r\n@media screen and (min-width: 1000px) {\r\n    .play-block {\r\n        width: 960px;\r\n    }\r\n    .video-block {\r\n        height: 540px;\r\n    }\r\n}\r\n@media screen and (min-width: 600px) and (max-width: 1000px) {\r\n    .play-block {\r\n        width: 576px;\r\n    }\r\n    .video-block {\r\n        height: 324px;\r\n    }\r\n}\r\n.play-block {\r\n    overflow: hidden;\r\n    color: rgb(44, 141, 232);\r\n    margin-bottom: 20px;\r\n    position: relative;\r\n}\r\n.video-block {\r\n    position: relative;\r\n}\r\n.video {\r\n    width: 100%;\r\n}\r\nvideo::-webkit-media-controls {\r\n    display: none !important;\r\n}\r\nvideo::-webkit-media-controls-enclosure {\r\n    display: none !important;\r\n}\r\n\r\n.play-info {\r\n    overflow: hidden;\r\n    border: rgb(222, 222, 222) 1px solid;\r\n    padding: 5px;\r\n    background-color: white;\r\n    width: 100%;\r\n    bottom: 0;\r\n    left: 0;\r\n    position: relative;\r\n}\r\n\r\n.progress-bar {\r\n    height: 2px;\r\n    width: 99%;\r\n    background: rgb(222, 222, 222);\r\n    position: relative;\r\n    margin-left: auto;\r\n    margin-right: auto;\r\n}\r\n.progress {\r\n    display: block;\r\n    height: 3px;\r\n    width: 0;\r\n    background: rgb(44, 141, 232);\r\n}\r\n\r\n.command-block {\r\n    display: block;\r\n    margin-top: 5px;\r\n    vertical-align: middle;\r\n    overflow: hidden;\r\n}\r\n.command {\r\n    background: none;\r\n    border: none;\r\n    color: rgb(44, 141, 232);\r\n    font-family: \"Segoe MDL2 Assets\";\r\n    font-size: 1.5em;\r\n    padding: 0;\r\n    cursor: pointer;\r\n    margin-left: 5px;\r\n    margin-right: 5px;\r\n    vertical-align: middle;\r\n}\r\n.play:before {\r\n    content: \"\\E768\";\r\n}\r\n.pause:before {\r\n    content: \"\\E769\";\r\n}\r\n.on:before {\r\n    content: \"\\E767\";\r\n}\r\n.off:before {\r\n    content: \"\\E74F\";\r\n}\r\n.full:before {\r\n    content: \"\\E740\";\r\n}\r\n.exit-full:before {\r\n    content: \"\\E73F\";\r\n}\r\n.danmaku:before {\r\n    content: \"\\E90A\";\r\n}\r\n.float:before {\r\n    content: \"\\E78B\";\r\n}\r\n.danmaku-sender:before {\r\n    content: '\\E724';\r\n}\r\n.danmaku-settings:before {\r\n    content: '\\E713';\r\n}\r\n.playpause {\r\n    float: left;\r\n}\r\n.full, .exit-full, .danmaku, .float {\r\n    float: right;\r\n}\r\n.volume-block {\r\n    display: inline-flex;\r\n    float: left;\r\n}\r\n.volume-range {\r\n    -webkit-appearance: none;\r\n    outline: none;\r\n    height: 2px;\r\n    width: 50px;\r\n    background: rgb(44, 141, 232);\r\n    cursor: pointer;\r\n    display: none;\r\n    margin-top: 10px;\r\n}\r\n.volume-range::-webkit-slider-thumb {\r\n    height: 2px;\r\n    width: 2px;\r\n    background: white;\r\n    -webkit-appearance: none;\r\n}\r\n.volume-block:hover .volume-range {\r\n    display: inline-block;\r\n}\r\n.time {\r\n    display: inline;\r\n    margin-left: 5px;\r\n    float: left;\r\n}\r\n\r\n.small-video-container {\r\n    position: fixed;\r\n    right: 20px;\r\n    bottom: 20px;\r\n    display: none;\r\n    width: 320px;\r\n    overflow: hidden;\r\n    z-index: 1;\r\n}\r\n.small-video-container button {\r\n    background: none;\r\n    border: none;\r\n    color: rgb(44, 141, 232);\r\n}\r\n.small-video {\r\n    height: 180px;\r\n    width: 100%;\r\n    clear: both;\r\n    display: block;\r\n}\r\n.drag-bar {\r\n    float: left;\r\n    cursor: move;\r\n    margin-right: 20px;\r\n}\r\n.resize-bar {\r\n    float: left;\r\n    cursor: ew-resize;\r\n}\r\n.close {\r\n    float: right;\r\n    cursor: pointer;\r\n}\r\n.danmaku-block {\r\n    position: absolute;\r\n    height: 100%;\r\n    width: 100%;\r\n}\r\n.danmaku-command {\r\n    width: 50%;\r\n    position: absolute;\r\n    bottom: 50px;\r\n    right: 25%;\r\n    z-index: 2147483647;\r\n    display: none;\r\n}\r\n.danmaku-style {\r\n    position: absolute;\r\n    background: rgba(255, 255, 255, 0.7);\r\n    bottom: 35px;\r\n    right: -75px;\r\n    height: 200px;\r\n    width: 300px;\r\n    border-radius: 5px;\r\n    text-align: center;\r\n    z-index: 2147483647;\r\n    display: none;\r\n}\r\ninput[type='radio'] {\r\n    height: 12px;\r\n    width: 12px;\r\n    border: 1px solid rgb(44, 141, 232);\r\n    border-radius: 6px;\r\n    cursor: pointer;\r\n    -webkit-appearance: none;\r\n    -moz-appearance: none;\r\n    appearance: none;\r\n}\r\ninput[type='radio']:checked {\r\n    background: rgb(44, 141, 232);\r\n}\r\n.danmaku-input {\r\n    border-radius: 5px;\r\n    height: 30px;\r\n    width: 85%;\r\n    border: 1px solid rgb(44, 141, 232);\r\n    background-color: rgba(255, 255, 255, 0.4);\r\n}\r\n\r\n@keyframes flow {\r\n    from {\r\n        transform: translateX(0);\r\n    }\r\n    to {\r\n        transform: translateX(-2000px);\r\n    }\r\n}\r\n\r\n\r\n.test {\r\n    overflow: hidden;\r\n}", ""]);

// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(5);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 5 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);