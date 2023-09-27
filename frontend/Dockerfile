FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g serve

# make the 'app' folder the current working directory
WORKDIR /app

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY build build

EXPOSE 8080
CMD [ "serve", "-s", "build" ]
