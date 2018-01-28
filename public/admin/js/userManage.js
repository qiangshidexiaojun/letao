$(function () {


    var queryObj = {
        page: 1,
        pageSize: 5 
    }

    var updateObj;
    

    init();
    function init() {
        queryUser(function (res) {
            // 配置
            var options = {
                bootstrapMajorVersion: 3,// bootstrap为3.x版本的时候要声明
                alignment: "left",//左侧显示
                currentPage: queryObj.page,//当前页数
                totalPages: Math.ceil(res.total / res.size),//总页数 注意不是总条数
                // 点击页码的时候触发
                onPageClicked: function (e, oe, type, page) {
                    // event, originalEvent, type,page。
                    // page 为被点击的页码
                    queryObj.page = page;
                    queryUser();
                }
            }
            // 初始化
            $(".pagination").bootstrapPaginator(options);
        })

        /* 点击禁用按钮 */
        $(".lt_user_tab").on("click",".lt_controls_disable",function(e){
            $.clickSure(e.target, function () { 
                updateObj = {
                    id: $(e.target).parents("tr").data("id"),
                    isDelete: 0
                }
                updateUser(updateObj,function(res){
                    if(res.success){
                        queryUser();
                    }
                })
            })
        })

        /* 点击启用按钮 */
        $(".lt_user_tab").on("click", ".lt_controls_start", function (e) {
            $.clickSure(e.target, function(){} ,function () {
                updateObj = {
                    id: $(e.target).parents("tr").data("id"),
                    isDelete: 1
                }
                updateUser(updateObj, function (res) {
                    if (res.success) {
                        queryUser();
                    }
                })
            })
        })
    }

    /* 查询用户信息 */
    function queryUser(callback) {
        $.get("/user/queryUser", queryObj, function (res) {
            // console.log(res);
            var html = "<tr><th class='active'>序号</th><th class='success'>用户名</th><th class='warning'>手机号</th><th class='info'>状态</th><th class='danger'>操作</th></tr>";
            for (var i = 0; i < res.rows.length; i++) {
                html += "<tr data-id='" + res.rows[i].id + "'><td>" + ((res.page - 1) * res.size + 1 + i) + "</td><td>" + res.rows[i].username + "</td><td>" + res.rows[i].mobile + "</td><td>" + (res.rows[i].isDelete == 1 ? "正常" : "已禁用") + "</td><td>" + (res.rows[i].isDelete == 1 ? "<button class='lt_controls_disable btn btn-danger' data-toggle='modal' data-target='#myModal'>禁用</button>" : "<button class='lt_controls_start btn btn-primary' data-toggle='modal' data-target='#myModal'>启用</button>") + "</td></tr>";
            }
            $(".lt_user_tab").html(html);
            callback && callback(res);
        })
    }

    /* 修改用户状态 */
    function updateUser(updateObj,callback){
        $.post("/user/updateUser",updateObj,function(res){
            callback && callback(res);
        })
    }


    /* 模态框show 方法调用之后立即触发该事件 */
    $('.modal').on('show.bs.modal', function (e) {
        if (e.relatedTarget.nodeName == "SPAN") {
            $(".modal-body p").html('<span class="glyphicon glyphicon-info-sign"></span>您确定要退出后台管理系统吗？')
        } else if (e.relatedTarget.nodeName == "BUTTON") {
            if (e.relatedTarget.innerHTML == "禁用") {
                $(".modal-body p").html('<span class="glyphicon glyphicon-info-sign"></span> 您确定要 <strong>禁用 itcast</strong> 这个用户吗？')
            } else if (e.relatedTarget.innerHTML == "启用") {
                $(".modal-body p").html('<span class="glyphicon glyphicon-info-sign text-success"></span><span class="text-success"> 您确定要 <strong>启用 itcast</strong> 这个用户吗？</span>')
            }
        }
    })
})