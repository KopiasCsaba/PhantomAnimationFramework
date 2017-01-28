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


$.widget("kcs.debugtoolbar", {

    _create: function () {


        if (isInsideOfPhantomJS()) {
            $('#images img').css('visibility', 'hidden');
        } else {
            this._mkGui();
            this._export();
        }

    },

    _mkGui: function () {
        var main = $('<div>', {id: 'debugToolbar'}).draggable();

        this.nameField = $('<input>', {type: 'text'})
            .on('keyup', this._setExportName.bind(this))
            .appendTo(main);

        this.duplicateButton = $('<input>', {type: 'button', value: 'Duplicate selected'})
            .click(this._duplicateSelected.bind(this))
            .appendTo(main);

        this.deleteButton = $('<input>', {type: 'button', value: 'Delete selected'})
            .click(this._deleteSelected.bind(this))
            .appendTo(main);

        this.runButton = $('<input>', {type: 'button', value: 'RUN'})
            .click(this._run.bind(this))
            .appendTo(main);

        this.exportArea = $('<textarea>').appendTo(main);

        $('body').append(main);

        $(".export")
            .resizable()
            .draggable();

        this.element.on('mousedown', '.export', this._updateExportName.bind(this));
        this.element.on('mouseup', '.export', this._export.bind(this));
    },

    _export: function () {

        this.exportArea.val('');
        var elements = this.element.find('.export');
        var clonedElements = elements.clone();

        clonedElements.each(function (index, element) {
            element = $(element);
            element.removeClass('ui-resizable ui-draggable ui-draggable-handle ui-resizable-resizing');
            element.find('.ui-resizable-handle').remove();
            this.exportArea.val(this.exportArea.val() + "\n" + element.get(0).outerHTML);


        }.bind(this))


    },
    /**
     * Show the currently selected object's name in the nameField
     * @param e
     * @private
     */
    _updateExportName: function (e) {
        this.selectedExportNode = $(e.target.closest('.export'));
        this.nameField.val(this.selectedExportNode.data('name'));
    },
    /**
     * On keyup, if the nameField changed
     * @private
     */
    _setExportName: function () {
        this.selectedExportNode.attr('data-name', this.nameField.val());
        this._export();
    },
    /**
     * Duplicates and reinitializes the currently selected exportable
     * @private
     */

    _duplicateSelected: function () {
        var dup = this.selectedExportNode.clone();
        dup.attr('data-name', dup.attr('data-name') + "_");
        // resizable and draggable bugs after cloning, so reinit, destroy and init...
        dup
            .resizable().resizable('destroy').resizable()
            .draggable().draggable('destroy').draggable()
            .appendTo(this.element)
            .css('position', '')
    },
    _deleteSelected: function () {
        this.selectedExportNode.remove();
        this.nameField.val('');
        this._export();
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
        phSnap();
    },


})
;