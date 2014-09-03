
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
        $("#debug").innerHTML = "hoge";
        e.preventDefault();
        var orig = e.originalEvent;
        $(this).css({
            top: orig.changedTouches[0].pageY - offset.y,
            left: orig.changedTouches[0].pageX - offset.x
        });
        SendMsg("ball", JSON.stringify({method:"move", options:{x:orig.changedTouches[0].pageX - offset.x, y:orig.changedTouches[0].pageY - offset.y,id: socket.io.engine.id,termId:socket.io.engine.id}}));    
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
                document.getElementById("info").innerHTML = "答えは・・・？";
                SendMsg("answer",
                        {
                            method:"answerresult",
                            options:
                            {
                                'result':'true',
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



