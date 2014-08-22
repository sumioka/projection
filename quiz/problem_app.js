// -*- coding: utf-8-unix -*-
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var connect = require('connect');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var sleep = require('sleep');

var app = express();

// all environments
// app.set('port', process.env.PORT || 5000);
app.set('port', process.env.PORT || 5000);
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



// socket.io
var socketIO = require("socket.io");
var io = socketIO.listen(server);

var answers = ["「夢をかたちに。富士通が描く未来」シリーズ",
               "昭和2年",
               "福田紀彦",
               "10ペタフロップス"
              ];
var counter = new Array(answers.length);
var num_correct_answer = new Array(answers.length);
var is_answered = new Array(answers.length);
for (var i = 0; i < answers.length; i++){
    counter[i] = 0;
    num_correct_answer[i] = 0;
    is_answered[i] = false;
}

function result(){
    var res = "";
    for (var i = 0; i < answers.length; i++){
        if (is_answered[i]){
            res += "問題"+ (i+1) + " : "+ num_correct_answer[i] + "/" + counter[i];
            res += ", ";
        }
    }
    return res;
}

function emit_after_wait(id){
    // if (!is_answered[id]){
    if (true){
        is_answered[id] = true;
        sleep.sleep(1);
        console.log("true answer is " + answers[id]);
        var newprob = undefined;
        if ((id + 1) < probs.length){
            newprob = probs[id+1];
        }
        io.sockets.emit("message",
                        {value:JSON.stringify(
                        {method:"true_answer",
                         answer:answers[id],
                         res:result(),
                         prob:newprob
                        }
                        )});
    }
}



io.sockets.on('connection', function(socket){
	  console.log("connection");
	  // socket.on('message', function(data) {
	  // 	console.log("message");
	  // 	io.sockets.emit('message', {value: data.value});
	  // });

	  socket.on('disconnect', function(){
		    console.log("disconnect");
	  });

    // 追加 後藤
    socket.on('message', function(obj){
        console.log("surver get");
        console.log(obj);
        var user = JSON.parse(obj.value);
        console.log(user);
        // sleep.sleep(1); // 3秒答えを出すのを待つ
        // console.log("true answer emit");
        counter[user.cur_prob]++;
        if (user.answer == answers[user.cur_prob]){
            num_correct_answer[user.cur_prob]++;
        }
        emit_after_wait(user.cur_prob);
    });
});
