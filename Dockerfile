FROM node:18.17.0

WORKDIR /app

COPY package*.json ./
RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    libcairo2-dev \
    libjpeg-dev \
    libpango1.0-dev \
    libgif-dev \
    build-essential \
    g++
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start"]
