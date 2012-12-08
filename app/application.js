define(['express'], function(express) {
	var app = express()
	  , server = require('http').createServer(app)
	  , io = require('socket.io').listen(server,  { log: false });
	return {
		app: app,
		io: io,
		express: express,
		server: server
	};
});