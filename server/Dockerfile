FROM node:20-alpine

# ffmpeg/ffprobe for thumbnails + aspect detection
RUN apk add --no-cache ffmpeg

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY index.js ./

ENV PORT=8080
EXPOSE 8080
CMD ["node", "index.js"]
