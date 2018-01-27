$(function () {


    init();
    function init() {
        /* 初始化区域滚动 */
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });

        /* 渲染模板 */
        queryAddress(function (res) {
            console.log(res);
            var html = template("mytp", { data: res });
            // console.log(html);
            $("#OA_task_2").html(html);
        })

        /* 点击列表 */
        $("#OA_task_2").on("tap", "li", function (e) {
            var liDom;
            if (e.target.nodeName == "DIV") {
                liDom = $(e.target).parents("li");
            } else if (e.target.nodeName == "LI") {
                liDom = $(e.target);
            } else if (e.target.nodeName == "A") {
                return;
            }
            var id = liDom.data("id");
            location.href = "addressManage.html?addressId=" + id;
        })

        /* 点击删除 */
        $("#OA_task_2").on("tap", ".mui-slider-right>a", function (e) {
            var liDom = $(e.target).parents("li");
            var id = {id: liDom.data("id")};
            deleteAddress(id,function(res){
                // console.log(res);
                if(res.success){
                    mui.toast("删除成功");
                    liDom.remove();
                }
            })
        })
    }

    /* 查询地址信息 */
    function queryAddress(callback) {
        $.ltAjax({
            url: "/address/queryAddress",
            success: function (res) {
                callback && callback(res);
            }
        })
    }

    /* 删除改地址 */
    function deleteAddress(id,callback){
        $.ltAjax({
            url: "/address/deleteAddress",
            type: "post",
            data: id,
            success: function(res){
                callback && callback(res);
            }
        })
    }
})