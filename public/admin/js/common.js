$(function () {

    /* 拓展jq方法 */
    $.extend($, {
        clickSure: function (value, callbackDisable, callbackSure) {
            /* 点击模态框的确认 */
            $(".lt_btn_sure").on("click", function () {
                if (value.nodeName == "SPAN") {
                    $('.modal').modal('hide');
                    employeeLogout(function (res) {
                        // console.log(res);
                        if (res.success) {
                            setTimeout(() => {
                                location.href = "/admin/login.html";
                            }, 200);
                        }
                    })
                } else if (value.nodeName == "BUTTON") {
                    if (value.innerHTML == "禁用") {
                        $('.modal').modal('hide');
                        callbackDisable && callbackDisable();
                    } else if (value.innerHTML == "启用") {
                        $('.modal').modal('hide');
                        callbackSure && callbackSure();
                    }
                }
            })
        }
    })

    /* 左侧菜单栏 */
    $(".menu li").on("click", function (e) {
        var liDom;
        if (e.target.nodeName == "A") {
            liDom = $(e.target).parent();
        } else if (e.target.nodeName == "SPAN") {
            liDom = $(e.target).parents("li");
        } else if (e.target.nodeName == "LI") {
            liDom = $(e.target);
        }
        /* 切换显示二级 */
        if (liDom.find(".child")) {
            liDom.find(".child").slideToggle(400);
        }
        liDom.addClass("now").siblings().removeClass("now");
    })

    /* 右侧导航条 */
    /* 点击缩进 */
    $(".lt_nav").children("span:nth-of-type(1)").on("click", function () {
        $("aside").toggle();
        if ($("body").css("paddingLeft") == "180px") {
            $("body").css({ "paddingLeft": 0 });
        } else {
            $("body").css({ "paddingLeft": 180 });
        }
    })

    /* 当模态框完全显示的时候出发 */
    $('.modal').on('shown.bs.modal', function (e) {
        $.clickSure(e.relatedTarget);
    })

    /* 退出登录 */
    function employeeLogout(callback) {
        $.get("/employee/employeeLogout", function (res) {
            callback && callback(res);
        })
    }

    /* 显示进度条 */
    $(window).ajaxStart(function () {
        // 开始
        NProgress.start();

    })
    /* 关闭进度条 */
    $(window).ajaxStop(function () {
        // 结束
        NProgress.done();
    })
})