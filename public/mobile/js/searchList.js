$(function () {

    /* 全局对象 */

    var queryObj = {
        /* 获取上个页面传回来的值 */
        // 产品名称
        proName: $.getQueryProduct("key"),
        // 品牌id
        brandId: "",
        // 安装价格排序 1 升序 2 降序 
        price: "",
        // 数量排序
        num: "",
        // 第几页
        page: 1,
        // 页容量 
        pageSize: 4
    }

    /* 总页数 */
    var totalSize = 1;

    init();

    function init() {

        /* 初始化下拉刷新 */
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
                        queryObj.page = 1;
                        queryProduct(function (res) {
                            // console.log(res);
                            /* 渲染模板 */
                            var html = template("mytp", res);
                            $(".lt_goods_list > ul").html(html);
                            /* 结束下拉刷新 */
                            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                            mui('#refreshContainer').pullRefresh().refresh(true);
                        })
                    }
                },
                up: {
                    height: 50,//可选.默认50.触发上拉加载拖动距离
                    auto: true,//可选,默认false.自动上拉加载一次
                    contentrefresh: "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                    contentnomore: '没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                    callback: function () {
                        // console.log(res.count);
                        if (queryObj.page >= totalSize) {
                            console.log("没有了");
                            mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                            return;
                        } else {
                            queryObj.page++;
                            queryProduct(function (res) {
                                var html = template("mytp", res);
                                console.log(res);
                                $(".lt_goods_list > ul").append(html);
                                /* 手动结束上拉加载 */
                                mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                            })
                        }
                    }
                }
            }
        });

        /* 点击工具条 */
        $(".lt_tools > a").on("tap", function (e) {
            // console.log(e.target.nodeName);
            var aDom = e.target.nodeName == "A" ? e.target : e.target.parentNode;
            // console.log(aDom); ;
            /* 改变箭头的方向 */
            $(aDom).find(".mui-icon").toggleClass("mui-icon-arrowdown mui-icon-arrowup");
            /* 排序的名字 */
            var sortName = aDom.dataset.type;
            // console.log(sortName);
            var sort = 1;
            if ($(aDom).find(".mui-icon").hasClass("mui-icon-arrowdown")) {
                sort = 2;
            } else {
                sort = 1;
            }
            /* 每次点击之前都初始化搜索条件 */
            queryObj.num = "";
            queryObj.price = "";
            queryObj[sortName] = sort;
            /* 手动触发下拉刷新 */
            mui("#refreshContainer").pullRefresh().pulldownLoading();
        })

        /* 点击搜索按钮 */
        $(".search").on("tap", function () {
            var txt = $(".search_content").val();
            queryObj.proName = txt;
            /* 手动触发下拉刷新 */
            mui("#refreshContainer").pullRefresh().pulldownLoading();
        })
    }

    function queryProduct(callback) {
        $.get("/product/queryProduct", queryObj, function (res) {
            callback && callback(res);
            /* 总页数 */
            totalSize = Math.ceil(res.count / queryObj.pageSize);
        })
    }


})