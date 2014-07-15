
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var connect = require('connect');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/', routes.index);
//app.get('/users', user.list);


var balls = {"id": "options"}; // {id1: options1, id2: options2, ...}

app.get('/balls',function(req,res){
	res.send(JSON.stringify(balls));
});



var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



// socket.io 利用
var socketIO = require("socket.io");
var io = socketIO.listen(server);

io.sockets.on('connection', function(socket){
	console.log("connection");
	socket.on('message', function(data) {
		console.log("message");
		io.sockets.emit('message', {value: data.value});
	});

	socket.on('disconnect',function(){
		console.log("disconnect");
	});
});

