$(function() {
  var txt = document.querySelector("input[type=text]");
  var psd = document.querySelector("input[type=password]");

  $(".lt_login").on("tap", function() {
    if (!txt.value) {
      mui.toast("请输入用户名");
      return;
    }

    if (!psd.value) {
      mui.toast("请输入密码");
      return;
    }

    var queryObj = { username: txt.value, password: psd.value };
    // console.log(queryObj);

    // console.log($(".lt_form_login").serialize());

    $.post("/user/login", queryObj, function(res) {
        if(res.error && res.error == 403){
            mui.toast(res.message);
            return;
        }
        // var returnUrl = $.getQueryProduct("returnUrl");
        // console.log(returnUrl);
      location.href = $.getQueryProduct("returnUrl");
    });
  });
});
