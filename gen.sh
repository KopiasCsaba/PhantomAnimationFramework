#!/bin/bash
rm output/* 2>/dev/null;

phantomjs snap.js boxes.html
phantomjs snap.js randomsquare.html

