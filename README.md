# Damekon - a danmaku player

A simple Danmaku-player plugin written in Javascript

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
* (TODO: select video to show)

and danmaku sending/storage:
* user-adjustable speed (including fixed danmaku)
* user-adjustable position
* user-adjustable color
* local storage danmaku
* (TODO: user-adjustable opacity & font size)
* (TODO: import danmaku)

## API Reference

You can create a array of danmaku player object by using `window.GenerateDanmakuPlayers()`, which requires three arguments: 
the class name of your own `div`, the number of your `div`s and the index of video to be showed in floating window.

for example:

    var myDanmakuPlayers = window.GenerateDanmakuPlayers("player", 3, 0);
    
    
and then initial the object in the array using `initialize` function by passing the url:

    myDanmakuPlayers[0].initialize("your.url");
    
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
    
## Other TODOs

* error capture
* uglify the js and css
* use webpack to pack it

## FAQ

Q: What is the meaning of Damekon?

A: ダメコン - **_the answer to life the universe and everything_**

![](https://static.mengniang.org/common/0/04/043a.png)