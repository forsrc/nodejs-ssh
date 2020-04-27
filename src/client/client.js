var Terminal = require('xterm').Terminal;
var FitAddon = require('xterm-addon-fit').FitAddon;
var WebLinksAddon = require('xterm-addon-web-links').WebLinksAddon;
var io = require('socket.io-client');

var client = {};

client.run = function(options) {

	options = options || {};

	var socket = io(options.remote, {
		path : '/ssh'
	});
	socket.on('connect', function() {
		connect.style.color = "green";
		connect.isConnect = true;
		var term = new Terminal({
			cols : cols || 120,
			rows : rows || 50,
			useStyle : true,
			screenKeys : true,
			cursorBlink: true,
			cursorStyle: "underline",
			tabStopWidth: 4
		});

		var fitAddon = new FitAddon();
		term.loadAddon(fitAddon);
		term.loadAddon(new WebLinksAddon());

		term.open(options.parent || document.body);
		fitAddon.fit();


		var id = socket.id;
		console.log("-> on connect: id -> ", id)

		socket.on('data', function(data) {
			if (connect.isConnect) connect.style.color = "yellow";
			term.write(data);
			if (connect.isConnect) setTimeout(function(){connect.style.color = "green";}, 1000);
		});

		term.onData(function(data) {
			socket.emit('data', data);	
		});
		
		term.onResize(function(evt) {
			console.log({cols: evt.cols, rows: evt.rows});
			socket.emit('resize', {cols: evt.cols, rows: evt.rows});
		});

		// term.write('hello world\r\n');

		socket.on('disconnect', function() {
			connect.isConnect = false;
			connect.style.color = "red";
			setTimeout(function(){connect.style.color = "red";}, 1000);
			console.log("-> on disconnect: id -> ", id);
			//term.dispose();
		});

		socket.on('init', function(data) {
			if (data == 'ok') socket.emit('resize', {cols: cols, rows: rows});
		});
		
		window.addEventListener('resize', () => {
			fitAddon.fit();
			term.scrollToBottom();
		});
		
		document.body.onkeydown = function (event) {
			term.scrollToBottom();
		}


	});

};



var ssh = getParameterByName("ssh");
var ssh_port = getParameterByName("ssh_port");
var ssh_port = getParameterByName("ssh_port");
var cols = getParameterByName("cols") || 120;
var rows = getParameterByName("rows") || 50;
cols = parseInt(cols);
rows = parseInt(rows);

document.title = ssh ? 'ssh ' + ssh  + ' -p ' + (ssh_port || 22) : 'nodejs-ssh localhost';



var terminal = document.getElementById("terminal");
var connect = document.getElementById("connect");

client.run({
	parent : terminal,
	remote: location.protocol + '//' + window.location.host + '/?' + 
	+ 'name=nodejs-ssh'
	+ (ssh ? '&ssh=' + encodeURIComponent(ssh) : '')
	+ (ssh_port ? "&ssh_port=" + ssh_port : '')
	//remote : "http://localhost:3000"
});


function getParameterByName(name) {
	var url = window.location.search;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
	results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
