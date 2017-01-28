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
 * Arguments:
 *
 * phantomjs snap.js <inputhtml> [width=1920] [height=1080]
 *
 *
 *
 */
var system = require('system');
var page = new WebPage();

var address = system.args[1];
var frameCount = 0;
var framePrefix = "";

var w = system.args[2] ? system.args[2] : 1920;
var h = system.args[3] ? system.args[3] : 1080;

console.log("Creating viewport: ", w, "x", h);

page.viewportSize = {width: w, height: h};

page.open(address, function () {
    console.log("File opened.");
});

/**
 * Listening for events from the animation HTML.
 * @param data
 */
page.onCallback = function (data) {
    if (data != undefined) {
        if (data.command == 'quit') {
            // There might be a frame that is being rendered,
            // give it some time to finish and quit as i'm not aware of a callback or event that could do this correctly.
            setTimeout(function () {
                console.log("Page finished.");
                page.stop();
                page.close();
                phantom.exit(0);
            }, 2000);
        }

        if (data.command == 'setName') {
            framePrefix = data.value + "_";
            frameCount = 0;
            return;
        }

    }
    // If there was no data, then we should render a frame.
    var imgPath = 'output/' + framePrefix + pad(frameCount, 5) + '.png';
    page.render(imgPath);
    console.log("Rendering frame: ", imgPath);
    frameCount++;

};

page.onError = function (msg, trace) {

    var msgStack = ['ERROR: ' + msg];

    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function (t) {
            msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
        });
    }

    console.error(msgStack.join('\n'));

};

function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}