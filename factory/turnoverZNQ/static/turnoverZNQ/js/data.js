//获取数据
function getDatas(urls){
    let results;
    $.ajax({
        url : urls,
        type : "GET",
        async : false,
        success : function (data) {
             results = data;
        },
        error : function (err) {
            console.log(err);
            alert("数据获取失败!code(0)");
            return null;
        }
    });
    return results;
}

//型号的操作
function idOperat(id, type, operat){
    let modalHeader = $(".modal-header strong")[0];

    if(modalHeader.innerText !== ""){
        $(".modal-body .input-group").eq(0).css("display", "");
        modalHeader.childNodes[0].remove();
    }
    if(operat === "领料"){
        $(".modal-body .input-group").eq(0).css("display", "none");
    }
    modalHeader.setAttribute('_id', id);
    modalHeader.append(operat + "型号: " + type);
}

//检查批次号输入的数据
function checkOpDatas() {
    let modalHeader = $(".modal-header strong")[0];
    // let thisFactory = modalHeader.getAttribute("_factory");
    let this_id = Number(modalHeader.getAttribute("_id"));
    // let thisName = modalHeader.getAttribute("_name");
    let bill_id = $("input[name = 'keys']").val();
    let amounts = Number($("input[name = 'amounts']").val());
    let dates = $("input[name = 'dates']").val();
    let date = new Date();
    let results = "";
    // let product = jsonSearch({"factory": thisFactory, "id": thisId, "name": thisName}).data[0];
    // let keys = getDatas("getJsonData?cur=keyNum");
    //
    if(dates && !/(\d{1,2})\-(\d{1,2})/.test(dates)){
        alert("请输入正确的时间!");
        return ;
    }

    let txt = (bill_id ? ("批次号: " + bill_id + ", ") : "") + "数量: " + amounts + ", 时间: " + dates;
    let check = confirm("您输入的信息是:\n" + txt + "\n请仔细确认!");
    if(!check){
        return ;
    }

    // //具体操作
    if(modalHeader.innerText.indexOf("入库") !== -1){
        if(!bill_id || !amounts){alert("请输入批次号和数量!");return ;}
        res = {"bill_id": bill_id, "operate": "入库", "num": amounts,
            "time": date.getFullYear() + "-" + (dates || (date.getMonth()+1) + "-" + date.getDate())};
        if(getDatas('/detail/{1}/add/?args='.replace("{1}", this_id) + JSON.stringify(res)) === 'err'){alert("入库失败!code(3)"); return ;}
    }else{
        if(!amounts){alert("请输入数量!");return ;}
        res = {"operate": "领料", "num": amounts, "time": date.getFullYear() + "-" + (dates || (date.getMonth()+1) + "-" + date.getDate())};
        res = getDatas('/detail/{1}/add/?args='.replace("{1}", this_id) + JSON.stringify(res));
        if(res === 'err'){alert("领料失败!code(4)"); return ;}
        else if(res === 'big'){alert("库存不足!"); return ;}
    }
    location.reload();
}

//检查添加输入的数据
function checkAddDatas(node) {
    let trNode = node.parentNode.parentNode;
    let inputNodes = trNode.getElementsByTagName("input");
    let results = {
        "factory": "",
        "id": "",
        "name": "",
        "first": 0,
        "now": 0,
        "in": 0,
        "out": 0
    };

    //页面被修改
    if(inputNodes.length !== 7){
        alert("页面已被篡改,请按F5刷新页面后重新操作!");
        return ;
    }

    //获取数据
    let i = 0;
    for(let k in results){
        let vals = inputNodes[i].value;

        //转换数据类型
        if(i >= 3){
            vals = Number(vals);
            if(!vals && vals !== 0){
                alert("请输入数字!");
                return ;
            }
        }

        if(vals !== ""){
            results[k] = vals;
        }
        i++;
    }

    //验证必输入字段
    if(results.id === "" || results.name === ""){
        alert("您还没填写产品的型号和名称!");
        return ;
    }

    //验证完毕
    if(results.now !== results.first + results.in - results.out){
        alert("添加的数据异常,请检查您输入的期初.现存.入库合计和领料合计是否错误!");
        return ;
    }
    let txt = "厂家: " + results.factory + ",  型号: " + results.id +
        ",  名称: " + results.name + ",  期初: " + results.first +
        ",  现存: " + results.now + ",  入库合计: " + results.in +
        ",  领料合计: " + results.out;
    let check = confirm("您输入的产品是:\n" + txt + "\n请仔细确认!");
    if(!check){return ;}

    let q = getDatas('/product/add/?args=' + JSON.stringify(results));
    if(q === 'err'){
        alert("添加产品失败!");
    }else if(q === 'duplicate'){
        alert("添加的重复产品!")
    }else if(q === null){
        alert("添加产品失败!code(2)");
    }else{
        location.reload();
    }
}

//删除产品的操作
function deleteDatas(node) {
    let tr = node.parent().parent();

    sure = confirm("确认要删除此产品吗!");
    if(!sure){return}

    if(getDatas("/product/delete/?id=" + tr.attr('_id')) === 'err'){alert("删除产品失败!"); return}
    location.reload();
}

//修改产品信息
function changeProduct(td, type, rData) {
    let vals = td.find("input").val();
    let datas = {};
    let results = [{"factory": td.parent().children().eq(0).text(), "id": td.parent().children().eq(1).text(),
        "name": td.parent().children().eq(2).text()}];
    let first = Number(type === "first" ? vals : td.parent().children().eq(3).text());
    let oin = Number(td.parent().children().eq(5).text());
    let out = Number(td.parent().children().eq(6).text());

    datas[type] = vals;
    results.push(datas);
    for(let i = 0; i < 3; i++){
        if(td.parent().children().eq(i).attr("_val")){
            results[0][type] = rData;
        }
    }

    if(getDatas("changeProduct?origin=" + JSON.stringify(results[0]) + "&datas=" + JSON.stringify(results[1])) === null){
        alert("修改产品失败!code(10)");
        return ;
    }
    td.text(vals);
    td.parent().children().eq(4).text(first + oin - out);
}