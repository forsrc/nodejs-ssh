//var http = require('http');
var https = require('https');
var express = require('express');
var terminal = require('term.js');
var path = require('path');
var fs = require("fs");

var options = {
	key: fs.readFileSync('./ssl/privatekey.pem'),
	cert: fs.readFileSync('./ssl/certificate.pem')
};

var ioserver = require('./src/server/server.js');

var app = express();
app.use('/static', express.static('src/client'));

app.get('/' , function(req, res){
	res.sendFile(path.resolve(__dirname + '/src/client/index.html'));
});

app.get('/healthz' , function(req, res){
	res.send("ok");
});

app.use(terminal.middleware());

//var server = http.createServer(app);
//server.listen( process.env.PORT || 3000);
var port = process.env.PORT || 3000;
var server = https.createServer(options, app).listen(port, function () {
	console.log('Nodejs-ssh Https server listening on port', port);
});


ioserver.run(server);
