
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


// 接続数を表す
var historical_proj = 0;
var running_proj = 0;

var historical_mobiles = 0;
var running_mobiles = 0;


// 成績
var correct = {
	all: {
		red : 0,
		white : 0
	},
	now:{
		red : 0,
		white : 0
	}
};

// server起動
var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// socket.io 利用
var socketIO = require("socket.io");
var io = socketIO.listen(server);


// 全員
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

// 運営
var unnei = io.of("/unnei").on("connection", function(socket){
	console.log("unnei connection");
	
	socket.on('message', function(data) {
		console.log("message");
		proj.emit("message",  {value: data.value});
		mobile.emit("message",  {value: data.value});
	});
	
	// 切断
	socket.on('disconnect',function(){
		console.log("unnei disconnect");
	});
});


// ビル
var proj = io.of("/proj").on("connection", function(socket){
	console.log("proj connection");
	historical_proj ++;
	running_proj++;
	
	// 切断
	socket.on('disconnect',function(){
		running_proj--;
		console.log("proj disconnect");
	});
});

// モバイル
var mobile = io.of("/mobile").on("connection", function(socket){
	console.log("mobile connection");
	historical_mobiles ++;
	running_mobiles++;
	
	// ボールに関するメッセージはビルへ
	socket.on("ball", function(data){
//		proj.volatile.emit("message",  {value: data.value});
		proj.emit("message",  {value: data.value});
	});
	
	// 正解は集計？そして、ビルへもメッセージ
	socket.on("answer", function(data){
		proj.emit("message",  {value: data.value});
		
	});

	// 切断
	socket.on('disconnect',function(){
		running_mobiles--;
		console.log("mobile disconnect");
	});
	
});





// 接続数を見る
app.get("/connections",function(req,res){
	var connections = {
		proj:{
			running: running_proj,
			historical: historical_proj
		},
		mobiles:{
			running: running_mobiles,
			historical: historical_mobiles
		}
	}
	res.send(JSON.stringify(connections));
});


// 成績クリア
app.get("/clearCorrects",function(req,res){
	
	correct = {
		all: {
			red : 0,
			white : 0
		},
		now:{
			red : 0,
			white : 0
		}
	};
	res.send("cleared");
});


