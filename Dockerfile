FROM node:13
MAINTAINER forsrc <forsrc@gmail.com>

ARG PORT
ENV PORT=3000
ENV NODEJS_SSH_SHELL=
ENV NODEJS_SSH_SHELL_ARGS=

WORKDIR   /nodejs-ssh
COPY    . /nodejs-ssh

RUN rm -rf node_modules package-lock.json


RUN npm install
RUN npm run build

EXPOSE $PORT

ENV DEBIAN_FRONTEND=noninteractive
ARG USER
ENV USER=${USER:-forsrc}
ARG PASSWD
ARG PASSWD=${PASSWD:-forsrc}
RUN apt-get update
RUN apt-get install -y sudo
RUN useradd -m --shell /bin/bash $USER && \
    echo "$USER:$PASSWD" | chpasswd && \
    echo "$USER ALL=(ALL) ALL" >> /etc/sudoers
RUN apt-get clean
WORKDIR /home/$USER
USER $USER

WORKDIR   /nodejs-ssh

CMD [ "node", "index.js" ]
