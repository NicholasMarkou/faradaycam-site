#!/bin/sh
raspistill -o /home/pi/website/public/curPicture.jpg -w 1600 -h 1200 -a 12 -ex night -t 5000
cp /home/pi/website/public/curPicture.jpg "/home/pi/website/public/images/$(date +"%Y_%m_%d_%H_%M_%S").jpg"
sleep 15
raspistill -o /home/pi/website/public/curPicture.jpg -w 1600 -h 1200 -a 12 -ex night -t 5000
cp /home/pi/website/public/curPicture.jpg "/home/pi/website/public/images/$(date +"%Y_%m_%d_%H_%M_%S").jpg"
sleep 15
raspistill -o /home/pi/website/public/curPicture.jpg -w 1600 -h 1200 -a 12 -ex night -t 5000
cp /home/pi/website/public/curPicture.jpg "/home/pi/website/public/images/$(date +"%Y_%m_%d_%H_%M_%S").jpg"
