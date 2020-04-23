# nodejs-ssh

```
npm install
npm run build
npm start
```
```
sudo docker build . -t forsrc/nodejs-ssh --rm
sudo docker run -it -p 3000:3000 --rm --name nodejs-ssh forsrc/nodejs-ssh
sudo docker run -it -p 3000:3000 --rm --name nodejs-ssh -e NODEJS_SSH_SHELL=bash forsrc/nodejs-ssh
```
http://localhost:3000/
http://localhost:3000/?ssh=forsrc@172.17.0.2&ssh_port=22
