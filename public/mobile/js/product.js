$(function () {
  init();
  function init() {
    mui.init({
      pullRefresh: {
        container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
        down: {
          height: 50, //可选,默认50.触发下拉刷新拖动距离,
          auto: true, //可选,默认false.首次加载自动下拉刷新一次
          contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
          contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
          contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
          callback: function () {
            getQueryProduct(function (res) {
              /* 获取尺码范围转换为数组 */
              res.getSize = $.getSize(res.size);
              //   console.log(res);
              var html = template("mytp", res);
              $(".mui-scroll").html(html);

              //初始化轮播图
              var gallery = mui(".mui-slider");
              gallery.slider({
                interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
              });

              /* 初始化数字输入框 */
              mui(".mui-numbox").numbox();

              /* 结束下拉刷新 */
              mui("#refreshContainer")
                .pullRefresh()
                .endPulldownToRefresh();
              //   console.log(html);
            });
          }
        }
      }
    });

    /* 点击尺寸 */
    $(".mui-scroll").on("tap", ".sizeP", function (e) {
      var countP = $(".sizeP");
      for (var i = 0; i < countP.length; i++) {
        $(countP[i]).removeClass("active");
      }
      $(e.target).addClass("active");
    });

    /* 点击加入购物车 */
    $(".addCart").on("tap", function () {
      if (!$(".sizeP").hasClass("active")) {
        mui.toast("请选择尺码");
        return;
      }

      if ($(".mui-numbox-input").val() == 0) {
        mui.toast("请输入数量");
        return;
      } //   console.log(res);

      /* 传送的数据 */ var queryObj = {
        productId: $.getQueryProduct("productId"),
        num: $(".product_size span.active").html(),
        size: $(".mui-numbox-input").val()
      };
      // $.post("/cart/addCart", queryObj, function (res) {
      //   /* 保险写法 */
      //   if (res.error && res.error == 400) {
      //     location.href = "./user/login.html?returnUrl=" + location.href;
      //   }
      // });
      $.ltAjax({
        url: "/cart/addCart",
        type: "post",
        data: queryObj,
        success: function (res) {
          mui.confirm("添加成功，去购物车看看？", "温馨提示", ["是", "否"], function (a) {
            // console.log(a);
            /* a.index = 0 是*/
            /* a.index = 1 否*/
            if (a.index == 0) {
              location.href = "/mobile/cart.html";
            }
          })
        }
      })
    });
  }

  /* 发送请求获取数据 */
  function getQueryProduct(callback) {
    $.get(
      "/product/queryProductDetail",
      { id: $.getQueryProduct("productId") },
      function (res) {
        callback && callback(res);
      }
    );
  }
});
