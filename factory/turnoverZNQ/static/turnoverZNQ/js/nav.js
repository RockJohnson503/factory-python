function setlayer(alias, str, icon) {
    var html = "";
    if (alias == "text") {
        html += "<div class=\"text-item\">";
        html += "<span>";
        html += "<i class=\"" + icon + "\"></i>" + str + "</span>";
        html += "</div>";
    } else {
        html += "<div class=\"img-item\">";
        html += "<img src=\"" + str + "\">";
        html += "</div>";
    }
    return html;
}
$(function () {
    $(".leftNav-item li").hover(function (e) {
        var alias = $(this).attr("lay-data");
        var str = $(this).attr("data-fooc");
        var icon = $(this).children("i").attr("class");
        if (!alias) {
            return false;
        }
        $(this).append(setlayer(alias, str, icon));
        $(this).children("div").show(300);
    }, function (e) {
        $(this).children("div").remove();
    });
    $(window).scroll(function () {
        var scrollTop = $(document).scrollTop();
        if (scrollTop >= 200) {
            $(".for-top").show();
        } else {
            $(".for-top").hide();
        }
    });
    $(".for-top").click(function () {
        $('html,body').animate({
            scrollTop: 0
        }, 700);
    })
})