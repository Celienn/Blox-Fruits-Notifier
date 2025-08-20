#!/bin/bash

#git pull origin main

npm run clean

docker build -t bloxfruitsnotifier-img .

docker stop bloxfruitsnotifier

docker rm bloxfruitsnotifier

docker run -d --restart always --name bloxfruitsnotifier bloxfruitsnotifier-img

