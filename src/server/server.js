var os = require('os');
var pty = require('node-pty');
var io = require('socket.io')({path: '/ssh'});


var ioserver = {}

ioserver.run = function(server) {

	// let socket.io handle sockets
	io = io.listen(server, {log: false});
	//process.stdin.setRawMode(true);
	io.sockets.on('connection', function(socket) {
		ioserver.handle(socket);
	});

};

ioserver.handle = function(socket) {
	var id = socket.id;
	console.log(new Date().toISOString(), id, " -> ", socket.handshake.query);

	var shell = process.env.NODEJS_SSH_SHELL || 'ssh';
	var opts = process.env.NODEJS_SSH_SHELL_ARGS ? process.env.NODEJS_SSH_SHELL_ARGS.split(",") : [];
	if (shell === 'ssh' && !process.env.NODEJS_SSH_SHELL_ARGS) {
		opts = ['localhost'];
	}

	var ssh = socket.handshake.query.ssh;
	if (ssh && ssh != "null") {
		var ssh_port = socket.handshake.query.ssh_port || 22;
		shell = 'ssh';
		opts = [ssh, "-p", ssh_port];
		console.log(new Date().toISOString(), id, " -> ", opts);
	}
	console.log(new Date().toISOString(), id, " -> ", shell, opts);
	var term = pty.spawn(shell, opts, {
		name: 'xterm-color',
		cols: 120,
		rows: 50,
		cwd: process.env.HOME,
		env: process.env
	});

	var cmd = "";
	term.on('data', function(data) {
		if (data.indexOf('\r') != -1) {
			console.log(new Date().toISOString(), id, " ->  on term: ", cmd);
			cmd = '';
		} else {
			cmd += data;
		}

		if (socket) socket.emit('data', data);
	});


	term.on('exit', function() {
		console.log(new Date().toISOString(), " -> on term exit:  id -> ", id);
		if (socket) socket.disconnect();
	});

	console.log(new Date().toISOString(), " -> on connection: id -> ", id);

	// handle incoming data (client -> server)
	socket.on('data', function(data) {
		//console.log(new Date().toISOString(), "-> on data: ", data)
		term.write(data);
	});

	// handle connection lost
	socket.on('disconnect', function() {
		console.log(new Date().toISOString(), " -> on disconnect: id -> ", id);
		socket = null;
		try {
			term.kill();
			console.log(new Date().toISOString(), " -> on term.kill:  id -> ", id);
		} catch (err) {
			console.error(err);
		}
	});
	socket.on('resize', function(data) {
		console.log(new Date().toISOString(), " -> on resize:     id -> ", id, data);
		if (term) {
			try {
				term.resize(data.cols, data.rows);
			} catch (err) {
				console.error(new Date().toISOString(), id, " ->  on term: ", err);
			}
		}
	});
	process.on('exit', function() {
		try {
			term.kill();
			console.log(new Date().toISOString(), " -> process.exit:  id -> ", id);
		} catch (err) {
			console.error(err);
		}
	});

	setTimeout(function() {if (socket) socket.emit('init', "ok"); }, 1000);
}


module.exports = ioserver;
