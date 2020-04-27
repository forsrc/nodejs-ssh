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
sudo docker run -it -p 3000:3000 --rm --name nodejs-ssh -e NODEJS_SSH_SHELL=ssh  -e NODEJS_SSH_SHELL_ARGS="root@localhost, -p, 2222" forsrc/nodejs-ssh
```

https://localhost:3000/

https://127.0.0.1:3000/?cols=120&rows=50

https://localhost:3000/?ssh=forsrc@172.17.0.2&ssh_port=22
