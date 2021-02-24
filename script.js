var csvUrl = "list.txt";

// GET のデータを配列にして返す
function GetQueryString(){
    var result = {};
    if (1 < window.location.search.length) {
        var query = window.location.search.substring(1);
        var parameters = query.split('&');
        for (var i=0; i<parameters.length; i++){
            var element = parameters[i].split('=');
            var paramName = decodeURIComponent(element[0]);
            var paramValue = decodeURIComponent(element[1]);
            result[paramName] = paramValue;
        }
    }
    return result;
}

// 読み込んだ CSV データを 2 次元配列に変換して返す
function convertCSVtoArray(str){
    var result = [];
    var tmp = str.split("\n");
    for (var i=0; i<tmp.length; i++){
        result[i] = tmp[i].split(',');
    }
    return result;
}

window.onload = function () {
    // GET を表に反映
    var g = GetQueryString();
    if (g["atcoder_id"]) atcoder_id.value = g["atcoder_id"];

    // 問題一覧を表示
    var req = new XMLHttpRequest();
    req.open("GET", csvUrl, false);
    req.send(null);
    var result = convertCSVtoArray(req.responseText);
    
    for (var i=0; i<result.length; i++) {
        if(result[i].length == 1) continue;
        var tr = problem_tbody.insertRow(-1);

        var th = document.createElement("th");
        th.innerHTML = result[i][0];
        th.scope = "row";
        tr.appendChild(th);

        var td1 = tr.insertCell(-1);
        td1.innerHTML = '<a href="' + result[i][2] + '" target="_blank">' + result[i][1] + '</a>';

        var td2 = tr.insertCell(-1);
    }

    // 提出状況を表示
    if (atcoder_id.value != "") {
        var text = atcoder_id.value.split(',');
        for (var k = 0; k < text.length; k++) {
            if(text[k] == '*') {
                problem_tbody.rows[i].cells[2].innerHTML += '<span class="label-blank">' + text[k] + '</span> ';
                continue;
            }
            var req = new XMLHttpRequest();
            req.open("GET", "https://kenkoooo.com/atcoder/atcoder-api/results?user=" + text[k], false);
            req.send(null);
            S = req.responseText.replace(/\r?\n/g, "");
            S = S.split('},{');
            for (var i = 0; i < problem_tbody.rows.length; i++) {
                var tmp = 0;
                var str = problem_tbody.rows[i].cells[1].innerHTML.replace(/\r?\n/g, "");
                var pid = str.match('tasks/.*" ')[0];
                var key = '"problem_id":"' + pid.substr(6, pid.length-8) + '"';
                for (var j = 0; j < S.length; j++) {
                    if (S[j].indexOf(key) != -1) {
                        if (S[j].indexOf('"result":"AC"') != -1) {
                            tmp = 2;
                            break;
                        }
                        else {
                            tmp = 1;
                        }
                    }
                }
                if (tmp == 2) {
                    problem_tbody.rows[i].cells[2].innerHTML += '<span class="label-ac">' + text[k] + '</span> ';
                }
                else if (tmp == 1) {
                    problem_tbody.rows[i].cells[2].innerHTML += '<span class="label-wa">' + text[k] + '</span> ';
                }
                else {
                    problem_tbody.rows[i].cells[2].innerHTML += '<span class="label-non">' + text[k] + '</span> ';
                }
            }
        }
    }
}
