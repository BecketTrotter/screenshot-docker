FROM node:latest

RUN apt-get update && \
    apt-get install -y wget && \
    wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && \
    dpkg --unpack google-chrome-stable_current_amd64.deb && \
    apt-get install -f -y && \
    apt-get clean && \
    rm google-chrome-stable_current_amd64.deb


COPY . .
RUN npm install express --save

# Expose debug port 9222
EXPOSE 8080

CMD ["node", "server.js"]