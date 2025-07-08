FROM node:18

WORKDIR /usr/src/app

# Clean up lock and node_modules (during build)
RUN rm -rf package-lock.json node_modules

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]
