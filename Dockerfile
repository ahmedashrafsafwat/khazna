FROM node:14

WORKDIR /

COPY /package.json .

RUN npm install

COPY / .

# in real development enviornment there would be 
# different docker containers for each backend service
EXPOSE 3000
EXPOSE 3001
EXPOSE 3002
EXPOSE 3003


CMD [ "npm", "start" ]

