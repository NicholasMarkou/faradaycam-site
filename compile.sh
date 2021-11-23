#!/bin/bash
ffmpeg -framerate 45 -pattern_type glob -i "/home/pi/website/public/images/*.jpg" -c:v libx264 -crf 20 "/home/pi/website/public/timelapse/$(date +"%Y_%m_%d").mp4"
rm /home/pi/website/images/*
