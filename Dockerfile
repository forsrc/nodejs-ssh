FROM node:13
MAINTAINER forsrc <forsrc@gmail.com>

ENV PORT=3000
ENV NODEJS_SSH_SHELL=
ENV NODEJS_SSH_SHELL_ARGS=

ENV DEBIAN_FRONTEND=noninteractive
ENV USER=forsrc
ARG PASSWD=forsrc
RUN apt-get update
RUN apt-get install -y sudo
RUN useradd -m --shell /bin/bash $USER && \
    echo "$USER:$PASSWD" | chpasswd && \
    echo "$USER ALL=(ALL) ALL" >> /etc/sudoers

WORKDIR   /nodejs-ssh
COPY    . /nodejs-ssh

RUN rm -rf node_modules package-lock.json


RUN npm install
RUN npm run build

EXPOSE $PORT

WORKDIR /home/$USER
USER $USER

CMD [ "node", "index.js" ]
