FROM node:17-alpine
WORKDIR /mediaplayer_frontend
COPY ["package.json","package-lock.json","./"]
RUN npm install
ENV PATH ./node_modules/.bin:$PATH
COPY . .
CMD ["npm", "start"]