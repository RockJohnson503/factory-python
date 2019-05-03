//获取数据
function getDatas(urls){
    let results;
    $.ajax({
        url : location.protocol + "//" + location.hostname + ":" + location.port + "/" + urls,
        type : "post",
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
function idOperat(factory, id, name, operat){
    let modalHeader = document.getElementsByClassName("modal-header")[0].getElementsByTagName("strong")[0];

    if(modalHeader.innerText !== ""){
        $(".modal-body .input-group").eq(0).css("display", "");
        modalHeader.childNodes[0].remove();
    }
    if(operat === "领料"){
        $(".modal-body .input-group").eq(0).css("display", "none");
    }
    modalHeader.setAttribute("_factory", factory);
    modalHeader.setAttribute("_id", id);
    modalHeader.setAttribute("_name", name);
    modalHeader.append(operat + "型号: " + id);
}

//检查批次号输入的数据
function checkOpDatas() {
    let modalHeader = $(".modal-header strong")[0];
    let thisFactory = modalHeader.getAttribute("_factory");
    let thisId = modalHeader.getAttribute("_id");
    let thisName = modalHeader.getAttribute("_name");
    let key = $("input[name = 'keys']").val();
    let amounts = Number($("input[name = 'amounts']").val());
    let dates = $("input[name = 'dates']").val();
    let date = new Date();
    let results = [];
    let product = jsonSearch({"factory": thisFactory, "id": thisId, "name": thisName}).data[0];
    let keys = getDatas("getJsonData?cur=keyNum");

    if(dates && !/(\d{1,2})\-(\d{1,2})/.test(dates)){
        alert("请输入正确的时间!");
        return ;
    }
    let txt = (key ? ("批次号: " + key + ", ") : "") + "数量: " + amounts + ", 时间: " + dates;
    let check = confirm("您输入的信息是:\n" + txt + "\n请仔细确认!");
    if(!check){
        return ;
    }

    //具体操作
    if(modalHeader.innerText.indexOf("入库") !== -1){
        if(!key || !amounts){
            alert("请输入批次号和数量!");
            return ;
        }

        product.in += amounts;
        product.now = product.first + product.in - product.out;
        results.push(product);
        results.push({
            "factory": thisFactory,
            "id": thisId,
            "name": thisName,
            "key": key,
            "operat": "入库",
            "num": amounts,
            "date": date.getFullYear() + "-" + (dates || (date.getMonth()+1) + "-" + date.getDate())
        });
        results.push({"factory": thisFactory, "id": thisId, "name": thisName, "key": key, "num": amounts});

        if(jsonPush(JSON.stringify(results[0]), "turnoverData") !== null &&
            jsonPush(JSON.stringify(results[1]), "detailData") !== null &&
            jsonPush(JSON.stringify(results[2]), "keyNum") !== null){
            alert("入库成功!");
        }else{
            alert("入库失败!code(3)");
            return ;
        }
    }else{
        if(!amounts){
            alert("请输入数量!");
            return ;
        }

        let detailData = getDatas("getJsonData?cur=detailData");
        let allIn = jsonSearch({"factory": thisFactory, "id": thisId, "name": thisName, "operat": "入库"}, false, detailData).data;
        let result= {
                    "factory": thisFactory,
                    "id": thisId,
                    "name": thisName,
                    "key": "",
                    "operat": "领料",
                    "num": amounts,
                    "date": date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
                };

        //判断领料量是否超出库存
        if(amounts > product.now){
            alert("领料量已经超出库存!");
            return ;
        }

        //修改产品的数量
        product.out += amounts;
        product.now = product.first + product.in - product.out;
        if(allIn.length === 0){
            if(jsonPush(JSON.stringify(result), "detailData") === null){alert("领料失败!code(6)");return;}
        }

        for(let i = allIn.length - 1; i >= 0; i--){
            curKey = allIn[i].key;//当前的批次号
            curKeys = jsonSearch({"key": curKey, "factory": thisFactory, "id": thisId, "name": thisName}, false, keys).data[0];

            //检查该批次号是否有库存
            if(curKeys.num === 0){
                continue;
            }

            //检查该次批次号库存是否足够
            if(curKeys.num < amounts){
                result.num = curKeys.num;
                result.key = curKey;
                amounts -= curKeys.num;
                curKeys.num = 0;

                if(jsonPush(JSON.stringify(result), "detailData") === null){alert("领料失败!code(4)");return;}
                if(jsonPush(JSON.stringify(curKeys), "keyNum") === null){alert("领料失败!code(5)");return;}
                continue;
            }

            //最后一次加入
            result.num = amounts;
            result.key = curKey;
            curKeys.num -= amounts;

            if(jsonPush(JSON.stringify(result), "detailData") === null){alert("领料失败!code(6)");return;}
            if(jsonPush(JSON.stringify(curKeys), "keyNum") === null){alert("领料失败!code(7)");return;}
            break;
        }

        if(jsonPush(JSON.stringify(product), "turnoverData") === null){alert("领料失败!code(8)");return;}
        alert("领料成功!");
    }
    location.reload();
}

//检查添加输入的数据
function checkAddDatas(node) {
    let trNode = node.parentNode.parentNode;
    let inputNodes = trNode.getElementsByTagName("input");
    let results = {
        "factory": "空",
        "id": "空",
        "name": "空",
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

        //装换数据类型
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
    if(results.id === "空" || results.name === "空"){
        alert("您还没填写型号和名称列表!");
        return ;
    }

    //验证型号是否重复
    for(let k in useData.data){
        if(results.id === useData.data[k].id &&
            results.factory === useData.data[k].factory &&
            results.name === useData.data[k].name){
            alert("您输入了重复的产品!");
            return ;
        }
    }

    //验证完毕
    results.now = results.first + results.in - results.out;
    let txt = "厂家: " + results.factory + ",  型号: " + results.id +
        ",  名称: " + results.name + ",  期初: " + results.first +
        ",  现存: " + results.now + ",  入库合计: " + results.in +
        ",  领料合计: " + results.out;
    let check = confirm("您输入的产品是:\n" + txt + "\n请仔细确认!");
    if(!check){
        return ;
    }

    let q = jsonPush(JSON.stringify(results));
    if(q !== null){
        alert("添加产品成功!");
        location.reload();
    }else{
        alert("添加产品失败!code(2)");
    }
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