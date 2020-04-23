FROM node:13

ENV PORT=3000
ENV NODEJS_SSH_SHELL=
ENV NODEJS_SSH_SHELL_ARGS=


WORKDIR   /nodejs-ssh
COPY    . /nodejs-ssh

RUN rm -rf node_modules package-lock.json


RUN npm install
RUN npm run build

EXPOSE $PORT

CMD [ "node", "index.js" ]
