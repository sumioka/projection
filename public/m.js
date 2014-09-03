
// クエリ解析：ユーザ情報表示
var name = "";
var icon = "";

if(location.search != ""){
    var tmp=location.search.substring(1,location.search.length);
    var tmp2=tmp.split("&");
    for(i in tmp2){
        var key = tmp2[i].split("=")[0];
        var val = tmp2[i].split("=")[1];
        if (key == "name"){
            name = val;
            document.getElementById("name").innerHTML = val;
        }
        if (key == "icon"){
            icon = val;
        }
    }
} else {
    location.href = "a.html";
}

function myanswer(){
    var pos = $("#div1").position();
    var wh = $(window).height();
    var ww = $(window).width();
    if (pos.top < wh/2){
        if (pos.left < ww/2){
            return 1;
        }else{
            return 2;
        }
    }else{
        if (pos.left < ww/2){
            return 3;
        }else{
            return 4;
        }
    }
}

function Init(){
    var team = (Math.floor( Math.random() * 101 ) > 50) ? "red" : "white";
    document.getElementById("team").innerHTML = team;
    $("#debug").text("hogehoge");
    console.log($("#debug"));

// 動かすオブジェクトの描画
$.fn.draggable = function() {
    var offset = null;
    var start = function(e) {
        var orig = e.originalEvent;
        var pos = $(this).position();
        offset = {
            x: orig.changedTouches[0].pageX - pos.left,
            y: orig.changedTouches[0].pageY - pos.top
        };
    };
    var moveMe = function(e) {
        e.preventDefault();
        var orig = e.originalEvent;
        $(this).css({
            top: orig.changedTouches[0].pageY - offset.y,
            left: orig.changedTouches[0].pageX - offset.x
        });
        var xx = orig.changedTouches[0].pageX - offset.x;
        var yy = orig.changedTouches[0].pageY - offset.y;
        var off = $("#div1").position();
        $("#debug").text("(h,w)=(" + $(window).height() + "," + $(window).width() + "), (y,x)=(" + yy +", " + xx + ")"
                        + " my answer is " + myanswer()
                        + " off("+off.left+","+off.top+")"
                        );
        // $("#debug").text("(h,w)=(" + $(window).height() + "," + $(window).width() + "), (y,x)=(" + yy +", " + xx + ")"
        //                 + " my answer is " + myanswer(xx, yy));

        // $("#debug").text("(h,w)=(" + $(window).height() + "," + $(window).width() + "), (y,x)=(" + off.top()  +", " + xx + ")"
        SendMsg("ball", JSON.stringify({method:"move", options:{x:xx, y:yy,id: socket.io.engine.id,termId:socket.io.engine.id}}));    
    };
    this.bind("touchstart", start);
    this.bind("touchmove", moveMe);
};
    $(".draggable").draggable();
};

// $(".draggable").draggable();


// 　サーバとのコネクションの作成
// var socket = io.connect('http://lightball.herokuapp.com/mobile');
// var socket = io.connect('http://localhost:3000');
var socket = io.connect('http://192.168.0.5:3000');
socket.on('connect', function(msg) {
    console.log("connect");
    document.getElementById("connectId").innerHTML = 
        "あなたの接続ID::" + socket.io.engine.id;

    SendMsg("ball", JSON.stringify({
        method:"useradd",
        options:{
            name: name,
            team: team,
            icon: icon,
            x: $("#div1").position().left,
            y: $("#div1").position().top,
            id: socket.io.engine.id,
            termId:socket.io.engine.id
        }
    }));    
});


function answerresult( options ){
	  if ( options.result == 'true' ){
		    $("#" + options.id).css( { 'background-color':'rgba(255,255,0,0.8)' });


		    timers.push(
			      setInterval(function(){ $('#' + options.id ).fadeOut(200,function(){$(this).fadeIn(200)}); },200)
		    );

		    

		    if ( options.team == 'red' ){
			      score_red++;
		    }else if ( options.team == 'white' ){
			      score_white++;
		    }

		    $( '#score_red' ).html( score_red );
		    $( '#vs' ).html( ":" );
		    $( '#score_white' ).html( score_white );
	  }
}

// メッセージを受けたとき
socket.on('message', function(msg) {
    // メッセージを画面に表示する
    document.getElementById("receiveMsg").innerHTML = msg.value;
    if(msg.value){
        try{
            var msgObj = JSON.parse(msg.value);
            switch(msgObj.method){
            case "quizstart":
                document.getElementById("info").innerHTML = "レッツ回答！";
                break;
            case "timelimit":
                //                   if(screen.width / 2)
                var ans = msgObj.options["answer"];
                var myans = myanswer();
                var disp_msg = "答えは" + ans + "!!!<br/>";
                // disp_msg += "あなたの答えは" + +;
                document.getElementById("info").innerHTML = disp_msg;
                SendMsg("answer",
                        {
                            method:"answerresult",
                            options:
                            {
                                'result':ans==myans,
                                'id':socket.io.engine.id,
                                'team':'red' 
                            }
                        }
                       )
                break;
            default:
            }
        } catch (error){
            document.getElementById("errorMsg").innerHTML = error;
        }
    }
});

// メッセージを送る
function SendMsg(target,msg) {
    //  var msg = document.getElementById("message").value;
    // debug
    // $("#connectId").text(msg);
    // メッセージを発射する
	  if(target == "ball"){
        socket.emit(target, { value: msg });
	  } else {
        socket.emit(target, { value: msg });
	  }
}
// 切断する
function DisConnect() {
    var msg = JSON.stringify({method:disconnect, options:{termId:socket.io.engine.id}});
    // メッセージを発射する
    socket.emit('message', { value: msg });
    // socketを切断する
    socket.disconnect();
}
//-->



