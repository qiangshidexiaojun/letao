$(function () {

    init();
    function init() {
        /* 初始化区域滚动 */
        mui('.mui-scroll-wrapper').scroll({
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });

        /* 获取一级菜单的数据 */
        queryTopCategory(function (res) {
            // console.log(res);
            var str = "";
            for (var i = 0; i < res.rows.length; i++) {
                str += "<li data-id=" + res.rows[i].id + ">" + res.rows[i].categoryName + "</li>";
            }
            $(".lt_list").html(str);
            /* 加载玩页面显示第一条数据 */
            $($(".lt_list li")[0]).addClass("active");
            rendering(1);
        });

        /* 点击菜单 */
        $(".lt_list").on("tap", "li", function (e) {
            var list = $(".lt_list li");
            var id = $(e.target).data("id");
            // console.log(id);
            for (var i = 0; i < list.length;i++){
                $(list[i]).removeClass("active");
            }
            $(this).addClass("active");
            rendering(id);
        });

        /* 点击搜索按钮 */
        $(".lt_title a:nth-of-type(2)").on("tap",function(e){
            var txt = $(".lt_title input").val();
            location.href = "/mobile/searchList.html?key=" + txt;
        })
    }

    /* 获取一级菜单的数据 */
    function queryTopCategory(callback) {
        $.get("/category/queryTopCategory", function (res) {
            callback && callback(res);
        })
    }

    /* 获取二级菜单的数据 */
    function querySecondCategory(id, callback) {
        $.get("/category/querySecondCategory", { id: id }, function (res) {
            callback && callback(res);
        })
    }

    function rendering(id){
        querySecondCategory(id, function (res) {
            // console.log(res);
            var str = "";
            for (var i = 0; i < res.rows.length; i++) {
                str += '<a href="javascript:;"><img src="' + res.rows[i].brandLogo + '"alt=""><p>' + res.rows[i].brandName + '</p></a>'
            }
            if (res.rows.length == 0) {
                str += '<a href="javascript:;"><p>没有数据</p></a>'
            }
            $(".right_list").html(str);

        })
    }

})