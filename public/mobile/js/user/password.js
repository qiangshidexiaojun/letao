$(function(){

    var vCode;

    init();
    function init() {
        /* 点击注册按钮 */
        $(".lt_edit").on("tap", function () {
            var oldPassword = $(".oldPassword").val();
            if (!$.trim(oldPassword)) {
                mui.toast("请输入原密码")
                return;
            } 
            var newPassword = $(".newPassword").val();
            if (!$.trim(newPassword)) {
                mui.toast("请输入新密码")
                return;
            }
            var confirm = $(".confirm").val();
            if (!$.trim(confirm)) {
                mui.toast("请再次输入新密码")
                return;
            } else if ($.trim(confirm) != $.trim(newPassword)) {
                mui.toast("密码需要一致")
                return;
            }

            var verify_code = $(".verify_code").val();
            if (!$.trim(verify_code)) {
                mui.toast("请输入验证码")
                return;
            }

            if ($.trim(verify_code) != vCode) {
                mui.toast("请输入合法验证码");
                return;
            }

            var queryObj = {
                oldPassword: oldPassword,
                newPassword: newPassword,
                vCode: vCode
            }

            console.log(queryObj);
            
            // console.log(queryObj);
            /* 所有验证通过之后进行修改 */
            $.ltAjax({
                url: "/user/updatePassword",
                type: "post",
                data: queryObj,
                success: function(res){
                    console.log(res);
                    if (res.success) {
                        location.href = "/mobile/index.html";
                    } else {
                        mui.toast(res.message);
                        return;
                    }
                }
            })
        })

        /* 点击获取验证码按钮 */
        $(".get_code").on("tap", function () {
            var that = this;
            $.get("/user/vCodeForUpdatePassword", function (res) {
                vCode = res.vCode;
                console.log(vCode);
                $(that).addClass("mui-disabled");
                $(that).html("正在发送...")
                var time = 3;
                var timer = setInterval(function () {
                    $(that).html(time + "秒后在获取");
                    time--;
                    if (time < -1) {
                        clearInterval(timer);
                        $(that).removeClass("mui-disabled");
                        $(that).html("获取认证码");
                    }
                }, 1000);
            });
        })
    }
})