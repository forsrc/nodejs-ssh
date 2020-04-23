var Terminal = require('xterm').Terminal;
// var AttachAddon = require('xterm-addon-attach').AttachAddon;
var io = require('socket.io-client');

var client = {};

client.run = function(options) {

	options = options || {};

	var socket = io(options.remote, {
		path : '/ssh'
	});
	socket.on('connect', function() {
		var term = new Terminal({
			cols : 120,
			rows : 60,
			useStyle : true,
			screenKeys : true
		});
		var id = socket.id;
		console.log("-> on connect: id -> ", id)

		socket.on('data', function(data) {
			term.write(data);
		});

		term.open(options.parent || document.body);

		// var attachAddon = new AttachAddon(socket);
		// term.loadAddon(attachAddon);

		term.onData(function(data) {
			socket.emit('data', data);
		});

		// term.write('hello world\r\n');

		socket.on('disconnect', function() {
			console.log("-> on disconnect: id -> ", id)
			//term.dispose();
		});

		// for displaying the first command line
		socket.emit('data', '\n');
	});

};

var ssh = getParameterByName("ssh");
var ssh_port = getParameterByName("ssh_port") || 22;


var e = document.getElementById("terminal");

client.run({
	parent : e,
	remote: location.protocol + '//' + window.location.host + '/?' + 
	+ 'name=nodejs-ssh'
	+ '&ssh=' + encodeURIComponent(ssh)
	+ "&ssh_port=" + ssh_port
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
