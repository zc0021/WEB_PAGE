/*打开右侧显示页面，左侧菜单页面不变化
* 问题点：右侧页面里面胡script不执行
* */
function showPage(url) {
    var xmlHttp;

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlHttp=new XMLHttpRequest();    //创建 XMLHttpRequest对象
    }
    else {
        // code for IE6, IE5
        xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlHttp.onreadystatechange=function() {
        //onreadystatechange — 当readystate变化时调用后面的方法

        if (xmlHttp.readyState == 4) {
            //xmlHttp.readyState == 4    ——    finished downloading response

            if (xmlHttp.status == 200) {
                //xmlHttp.status == 200        ——    服务器反馈正常

                document.getElementById("content").innerHTML=xmlHttp.responseText;    //重设页面中id="content"的div里的内容
                executeScript(xmlHttp.responseText);    //执行从服务器返回的页面内容里包含的JavaScript函数
            }
            //错误状态处理
            else if (xmlHttp.status == 404){
                alert("出错了☹   （错误代码：404 Not Found），……！");
                /* 对404的处理 */
                return;
            }
            else if (xmlHttp.status == 403) {
                alert("出错了☹   （错误代码：403 Forbidden），……");
                /* 对403的处理  */
                return;
            }
            else {
                alert("出错了☹   （错误代码：" + request.status + "），……");
                /* 对出现了其他错误代码所示错误的处理   */
                return;
            }
        }

    }

    //把请求发送到服务器上的指定文件（url指向的文件）进行处理
    xmlHttp.open("GET", url, true);        //true表示异步处理
    xmlHttp.send();
}

/**
 * 必须确保加载的右边区域有id=content的部分
 * @param url
 */
function showRightPage(url){
    $("#content").load(url);
}


var request = {
    QueryString : function(val) {
        var uri = window.location.search;
        var re = new RegExp("" +val+ "\=([^\&\?]*)", "ig");
        return ((uri.match(re))?(uri.match(re)[0].substr(val.length+1)):null);
    },
    QueryStrings : function() {
        var uri = window.location.search;
        var re = /\w*\=([^\&\?]*)/ig;
        var retval=[];
        while ((arr = re.exec(uri)) != null)
            retval.push(arr[0]);
        return retval;
    },
    setQuery : function(val1, val2) {
        var a = this.QueryStrings();
        var retval = "";
        var seted = false;
        var re = new RegExp("^" +val1+ "\=([^\&\?]*)$", "ig");
        for(var i=0; i<a.length; i++) {
            if (re.test(a[i])) {
                seted = true;
                a[i] = val1 +"="+ val2;
            }
        }
        retval = a.join("&");
        return "?" +retval+ (seted ? "" : (retval ? "&" : "") +val1+ "=" +val2);
    }
}

