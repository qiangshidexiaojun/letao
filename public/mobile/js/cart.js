$(function () {



    init();
    function init() {
        mui.init({
            pullRefresh: {
                container: "#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
                down: {
                    height: 50,//可选,默认50.触发下拉刷新拖动距离,
                    auto: true,//可选,默认false.首次加载自动下拉刷新一次
                    contentdown: "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                    contentover: "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                    contentrefresh: "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                    callback: function () {
                        queryCart(function (res) {
                            for (var i = 0; i < res.length; i++) {
                                res[i].getSize = $.getSize(res[i].productSize);
                            }
                            // console.log(res);
                            var html = template("mytp", { data: res });
                            // console.log(html);
                            $("#OA_task_2").html(html);
                        })
                        // 结束下拉刷新
                        mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                    }
                }
            }
        });

        /* 点击input框 */
        $("#OA_task_2").on("change", ".pro_cb", function () {
            // var jsonObj = JSON.parse(jsonStr);
            var sum = 0;
            var isCheck = $(".pro_cb:checked");
            /* input的值发生改变就获取选中的input的父元素的值 */
            for (var i = 0; i < isCheck.size(); i++) {
                var jsonStr = $(isCheck[i]).parents(".mui-table-view-cell")[0].dataset.jsonobj;
                var jsonObj = JSON.parse(jsonStr);
                sum += jsonObj.price * jsonObj.num;
            }
            /* 处理js计算精度不准问题 */
            sum = Math.floor(sum * 100) / 100;
            $(".cart_order span").html("订单总额：¥" + sum);
        })

        /* 点击删除按钮 */
        $("#OA_task_2").on("tap", ".mui-slider-right>.delData", function (e) { clickBtnDel(e) })
        $("#OA_task_2").on("tap", ".mui-slider-left>.delData", function (e) { clickBtnDel(e) })

        function clickBtnDel(e) {
            var jsonStr = $(e.target).parents(".mui-table-view-cell")[0].dataset.jsonobj;
            var jsonObj = JSON.parse(jsonStr);
            var id = jsonObj.id;
            var ids = [id];
            mui.confirm("你要删除这件商品吗？", "温馨提示", ["确定", "取消"], function (a) {
                /* 点击了确定按钮 */
                if (a.index == 0) {
                    deleteCart({ id: ids }, function (res) {
                        if (res.success) {
                            // 手动启用刷新组件
                            mui("#refreshContainer").pullRefresh().pulldownLoading();
                        } else {
                            mui.toast("删除失败");
                        }
                    });
                }
            })
        }

        /* 点击了编辑按钮 */
        $("#OA_task_2").on("tap", ".mui-slider-right>.editData", function (e) { clickBtnEdt(e); });
        $("#OA_task_2").on("tap", ".mui-slider-left>.editData", function (e) { clickBtnEdt(e); });

        function clickBtnEdt(e) {
            var jsonStr = $(e.target).parents(".mui-table-view-cell")[0].dataset.jsonobj;
            var jsonObj = JSON.parse(jsonStr);
            var html = template("productInfo", jsonObj);
            html = html.replace(/\n/g, "");
            mui.confirm(html, "编辑商品", ["确定", "取消"], function (a) {
                /* 点击了确定 */
                if (a.index == 0) {
                    var queryObj = {
                        id: jsonObj.id,
                        size: $("body span.active").html(),
                        num: $(".mui-numbox-input").val()
                    }
                    updateCart(queryObj, function (res) {
                        if (res.success) {
                            // 手动启用刷新组件
                            mui("#refreshContainer").pullRefresh().pulldownLoading();
                        } else {
                            mui.toast("更新失败");
                        }
                    })
                }
            })
            mui(".mui-numbox").numbox();
        }

        /* 选择尺寸 */
        $("body").on("tap", ".sizeP", function (e) {
            var listP = $(this).siblings();
            for (var i = 0; i < listP.size(); i++) {
                $(listP[i]).removeClass("active");
            }
            $(this).addClass("active");
        })
    }


    /* 查询购物车 */
    function queryCart(callback) {
        /* 过滤登录 */
        $.ltAjax({
            url: "/cart/queryCart",
            success: function (res) {
                callback && callback(res);
            }
        })
    }

    /* 删除购物车 */
    function deleteCart(id, callback) {
        $.ltAjax({
            url: "/cart/deleteCart",
            data: id,
            success: function (res) {
                callback && callback(res);
            }
        })
    }

    /* 更新购物车 */
    function updateCart(data, callback) {
        $.ltAjax({
            url: "/cart/updateCart",
            type: "post",
            data: data,
            success: function (res) {
                callback && callback(res);
            }
        })
    }

    /* 扩展temp方法 */
    template.helper("jsonStr", function (value) {
        return JSON.stringify(value);
    });

})