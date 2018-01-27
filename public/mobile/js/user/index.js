$(function () {

    init();
    function init() {
        /* 获取个人信息数据 */
        queryUserMessage(function (res) {
            console.log(res);
            var html = template("mytp", res);
            // console.log(html);
            $(".lt_container").html(html);
        })

        /* 点击退出登录 */
        $(".lt_container").on("tap", ".lt_login_out a", function () {
            mui.confirm("你确定要退出吗？","温馨提示",["是","否"],function(a){
                if(a.index == 0){
                    logout(function (res) {
                        if(res.success){
                            location.href = "/mobile/user/login.html?returnUrl="+location.href;
                        }
                    })
                }
            })
        })
    }


    /* 过滤登录 */
    function queryUserMessage(callback) {
        $.ltAjax({
            url: "/user/queryUserMessage",
            success: function (res) {
                callback && callback(res);
            }
        })
    }

    /* 退出登录 */
    function logout(callback) {
        $.get("/user/logout", function (res) {
            callback && callback(res);
        })
    }
})