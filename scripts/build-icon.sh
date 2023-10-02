#!/bin/bash
set -ue
convert ./resources/bus-side-view.psd -background none -gravity center -resize 1600x1600 -extent 1920x1920 png:- | convert png:- -define icon:auto-resize public/favicon.ico
