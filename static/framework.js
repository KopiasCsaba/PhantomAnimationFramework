/**
 *
 * Copyright 2016 Kopiás Csaba [ http://kopiascsaba.hu ]
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

/**
 * Holds the animation steps as functions.
 * @type {Array}
 */
var funqueue = [];

/**
 * Tells phantomjs what the output frame image name prefix should be
 * @param name
 */
function phSetName(name) {
    console.log("SetName:" + name);
    if (typeof window.callPhantom === 'function') {
        window.callPhantom({command: 'setName', value: name});
    }
}

/**
 * Quits phantomjs
 */
function phQuit() {
    if (typeof window.callPhantom === 'function') {
        window.callPhantom({command: 'quit'});
    }
    console.log("Quit");
}


/**
 * Commands phantomjs to render a frame right now.
 */
function phSnap() {
    if (typeof window.callPhantom === 'function') {
        window.callPhantom();
    }
}


/**
 *
 * @param fn Reference to function.
 * @param context what you want "this" to be.
 * @param params array of parameters to pass to function.
 * @returns {Function}
 */
function wrapFunction(fn, context, params) {
    return function () {
        fn.apply(context, params);
    };
}
/**
 * Adds the callback to the function queue
 * @param cb
 * @param params
 * @param context
 */
function addToQueue(cb, params, context) {
    if (context == undefined) {
        context = this;
    }
    funqueue.push(wrapFunction(cb, context, params));
}

/**
 * Tells whether we are inside of phantomjs or not
 * @returns {boolean}
 */
function isInsideOfPhantomJS() {
    if (!(navigator.plugins instanceof PluginArray) || navigator.plugins.length == 0) {
        return true;
    } else {
        return false;
    }
}


$.widget("kcs.debugwindow", {

    _create: function () {
        if (!isInsideOfPhantomJS()) {
            this._mkGui();
        }

        // Bind CTRL-SHIFT-L To RUN
        $(window).keypress(function (e) {
            if (e.ctrlKey && e.shiftKey && e.which == 12) {
                this._run();
            }
        }.bind(this));
    },
    /**
     * Creates the debug gui
     * @private
     */
    _mkGui: function () {
        var main = $('<div>', {id: 'debug_toolbar'}).draggable(
            {
                stop: function (e, ui) { // Store the window's position
                    sessionStorage.setItem('dbg_x', ui.position.left);
                    sessionStorage.setItem('dbg_y', ui.position.top);
                }
            }
        );

        // Restore the window's position
        main.css({
            top: sessionStorage.getItem('dbg_y'),
            left: sessionStorage.getItem('dbg_x')
        });

        this.runButton = $('<input>', {type: 'button', value: 'RUN', title: 'CTRL+SHIFT+L'})
            .click(this._run.bind(this))
            .appendTo(main);

        this.extraContentArea = $('<div>', {id: 'debug_extra'}).appendTo(main);

        $('body').append(main);

    },

    /**
     * Sets the code that should be executed on manual or phantomjs running of the effects
     * @param cb
     */
    setEffect: function (cb) {
        this.effect = cb;
        if (isInsideOfPhantomJS()) {
            this._run();
        }
    },
    /**
     * Runs the effect loop.
     * @private
     */
    _run: function () {
        this.effect();
        window.requestAnimationFrame(this._renderFrame.bind(this));
    },

    /**
     * Renders one frame with phantomjs also
     * @private
     */
    _renderFrame: function () {

        if (funqueue.length > 0) {
            (funqueue.shift())();
            window.requestAnimationFrame(this._renderFrame.bind(this))
        } else {
            phQuit()
        }
    },


});


