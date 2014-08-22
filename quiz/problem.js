// -*- coding: utf-8-unix -*-
// $("#btn_submit").trigger(jQuery.Event("click"));
// $("#btn_submit").click(
// $(document).ready(function(){
function Init(){
    // $("button:first").click(function () {
    //   update($("span:first"));
    // });
    // $("button:last").click(function () {
    //   $("button:first").trigger('click');

    //   update($("span:last"));
    // });

    // function update(j) {
    //   var n = parseInt(j.text(), 0);
    //   j.text(n + 1);
    // }

    var last_answer;
    $("#btn_submit").click(function(){
        console.log("clicked");
        // var state = $.data(ui.selecting, "selectable-item");
        var answer_str = jQuery('.ui-selected').text();
        console.log(answer_str);
        if (confirm(answer_str + "で送信しますか")){
            $("#selectable").selectable("disable");
            emit_answer(answer_str);
        }
    });
    $("#btn_next").click(function(){
        console.log("btn_next clicked");
        if (probid() + 1 < probs.length){
            display_problem(probs[probid() + 1]);
        }
    });
    console.log("initial probid=" + probid());
    display_problem(probs[probid()]);
    console.log($("#answer_box"));
    // $("#answer_box").css("visible",  "hidden");
};

//     参考<a href="http://jad.fujitsu.com">広告宣伝 : 富士通 http://jad.fujitsu.com/
// </a>
function probid(){
    return parseInt($("#num_prob").text());
}


function display_problem(prob){
    console.log("display_problem");
    console.log(prob);
    $("#problem_box").text("問題：" + prob.prob);
    $("#ans1").text(prob.ans1);
    $("#ans2").text(prob.ans2);
    $("#ans3").text(prob.ans3);
    $("#ans4").text(prob.ans4);
    $("#num_prob").text(prob.id);

    // set blank to the answer box
    $("#answer_box").text("");
    $("#answer_box").hide();
    if (prob.id != 5){
        $("#btn_next").hide();
        $("#selectable").selectable("enable");
        // $("#selectable").selectable("refresh");        
    }
}

function display_answer(true_answer, res){
    console.log("display_answer:" + true_answer);
    console.log($("#answer_box"));
    $("#answer_box").text("答え：" + true_answer);
    $("#answer_box").show("fast");
    $("#btn_next").show("fast");
    console.log(res);
    $("#result").text(res);
}

var prob0 = {
    id:0,
    prob:"次の内，富士通が現在行っているCM広告シリーズではないものを選べ",
    ans1:"「あなたの未来に。富士通の技術」シリーズ",
    ans2:"「ビジネスの未来に。富士通の技術」シリーズ",
    ans3:"「夢をかたちに。富士通が描く未来」シリーズ",
    ans4:"「暮らしと富士通」シリーズ"};
var prob1 = {
    id:1,
    prob:"武蔵中原駅が出来たのは昭和何年？",
    ans1:"昭和2年",
    ans2:"昭和12年",
    ans3:"昭和22年",
    ans4:"昭和32年"};
var prob2 = {
    id:2,
    prob:"現在の川崎市長の名前は？",
    ans1:"福島隆彦",
    ans2:"福間清彦",
    ans3:"福岡雅彦",
    ans4:"福田紀彦"};
var prob3 = {
    id:3,
    prob:"スーパーコンピュータ「京」の演算速度は",
    ans1:"1ペタフロップス",
    ans2:"10ペタフロップス",
    ans3:"100ペタフロップス",
    ans4:"1000ペタフロップス"};


var probs = [prob0, prob1, prob2, prob3];


// var socket = io.connect('http://192.168.0.5:3000');
socket.on('connect', function(msg) {
  console.log("connet");
  document.getElementById("connectId").innerHTML = 
    "あなたの接続ID::" + socket.io.engine.id;
});

// メッセージを受けたとき
socket.on('message', function(msg) {
   // メッセージを画面に表示する
    console.log("message uketori");
    console.log(msg);
   document.getElementById("receiveMsg").innerHTML = msg.value;
    try{
        var msgObj = JSON.parse(msg.value);
        console.log(msgObj);
        switch(msgObj.method){
        case "true_answer":
            display_answer(msgObj.answer, msgObj.res);
            break;
        case "disconnect":
        default:

        }
    } catch (error){
        document.getElementById("errorMsg").innerHTML = error;
    }
});

function emit_answer(str_answer){
    SendMsg(JSON.stringify({method:"user_answer",
                            answer:str_answer,
                            cur_prob:probid()
                           }));
};

// メッセージを送る
function SendMsg(msg) {
//  var msg = document.getElementById("message").value;
  // メッセージを発射する
  socket.emit('message', { value: msg });
}
// 切断する
function DisConnect() {
  var msg = JSON.stringify({method:disconnect, options:{termId:socket.io.engine.id}});
  // メッセージを発射する
  socket.emit('message', { value: msg });
  // socketを切断する
  socket.disconnect();
}
