#!/bin/bash

git pull origin main

docker build -t bloxfruitnotifier-img .

docker stop bloxfruitnotifier

docker rm bloxfruitnotifier

docker run -d --name bloxfruitnotifier bloxfruitnotifier-img
