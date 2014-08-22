// -*- coding: utf-8-unix -*-
// $("#btn_submit").trigger(jQuery.Event("click"));
// $("#btn_submit").click(
// $(document).ready(function(){
function Init(){
    display_unnei_form();
    // var last_answer;
    $("#btn_prob_submit1").click(function(){
        console.log("clicked");
        if (confirm("送信しますか")){
            $("#selectable").selectable("disable");
            emit_prob(probs[1]);
        }
    });
    $("#btn_prob_submit2").click(function(){
        console.log("clicked");
        if (confirm("送信しますか")){
            $("#selectable").selectable("disable");
            emit_prob(probs[2]);
        }
    });
    $("#btn_prob_submit3").click(function(){
        console.log("clicked");
        if (confirm("送信しますか")){
            $("#selectable").selectable("disable");
            emit_prob(probs[3]);
        }
    });
    $("#btn_prob_submit0").click(function(){
        console.log("clicked");
        if (confirm("送信しますか")){
            $("#selectable").selectable("disable");
            emit_prob(probs[0]);
        }
    });
    $("#btn_ans_submit1").click(function(){
        console.log("clicked");
        if (confirm("送信しますか")){
            $("#selectable").selectable("disable");
            emit_ans(probs[1]);
        }
    });
    $("#btn_ans_submit2").click(function(){
        console.log("clicked");
        if (confirm("送信しますか")){
            $("#selectable").selectable("disable");
            emit_ans(probs[2]);
        }
    });
    $("#btn_ans_submit3").click(function(){
        console.log("clicked");
        if (confirm("送信しますか")){
            $("#selectable").selectable("disable");
            emit_ans(probs[3]);
        }
    });
    $("#btn_ans_submit0").click(function(){
        console.log("clicked");
        if (confirm("送信しますか")){
            $("#selectable").selectable("disable");
            emit_ans(probs[0]);
        }
    });
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
function display_unnei_form(){
    probid = ["probset1", "probset2", "probset3", "probset4"];
    // $("#prob,#probset1").value("texthoge");
    $("#prob1").val("hogehoge");
    // console.log($("#probset1,#prob"));
    console.log($("#prob,#probset1").value);
    for (var i = 0; i < probid.length; i++){
        // console.log($("#"+probid[i] + ",#prob"));
        console.log(probs[i].prob);
        console.log($("#prob,#"+probid[i]));
        $("#prob"+i).text(probs[i].prob);
        $("#ans_"+i+"1").text(probs[i].ans1);
        $("#ans_"+i+"2").text(probs[i].ans2);
        $("#ans_"+i+"3").text(probs[i].ans3);
        $("#ans_"+i+"4").text(probs[i].ans4);
        $("#true_ans"+i).text(probs[i].true_ans);
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
    ans4:"「暮らしと富士通」シリーズ",
    // true_ans:"「夢をかたちに。富士通が描く未来」シリーズ"
    true_ans:2,
    desc:""
};

var prob1 = {
    id:1,
    prob:"武蔵中原駅が出来たのは昭和何年？",
    ans1:"昭和2年",
    ans2:"昭和12年",
    ans3:"昭和22年",
    ans4:"昭和32年",
    true_ans:0,
    desc:""};
var prob2 = {
    id:2,
    prob:"現在の川崎市長の名前は？",
    ans1:"福島隆彦",
    ans2:"福間清彦",
    ans3:"福岡雅彦",
    ans4:"福田紀彦",
    true_ans:3,
    desc:""};
var prob3 = {
    id:3,
    prob:"スーパーコンピュータ「京」の演算速度は",
    ans1:"1ペタフロップス",
    ans2:"10ペタフロップス",
    ans3:"100ペタフロップス",
    ans4:"1000ペタフロップス",
    true_ans:1,
    desc:""};


var answers = ["「夢をかたちに。富士通が描く未来」シリーズ",
               "昭和2年",
               "福田紀彦",
               "10ペタフロップス"
              ];
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

function emit_ans(prob){
    var data =JSON.stringify({method:"timelimit",
                              options:{
                            answer:(1+prob.true_ans),
                              description:prob.desc}});
    console.log(data);
    SendMsg(data);
};
function emit_prob(prob){
    var data =JSON.stringify({method:"quizstart",
                              options:{
                            problem:prob.prob,
                            answer_1:prob.ans1,
                            answer_2:prob.ans2,
                            answer_3:prob.ans3,
                            answer_4:prob.ans4}});
    console.log(data);
    SendMsg(data);
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
