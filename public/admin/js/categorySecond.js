$(function () {

    var queryObj = {
        page: 1,
        pageSize: 2
    }

    var addObj;

    init();
    function init() {
        querySecondCategoryPaging(function (res) {
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
                    querySecondCategoryPaging();
                }
            }
            // 初始化
            $(".pagination").bootstrapPaginator(options);
        });

        /* 点击下拉列表 */
        queryTopCategoryPaging(function () {
            $(".dropdown-menu").on("click", function (e) {
                var target = e.target;
                $(".dropdown-text").html(target.innerHTML);
                $("#categoryId").val(e.target.dataset.id);
                // 手动调用验证提示 
                $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID');
            })
        });

        /* 上传图片 */
        $('.fileuploadBtn').fileupload({
            dataType: 'json',
            // 上传成功的时候调用
            done: function (e, data) {
                // data.result 为上传成功的返回值
                // console.log(data.result);
                var src = data.result.picAddr;
                $(".lt_img img").attr({ "src": src });
                $("#brandLogo").val(src);
                // 手动调用验证提示 
                $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');
            }
        });
    }

    /* 查询二级分类 */
    function querySecondCategoryPaging(callback) {
        $.get("/category/querySecondCategoryPaging", queryObj, function (res) {
            // console.log(res);
            var html = "'<tr><th>序号</th><th>一级分类名称</th><th>二级分类名称</th><th>二级分类LOGO</th></tr>'";
            for (var i = 0; i < res.rows.length; i++) {
                html += '<tr><td>' + ((res.page - 1) * res.size + i + 1) + '</td><td>' + res.rows[i].categoryName + '</td><td>' + res.rows[i].brandName + '</td><td><img src=' + res.rows[i].brandLogo + ' alt=""></td></tr>';
            }
            $(".lt_category_tab").html(html);
            callback && callback(res);
        })
    }

    /* 查询一级分类 */
    function queryTopCategoryPaging(callback) {
        $.get("/category/queryTopCategoryPaging", { page: 1, pageSize: 10000 }, function (res) {
            console.log(res);
            var html = "";
            for (var i = 0; i < res.rows.length; i++) {
                html += "<li><a href='javascript:;' data-id='"+ res.rows[i].id +"'>" + res.rows[i].categoryName + "</a></li>";
            }
            $(".dropdown-menu").html(html);
            callback && callback();
        })
    }

    /* 添加二级分类 */
    function addSecondCategory(callback) {
        $.post("/category/addSecondCategory", addObj, function (res) {
            callback && callback(res);
        })
    }

    /* 模态框show 方法调用之后立即触发该事件 */
    $('.modal').on('show.bs.modal', function (e) {
        if (e.relatedTarget.nodeName == "SPAN") {
            $(".modal-title").html("温馨提示");
            $(".lt_message").show();
            $(".btn_menu").hide();
            $(".lt_input").hide();
            $(".lt_upload").hide();
            $(".lt_img").hide();
            $(".lt_btn_sure").attr("type", "button");
        } else if (e.relatedTarget.nodeName == "BUTTON") {
            if (e.relatedTarget.innerHTML == "添加分类") {
                $(".modal-title").html("添加分类");
                $(".lt_message").hide();
                $(".btn_menu").show();
                $(".lt_input").show();
                $(".lt_upload").show();
                $(".lt_img").show();
                $(".lt_btn_sure").attr("type", "submit");
            }
        }
    })

    /* 表单验证 */
    $('.form-horizontal').bootstrapValidator({
        message: '输入值不合法',
        excluded: [":disabled"],//关键配置，表示只对于禁用域不进行验证，其他的表单元素都要验证 
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            categoryId: {
                validators: {
                    notEmpty: {
                        message: '请选择一级分类'
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: '请输入二级分类名称'
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: '请上传二级分类Logo'
                    }
                }
            }
        }
    }).on('success.form.bv', function (e) {
        // 点击提交的时候  
        addObj = {
            brandName: $("#brandName").val(),
            categoryId: $("#categoryId").val(),
            brandLogo: $("#brandLogo").val(),
            hot: 1
        }
        // console.log(addObj);
        addSecondCategory(function(res){
            console.log(res);
            if(res.success){
                $('#myModal').modal('hide');
                querySecondCategoryPaging();
            }
        })

        // 阻止默认提交事件
        e.preventDefault();
    });

    /* 重置表单 */
    $('.modal').on('hide.bs.modal', function (e) {
        // 重置表单 - js 原生的重置  重置 输入框的文字
        $("#form")[0].reset();
        // 重置验证信息- 插件的重置 重置的是插件自己的图标显示 
        $("#form").data('bootstrapValidator').resetForm();
        //重置下拉菜单
        $(".dropdown-text").html("请选择");

        // 重置隐藏域和图片
        $("#brandLogo").val("");
        $(".lt_img img").attr("src", "./images/none.png");
    })

})