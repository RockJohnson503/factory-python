/*
 * 渲染的table的id 重要，重要。渲染多个table的关键（这个留着我下次再封装吧，突然感觉还要考虑很多东西）
 * jsonData:数据（这里是使用的固定数据，因为ajax本地跨域的问题，所以没有使用ajax传递数据，项目中，需根据实际环境做出调整）
 * 每页展示的数据条数,默认为5 可填写的格式为，number true(为默认)
 * 可修改的每页展示条数，默认为[5,10,20];，填写格式为 array true(为默认)
 * 是否添加翻页选中效果 此处使用了set集合的形式，避免重合，所以请使用唯一标识来区别 true 默认打开，false 关闭
 * */
//取消修改产品
function cancleOperat(node) {
    let td = node.parent().parent();
    let vals = td.attr("_val");

    let txtHtml = td.attr("_id") === "1" ? $("<span onclick='href($(this))'>" + vals + "</span>") : vals;
    td.empty();
    td.append(txtHtml);

    td.parent().removeClass("changing");
}

//修改产品
function changeDatas(td, type){
    let vals = td.text();

    if(checkOperat(td.parent().parent().children())){return ;}
    //加上标示
    td.parent().addClass("changing");
    if(type === "id"){td.attr("_id", 1)}
    td.attr("_val", vals);
    td.empty();
    td.append($("<div class='ui input'><input id='changeInp' autofocus type='text' value='" + vals + "'/></div>"));

    //修改产品的开关
    $("#changeInp").bind("keypress", function (ev) {
        if(ev.which === 13){
            changeProduct(td, type, vals);
            td.parent().removeClass("changing");
        }
    });
}

/*设置每页显示的条数S*/
function changePages(pageNum){
    tableNum=pageNum;
    if(backupAataArray.length>tableNum){
        filtrateTable=backupAataArray.slice(0,tableNum);
    }else{
        filtrateTable=backupAataArray.slice(0);
    }
    if(getDatas("changeTableNum?tableNum=" + tableNum) === null){alert("获取数据失败!code(11)"); return}
    tableCreate();
    createPages();
}

//取消输入
function cancle(node) {
    let tbody = document.getElementById("userImportTable").getElementsByTagName("tbody")[0];
    let tr = node.parentNode.parentNode;
    tbody.removeChild(tr);
}

//检查是否有操作
function checkOperat(node) {
    if(node.hasClass("adding") || node.hasClass("changing")){
        alert("正在添加或修改产品, 无法切换操作!");
        return true;
    }
}

//获取当前点击数量极其下标 展示获取的数据
function addDatas(){
    let trs = $("#userImportTable tbody tr");

    if(checkOperat(trs)){return ;}
    let trHtml=$("<tr class='adding'>"+
        "<td><div class='ui input'><input type='text' placeholder='请输入...'></div></td>"+
        "<td><div class='ui input'><input type='text' placeholder='请输入...'></div></td>"+
        "<td><div class='ui input'><input type='text' placeholder='请输入...'></div></td>"+
        "<td><div class='ui input'><input type='text' placeholder='请输入...'></div></td>"+
        "<td><div class='ui input'><input type='text' placeholder='请输入...'></div></td>"+
        "<td><div class='ui input'><input type='text' placeholder='请输入...'></div></td>"+
        "<td><div class='ui input'><input type='text' placeholder='请输入...'></div></td>"+
        "<td><button class='checkBtn' onclick='checkAddDatas(this)'>确定</button> " +
        "<button class='checkBtn ml' onclick='cancle(this)'>取消</button></td>"+
    "</tr>");
    $("#userImportTable>tbody").prepend(trHtml);
}

//改变操作按钮
function operatToggle() {
    let trs = $("#userImportTable tbody tr");

    if(checkOperat(trs)){return ;}
    for(let i = 0; i < trs.length; i++){
        let optd = trs.eq(i).children().eq(-1);//操作栏的td

        if(optd.children().length === 2){
            optd.empty();
            optd.append($("<button class='checkBtn delBtn' onclick='deleteDatas($(this))'>删除</button>"));
        }else{
            optd.empty();
            let txtHmlt = $("<button class='checkBtn showModal'>入库</button>" +
                " <button class='checkBtn showModal ml'>领料</button>");
            optd.append(txtHmlt);
        }
    }
    //加载弹窗
    loadModal();
}

//更新
function update(url) {
    res = getDatas(url);
    if(res === -1){
        alert("您还没有安装git!")
    }else if(res === 0){
        alert("更新失败!")
    }else {
        alert("更新成功,请重启服务器并刷新!")
    }
}