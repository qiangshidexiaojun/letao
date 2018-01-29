$(function () {

    var addObj;
    var queryObj = {
        page: 1,
        pageSize: 6
    }

    init();
    function init() {
        /* 配置分页 */
        queryTopCategoryPaging(function (res) {
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
                    queryTopCategoryPaging();
                }
            }
            // 初始化
            $(".pagination").bootstrapPaginator(options);
        })

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
                categoryName: {
                    // 用户名的提示信息
                    // message: 'The username is not valid',
                    validators: {
                        // 不能为空
                        notEmpty: {
                            message: '一级分类名称不能为空'
                        },
                        // 提供给ajax回调使用
                        callback: {
                            message: "用户名不存在"
                        }
                    }
                }
            }
        }).on('success.form.bv', function (e) {
            // 点击提交的时候  
            $('.modal').modal('hide');
            addObj = {
                categoryName: $("#categoryName").val()
            }
            addTopCategory(function (res) {
                // console.log(res);
                /* 插入成功的时候重新查询下 */
                if (res.success) {
                    queryTopCategoryPaging();
                    console.log("ok");
                }
            })

            // 阻止默认提交事件
            e.preventDefault();
        });
    }

    /* 模态框show 方法调用之后立即触发该事件 */
    $('.modal').on('show.bs.modal', function (e) {
        if (e.relatedTarget.nodeName == "SPAN") {
            $(".modal-title").html("温馨提示");
            $(".lt_message").show();
            $(".lt_input").hide();
            $(".lt_btn_sure").attr("type", "button");
        } else if (e.relatedTarget.nodeName == "BUTTON") {
            if (e.relatedTarget.innerHTML == "添加分类") {
                $(".modal-title").html("添加分类");
                $(".lt_input").show();
                $(".lt_message").hide();
            }
        }
    })

    /* 重置表单 */
    $('.modal').on('hide.bs.modal', function (e) {
        $("form").data('bootstrapValidator').resetForm();
    })

    /* 添加一级分类 */
    function addTopCategory(callback) {
        $.post("/category/addTopCategory", addObj, function (res) {
            callback && callback(res);
        })
    }

    /* 查询一级分类 */
    function queryTopCategoryPaging(callback) {
        $.get("/category/queryTopCategoryPaging", queryObj, function (res) {
            console.log(res);
            var html = "<tr><th class='danger'>序号</th><th class='info'>分类名称</th></tr>";
            for (var i = 0; i < res.rows.length; i++) {
                html += "<tr><td>" + ((res.page - 1) * res.size + i + 1) + "</td><td>" + res.rows[i].categoryName + "</td></tr>"
            }
            $(".lt_category_tab").html(html);
            callback && callback(res);
        })
    }
})