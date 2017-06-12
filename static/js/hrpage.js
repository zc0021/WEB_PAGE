/**
 * create by hxy 2017/2/6
 * @param pageNum
 */

/**
 * 添加标签
 * @param url
 * @param title
 */
function addTab(url,title) {
    top.topManager.openPage({
        href : url,
        title : title
    });
}


/**
 * 根据参数查找
 * @param pramas
 */
function findInfosByArgs(pramas) {
    bootbox.dialog({ message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> Loading...</div>' });
    $.post(urlInfo,pramas,function call(data){
        console.dir(data);
        document.getElementById('theBodyList').innerHTML = '';
        try{
            renderAll(data);//加载列表
        }catch(e){

        }
    },'json');
}

/**
 * 翻页
 * @param pageNum
 */
function findInfosByPage(pageNum) {
    bootbox.dialog({ message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> Loading...</div>' });
    pramas.pageNum = pageNum;
    //var p = JSON.stringify(pramas);
    $.post(urlInfo,pramas,function call(data){
        console.dir(data);
        document.getElementById('theBodyList').innerHTML = '';
        try{
            renderAll(data);//加载列表
        }catch(e){

        }
    },'json');
}

function renderAll(datas){
    var data;
    var count = 0;
    while(data = datas.shift()){
        render(data,count);
        if(count == 0){
            readPage(data);//加载页数
        }
        count++;
    }
    bootbox.hideAll();
}

function render(data,count){
    var _dom = document.createElement('tr');
    _dom.setAttribute( 'title',data.companyId );
    _dom.setAttribute( 'id','tr'+ count);
    if(data.unPayMealCount > 0){
        _dom.setAttribute('style','color:red');
    }
    _dom.innerHTML = tmp.replace( /(\{.+?\})/g,
        function($1)
        {
            if(null != data[ $1.slice( 1, $1.length-1 ) ] && "null" != data[ $1.slice( 1, $1.length-1 ) ]){
                return data[ $1.slice( 1, $1.length-1 ) ];
            }else{
                return '';
            }
        }
    );

    document.getElementById('theBodyList').appendChild( _dom );
}

var page_tmp =
    [
        '{total_count}条记录',
        '{current_page}/',
        '{total_page} 页',
        '<a class="sel_btn" href="javascript:findInfosByPage({pre_page})">上一页</a>',
        '<span class="current">{current_page}</span>',
        '<a class="sel_btn" href="javascript:findInfosByPage({next_page})">下一页</a>',
        '<a class="sel_btn" href="javascript:findInfosByPage({last_page})">最后一页</a>'
    ].join('');
function readPage(data) {
    console.dir(data);
    var _dom = page_tmp.replace( /(\{.+?\})/g,
        function($1)
        {
            return data[ $1.slice( 1, $1.length-1 ) ];
        }
    );
    document.getElementById('pageInfo').innerHTML = _dom;
}

/**
 * 获取URl参数
 * @param name
 * @returns {null}
 */
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

/**
 * 设置option
 * @param selectName
 * @param value 选中的值
 * @param url 请求路径
 */
function setOptions(selectName,value,url) {
    $.get(url,function (data) {
        while(info = data.shift()){
            var optionStr = "<option value='"+info.key+"'>"+info.value+"</option>";
            if(value == info.key){
                optionStr = "<option selected='selected' value='"+info.key+"'>"+info.value+"</option>";
            }
            $("select[name = "+selectName+"]").append(optionStr);
        }
    })
}

/**
 * 请求区域事件
 * @param selectName
 * @param inputName
 * @param value
 * @param arg
 */
function setOptionDistrict(selectName, inputName, value, arg) {
    var url = "../../console/constant/getAreaInfo";
    var args = new Object();
    args.parentNo = arg;

    $.get(url, args, function (data) {
        $("select[name = " + selectName + "]").empty();
        while (areaInfo = data.shift()) {
            var optionStr = "<option value='" + areaInfo.areaNo + "'>" + areaInfo.areaName + "</option>";
            if (value == areaInfo.areaNo) {
                optionStr = "<option selected='selected' value='" + areaInfo.areaNo + "'>" + areaInfo.areaName + "</option>";
                /*$("input[name =" + inputName + "]").val(areaInfo.areaNo);*/
            }
            $("select[name = " + selectName + "]").append(optionStr);
        }
    })
}

/**
 * 设置省份事件
 * @param selectName
 * @param inputName
 * @param arg
 */
function setOptionProvince(selectName, arg) {
    var url = "../../console/constant/getAreaInfo";
    var args = new Object();
    args.parentNo = arg;

    $.get(url, args, function (data) {
        $("select[name = " + selectName + "]").empty();
        var count = 0;
        while (areaInfo = data.shift()) {
            var optionStr = "<option value='" + areaInfo.areaNo + "'>" + areaInfo.areaName + "</option>";
            $("select[name = " + selectName + "]").append(optionStr)
            if (count == 0) {
                $("select[name = " + selectName + "]").next().val(areaInfo.areaNo);
                setOptionCity("area",areaInfo.areaNo);
            }
            count++;
        }
    })
}

/**
 * 设置市事件
 * @param selectName
 * @param inputName
 * @param value
 * @param arg
 */
function setOptionCity(selectName, arg) {
    var url = "../../console/constant/getAreaInfo";
    var args = new Object();
    args.parentNo = arg;

    $.get(url, args, function (data) {
        $("select[name = " + selectName + "]").empty();
        var count = 0;
        while (areaInfo = data.shift()) {
            var optionStr = "<option value='" + areaInfo.areaNo + "'>" + areaInfo.areaName + "</option>";
            $("select[name = " + selectName + "]").append(optionStr)
            if (count == 0) {
                $("select[name = " + selectName + "]").next().val(areaInfo.areaNo);
            }
            count++;
        }
    })
}

/**
 * 绑定省份改变事件
 */
function onChangProvince() {
    $("select[name='province']").change(function () {
        var that = $(this);
        var arg = that.children('option:selected').val();
        that.next().val(arg);
        //var val1 = $("input[name = 'cityId']").val();
        setOptionProvince("city", arg);
    });
}

/**
 * 绑定市改变事件
 */
function onChangCity() {
    $("select[name='city']").change(function () {
        var that = $(this);
        var arg = that.children('option:selected').val();
        that.next().val(arg);
        setOptionCity("area", arg);
    });
}

/**
 * 绑定区改变事件
 */
function onChangArea() {
    $("select[name='area']").change(function () {
        var that = $(this);
        var arg = that.children('option:selected').val();
        that.next().val(arg);
    });
}

/**
 * 设置option 并根据value选中
 * @param selectName
 * @param value
 * @param url
 */
function setSelectValueOption(selectName, value, url) {
    $.get(url, function (data) {
        while (info = data.shift()) {
            var optionStr = "<option value='" + info.key + "'>" + info.value + "</option>";
            if (value == info.key) {
                optionStr = "<option selected='selected' value='" + info.key + "'>" + info.value + "</option>";
            }
            $("select[name = " + selectName + "]").append(optionStr);
        }
    })
}
/**
 * 改变下拉框时同时改变影藏Input
 * @param name
 */
function selectChangeInput(name) {
    $("select[name = " + name + "]").change(function () {
        var that = $(this);
        that.next().val(that.children('option:selected').val());
    })
}


/**
 * 给省名搜索添加选项
 * @param selectName
 * @param arg
 */
function setSeachrovinceOption(selectName,arg) {
    var url = "../../console/constant/getAreaInfo";
    var args = new Object();
    args.parentNo = arg;
    $.get(url,args,function (data) {
        while(areaInfo = data.shift()){
            var optionStr = "<option value='"+areaInfo.areaNo+"'>"+areaInfo.areaName+"</option>";
            $("select[name = "+selectName+"]").append(optionStr);
        }
    })
}

/**
 * 给市区名搜索添加选项
 * @param selectName
 * @param arg
 */
function setSeachAreaAnfCityOption(selectName,arg) {
    var url = "../../console/constant/getAreaInfo";
    var args = new Object();
    args.parentNo = arg;
    $.get(url,args,function (data) {
        $("select[name = "+selectName+"]").empty();
        $("select[name = "+selectName+"]").append("<option value='-9999'>-请选择-</option>");
        while(areaInfo = data.shift()){
            var optionStr = "<option value='"+areaInfo.areaNo+"'>"+areaInfo.areaName+"</option>";
            $("select[name = "+selectName+"]").append(optionStr);
        }
    })
}


/**
 * 设置option
 * @param selectName
 * @param value 选中的值
 * @param url 请求路径
 */
function setOptionsKV(selectName,value,url) {
    $.get(url,function (data) {
        $.each(data,function(key,value){
            var optionStr = "<option value='"+key+"'>"+value+"</option>";
            if(value == key){
                optionStr = "<option selected='selected' value='"+key+"'>"+value+"</option>";
            }
            $("select[name = "+selectName+"]").append(optionStr);
        });
    })
}



/**
 * 20170608测试新增图片显示翻页
 * 翻页
 * @param pageNum
 */
function findImagesByPage(pageNum) {
    /*bootbox.dialog({ message: '<div class="text-center"><i class="fa fa-spin fa-spinner"></i> Loading...</div>' });*/
    pramas.pageNum = pageNum;
    //var p = JSON.stringify(pramas);
    $.post(urlInfo,pramas,function call(data){
        console.dir(data);
        document.getElementById('theBodyList').innerHTML = '';
        try{
            alert("111111111");
            renderImageAll(data);//加载列表
        }catch(e){

        }
    },'json');
}

function renderImageAll(datas){
    var data;
    var count = 0;
    while(data = datas.shift()){
        renderImage(data,count);
        if(count == 0){
            readImagePage(data);//加载页数
        }
        count++;
    }
    bootbox.hideAll();
}

function renderImage(data,count){
    //<img src="../static/images/1279602950.jpg" title="测试" id="test1" class="img-thumbnail">
    var _dom = document.createElement('li');
    _dom.setAttribute( 'title',data.pname );
   /* _dom.setAttribute( 'id','tr'+ count);
    if(data.unPayMealCount > 0){
        _dom.setAttribute('class','img-thumbnail');
    }*/
    alert("开始之前："+_dom.innerHTML);
    _dom.innerHTML = _dom.innerHTML.replace( /(\{.+?\})/g,
        function($1)
        {
            if(null != data[ $1.slice( 1, $1.length-1 ) ] && "null" != data[ $1.slice( 1, $1.length-1 ) ]){
                return data[ $1.slice( 1, $1.length-1 ) ];
            }else{
                return '';
            }
        }
    );
    alert("之后："+_dom.innerHTML);
    document.getElementById('theBodyList').appendChild( _dom );
}

function readImagePage(data) {
    console.dir(data);
    var _dom = page_tmp.replace( /(\{.+?\})/g,
        function($1)
        {
            return data[ $1.slice( 1, $1.length-1 ) ];
        }
    );
    document.getElementById('pageInfo').innerHTML = _dom;
}