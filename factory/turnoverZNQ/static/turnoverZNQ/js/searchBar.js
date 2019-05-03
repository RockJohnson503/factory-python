/*
搜索框
*/
//切换输入框
function searchToggle(obj, evt){
    var container = $(obj).closest('.search-wrapper');

    if(!container.hasClass('active')){
          container.addClass('active');
          evt.preventDefault();
    }
    else if(container.hasClass('active') && $(obj).closest('.input-holder').length == 0){
          container.removeClass('active');
          // clear input
          container.find('.search-input').val('');
          // clear and hide result container when we press close
          container.find('.result-container').fadeOut(100, function(){$(this).empty();});
    }
}

//提交输入框
function submitFn(obj, evt){
    let value = $(obj).find('.search-input').val().trim();

    //是否为空
    if(!value.length){
        alert("请输入搜索内容!");
        return ;
    }

    //解析值
    value = value.split("&");
    if(value.length <= 1){
        //说明只有一个字符
        if(location.pathname === "/index.html"){
            location.assign("." + location.pathname + "?sear=" + value[0]);
        }else{
            let urlp = location.search.toString().substr(1);
            urlp = urlp.indexOf("date") !== -1 ? urlp.substr(urlp.indexOf("&") + 1) : urlp;
            location.assign("." + location.pathname + "?date=" + value[0] + "&" + urlp);
        }
    }else{
        location.assign("." + location.pathname + "?factory=" + value[0] + "&id=" + value[1] + "&name=" + (value[2] || ""));
    }

    evt.preventDefault();
}