$(function () {

    var vCode = 0;

    init();
    function init() {
        /* 点击注册按钮 */
        $(".lt_register").on("tap", function () {
            var username = $(".username").val();
            if (!$.trim(username)) {
                mui.toast("请输入手机号")
                return;
            } else if (!verifyPhone($.trim(username))) {
                mui.toast("请输入合法手机号")
                return;
            }

            var password = $(".password").val();
            if (!$.trim(password)) {
                mui.toast("请输入密码")
                return;
            }

            var confirm = $(".confirm").val();
            if (!$.trim(confirm)) {
                mui.toast("请再次输入密码")
                return;
            } else if ($.trim(confirm) != $.trim(password)) {
                mui.toast("密码需要一致")
                return;
            }

            var verify_code = $(".verify_code").val();
            if (!$.trim(verify_code)) {
                mui.toast("请输入验证码")
                return;
            }

            var isAgree = $("#isAgree:checked");
            if (isAgree.length < 1) {
                mui.toast("请先同意");
                return;
            }

            if ($.trim(verify_code) != vCode) {
                mui.toast("请输入合法验证码");
                return;
            }

            var queryObj = {
                username: username,
                password: password,
                mobile: username,
                vCode: vCode
            }

            // console.log(queryObj);
            /* 所有验证通过之后进行注册 */
            $.post("/user/register",queryObj,function(res){
                // console.log(res);
                if(res.success){
                    location.href = "../index.html";
                }else{
                    mui.toast(res.message);
                    return;
                }
            })

        })

        /* 点击获取验证码按钮 */
        $(".get_code").on("tap", function () {
            var that = this;
            $.get("/user/vCode", function (res) {
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

    /* 手机验证规则 */
    function verifyPhone($poneInput) {
        var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!phoneReg.test($poneInput)) {
            return false;
        } else {
            return true;
        }
    }

})