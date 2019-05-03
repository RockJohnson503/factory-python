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
        evt.preventDefault();
    }
}