$(function () {

    $('form').bootstrapValidator({
        /*校验插件默认会忽略  隐藏的表单元素
              不忽略任何情况的表单元素*/
        //excluded:[],
        // 图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 要验证的字段
        fields: {
            // 用户名 
            username: {
                // 用户名的提示信息
                // message: 'The username is not valid',
                validators: {
                    // 不能为空
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    // 提供给ajax回调使用
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            password: {
                message: '密码无效',
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: '用户名长度必须在6到30之间'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: 'The username can only consist of alphabetical, number, dot and underscore'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {
        // 点击提交的时候  
        var data = $("form").serialize();
        employeeLogin(data,function(res){
            if(res.success){
                setTimeout(() => {
                    location.href = "index.html";
                }, 200);
            }
        })
        // 阻止默认提交事件
        e.preventDefault();
    });

    /* 登录后台 */
    function employeeLogin(data,callback){
        $.post("/employee/employeeLogin", data, function (res) {
            callback && callback(res);
        })
    }

    /* 进度条 */
    $(window).ajaxStart(function(){
        // 开始进度条
        NProgress.start();
    })
    $(window).ajaxStop(function(){
        // 结束进度条
        // NProgress.done();
    })
    
    
})