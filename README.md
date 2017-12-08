# Damekon - a danmaku player plugin

A simple Danmaku-player plugin written in Javascript

## Demo

[click here](https://winderica.github.io/damekon/)

## Basic functions

implement basic functions of video:
* play/pause
* volume control
* progress bar
* full screen playing
* multiple video playing
* (TODO: dragging the progress bar)
* (TODO: full screen danmaku)

and a floating window:
* auto show/hide
* move
* resize
* close
* select video to show
* (TODO: synchronize the progress rather than reset it)

and danmaku sending/storage:
* user-adjustable speed (including fixed danmaku)
* user-adjustable position
* user-adjustable color
* local storage danmaku
* (TODO: user-adjustable opacity & font size)

## API Reference

You can create a array of danmaku player object by using `window.GenerateDanmakuPlayers()`, which requires three arguments: 
the class name of your own `div`, the number of your `div`s and the index of video to be showed in floating window.

for example:

    var myDanmakuPlayers = window.GenerateDanmakuPlayers("player", 3, 0);
    
    
and then initial the object in the array using `initialize` function by passing the url(and the source of danmaku in JSON if necessary):

    myDanmakuPlayers[0].initialize("your.url", "danmaku.src");
    
or you can change the default style of danmaku by yourself using `setDefaults` function like below:

    var player = myDanmakuPlayers[2];
    player.setDefaults({
        opacity: 0.5,
        fontSize: 40,
        speed: 3,
        range: [0, 0.5],
        color: 'black'
    });

and you can passing a callback function to some events:

    player.resizeSmallVideo(function () {
        console.log("succeeded in resizing small video");
    });
    
## FAQ

Q: What does Damekon means?

A: ダメコン - **_the answer to LIFE, the UNIVERSE, and EVERYTHING_**

![](src/img/TANAKA.png)