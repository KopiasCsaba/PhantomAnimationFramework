# PhantomAnimationFramework

Render animation frames with the awesome [PhantomJS](http://phantomjs.org)!

With this examples, you can make timing independent animations in JavaScript, that could be relatively easily debugged / managed from a browser, and then be rendered into frames with PhantomJS.

You need to write your animaton as it can be seen in the example, you need to unroll it to unique steps, as we need to get rid of timing errors. You want your animation to be exactly the same number of frame every time (imagine if you have imported it into an NLE, and the number of frames changes...)

# How to use it?
 * Set your background image if you need it
 * Move/Resize the rectangles as you need it
 * Rename the rectangles in the debug window, this will be the output filename prefix
 * When you finished, copy and paste the exported code back into the html.
 
# How to code it?
 * Write your animation steps in a form of loops and step-by-step functions that will be executed sequentially. Avoid using any time based operation or effect.
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
This means, that it adds every step of the opacity change into the animation stack. The addToQueue functions' second parameter is an array, that will be given to the callback. The trick is, that it will hold it's value, so it is not passed by reference.

```
phSnap();
````
Renders the current frame.

```
phSetName('something')
```
This will set the prefix of the frame file names that will be rendered. When changing, the counter resets to 0.
So the next frame will be something_0000.png, after that something_0001.png.

 * All node that has 'export' class will be exported with the filename prefix that is in the node's data-name attribute.
 * Feel free to customize it for your own needs. This is just a bootstrap for you to get productive quickly, but remember that this is not a higly polished userfriendly tool.
 
# How does it run?
## When you start the render in PhantomJS:
* All background images ('#images img') will be hidden in PhantomJS
* All '.export' will be hidden
* The debug toolbar is not even constructed
* The animation is executed step by step on every animation frame, but it is independent of it's timing.

## When you start the html from a browser:
* The debug toolbar shows up
* The background images ('#images img') are visible
* All  the '.export'  is visible, you can move and resize them
* When you press "RUN" that will play the animation, but remember it's speed has nothing to do with anything. 
  Your browser probably fires frame rendering around 60fps, but you have a fixed amount of animation steps, so it depends on how fast you will play back your frames. You can tweak the requestAnimationFrame hook if you want to slow it down.
 
