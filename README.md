# PhantomAnimationFramework

Render animation frames with the awesome [PhantomJS](http://phantomjs.org)!

This is just a fun project, rendering animation with js might not be the best idea ever, but it is certainly fun.


With this examples, you can make timing independent animations in JavaScript, that could be relatively easily debugged / managed from a browser, 
and then be rendered into frames with PhantomJS.

You need to write your animaton as it can be seen in the examples, you need to unroll it to unique steps, as we need to get rid of timing errors. 
You want your animation to be exactly the same number of frame every time.
Imagine if you have imported it into an NLE, and the number of frames changes, that breaks your timeline.

# See it in action
 * boxes.html 
   * https://youtu.be/Lts-0M6HN-k
 * randomsquare.html
   * TODO
 

# How to use it?
The debug window is only visible if you are opening them in a browser. 
It might only have a RUN button, also you can use the CTRL-SHIFT-L key shortcut for executing of the animations.


# How to code it?
 * Write your animation steps in a form of loops and step-by-step functions that will be executed sequentially. 
 Avoid using any time based operation or effect.
 
 Example animation:
```
  var ease = jQuery.easing.swing;
  var frames = 30;
            [...]
     for (var i = 0.0; i <= 1.0; i += 1.0 / frames) {
                    addToQueue(function (i) {
                        node.css('opacity', ease(i));
                    }, [i]);
                }
```              
This means, that it adds every step of the opacity change into the animation stack. 
The addToQueue functions' second parameter is an array, that will be given to the callback. 
The trick is, that it will hold it's value, so it is not passed by reference, therefore will not be changed with the next loop.

```
phSnap();
````
Renders the current frame.

```
phSetName('something')
```
This will set the prefix of the frame file names that will be rendered. When changing, the counter resets to 0.
So the next frame will be something_0000.png, after that something_0001.png.

 * Feel free to customize it for your own needs. This is just a bootstrap for you to get productive quickly, but remember that this is not a higly polished userfriendly tool.
 
 
```Extending the debug window```
The debug window is a draggable div, that is only visible when you are viewing it in a browser. 
By default it only has a RUN button. But there is a #debug_extra, where you can put your controls.
This way you don't need to care with it's positioning inside of the window (it will remember where you left it between refreshes) and nothing else of that sort.


# How does it run?
## When you start the render in PhantomJS:
* The debug toolbar is not even constructed
* The animation is executed step by step on every animation frame, but it is independent of it's timing as it is executing a queue of tasks.

## When you start the html from a browser:
* The debug toolbar shows up
* When you press "RUN" that will play the animation, but remember it's speed has nothing to do with anything. 
  Your browser probably fires frame rendering around 60fps, but you have a fixed amount of animation steps, 
  so the visible speed depends on how fast you will play back your frames.
  You can tweak the requestAnimationFrame hook if you want to slow it down for the preview.
 


# Animation: BOXES

This animation renders fading in and out squares after each other.

DEMO: https://youtu.be/Lts-0M6HN-k

## How to use it?
 * Set your background image if you need one (will be only visible in debug mode, the frames will be rendered on a transparent background)
 * Move/Resize the rectangles as you need it
 * Rename the rectangles in the debug window, this will be the output filename prefix
 * When you finished, copy and paste the exported code back into the html.
 * Execute  `phantomjs snap.js boxes.html` And your frames will be generated!
 * There is three sets of images for every "name": 
   * name_in_####.png, name_mid.png, name_out_####.png
   * This way you can insert the first and last sequence easily into your NLE with the single frame between them. 
   This way you can easily set the duration of the effect by setting the single frame's length. Otherwise you would be required to freeze the last frame, and mess around with that.
 
  * All node that has 'export' class will be exported with the filename prefix that is in the node's data-name attribute.

# Animation: Random squares

This animation renders random gray squares that are changing their colour intensity randomly. Also puts a few blue coloured squares in to the mix every once in a while (configurable).

DEMO: https://youtu.be/L2b_yWttB68
## How to use it?

 * In the code you can find the tweakable variables.
 * Render with `phantomjs snap.js randomsquares.html`
 * TIP: With Natron you can feed in the frames into FrameBlend and then possibly to Retime to make it smoother if you want!