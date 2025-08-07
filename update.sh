#!/bin/bash

#git pull origin main

npm run clean

docker build -t bloxfruitnotifier-img .

docker stop bloxfruitnotifier

docker rm bloxfruitnotifier

docker run -d --restart always --name bloxfruitnotifier bloxfruitnotifier-img

