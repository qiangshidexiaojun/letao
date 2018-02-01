$(function () {

    var addObj;
    var updateObj;
    var pageObj = {
        page: 1,
        pageSize: 4,
    }

    init();
    function init() {
        /* 分页 */
        queryProductDetailList(function (res) {
            // 配置
            var options = {
                bootstrapMajorVersion: 3,// bootstrap为3.x版本的时候要声明
                alignment: "left",//左侧显示
                currentPage: pageObj.page,//当前页数
                totalPages: Math.ceil(res.total / res.size),//总页数 注意不是总条数

                // 点击页码的时候触发
                onPageClicked: function (e, oe, type, page) {
                    // event, originalEvent, type,page。
                    // page 为被点击的页码
                    pageObj.page = page;
                    queryProductDetailList();
                }
            }

            // 初始化
            $(".pagination").bootstrapPaginator(options);
        })

        /* 点击单选框 */
        $(".lt_statu input[type=radio]").on("click", function () {
            var statuVal = $(".lt_statu input[type=radio]:checked").val();
            $("#lt_statu").val(statuVal);
            // 手动调用验证提示 
            $('#form').data('bootstrapValidator').updateStatus('lt_statu', 'VALID');
        })

        /* 加载二级数据 */
        querySecondCategoryPaging(function (res) {
            // console.log(res);
            var html = "";
            for (var i = 0; i < res.rows.length; i++) {
                html += "<li><a href='javascript:;' data-id='" + res.rows[i].id + "'>" + res.rows[i].brandName + "</a></li>"
            }
            $(".dropdown-menu").html(html);
        })

        /* 点击下拉菜单 */
        $(".dropdown-menu").on("click", "li", function (e) {
            $(".dropdown-text").html(e.target.innerHTML);
            $("#brandId").val(e.target.dataset.id);
            // 手动调用验证提示 
            $('#form').data('bootstrapValidator').updateStatus('brandId', 'VALID');
        })

        /* 点击下架按钮 */
        $(".lt_category_tab").on("click", ".lt_soldOut", function (e) {
            var id = $(e.target).parents("tr").data("id");
            console.log(id);
            /*  $.clickSure(e.target, function () {
 
             }) */
        })

        /* 点击编辑按钮 */
        $(".lt_category_tab").on("click", ".lt_edit", function (e) {
            var list = $(e.target).parents("tr").data("list");
            $("#proName").val(list.proName);
            $("#oldPrice").val(list.oldPrice);
            $("#price").val(list.price);
            $("#proDesc").val(list.proDesc);
            $("#size").val(list.size);
            $("#lt_statu").val(list.statu);
            $("#num").val(list.num);
            $("#brandId").val(list.brandId);
            // $(".dropdown-text").html();
            for (var i = 0; i < $(".dropdown-menu a").size();i++){
                if ($(".dropdown-menu a")[i].dataset.id == list.brandId){
                    $(".dropdown-text").html($(".dropdown-menu a")[i].innerHTML);
                    break;
                }
            }

            $.clickSure(e.target, function () {
                updateObj = {
                    proName: $("#proName").val(),
                    oldPrice: $("#oldPrice").val(),
                    price: $("#price").val(),
                    proDesc: $("#proDesc").val(),
                    size: $("#size").val(),
                    statu: $("#lt_statu").val(),
                    num: $("#num").val(),
                    brandId: $("#brandId").val(),
                    id: list.id
                }
                console.log(updateObj);
                updateProduct(function(res){
                    if(res.success){
                        queryProductDetailList();
                    }
                })
            })
        })

    }

    /* show 方法调用之后立即触发该事件 */
    $('#myModal').on('show.bs.modal', function (e) {
        if (e.relatedTarget.nodeName == "SPAN") {
            $(".modal-title").html("温馨提示");
            $('.lt_error').hide();
            $('.lt_success').hide();
            $('.lt_proName').hide();
            $('.lt_proDesc').hide();
            $('.lt_num').hide();
            $('.lt_price').hide();
            $('.lt_oldPrice').hide();
            $('.lt_size').hide();
            $('.lt_statu').hide();
            $('.lt_brandId').hide();
            $('.lt_upload').hide();
            $('.lt_img').hide();
            $('.lt_message').show();
            $(".modal-dialog").width("300");
        } else if (e.relatedTarget.nodeName == "BUTTON") {
            if (e.relatedTarget.innerHTML == "添加商品") {
                $(".modal-title").html("添加商品");
                $('.lt_proName').show();
                $('.lt_proDesc').show();
                $('.lt_num').show();
                $('.lt_price').show();
                $('.lt_oldPrice').show();
                $('.lt_size').show();
                $('.lt_statu').show();
                $('.lt_brandId').show();
                $('.lt_upload').show();
                $('.lt_img').show();
                $('.lt_message').hide();
                $('.lt_error').hide();
                $('.lt_success').hide();
                $(".modal-dialog").width("400");
            } else if (e.relatedTarget.innerHTML == "下架") {
                $(".modal-title").html("温馨提示");
                $('.lt_error').show();
                $('.lt_success').hide();
                $('.lt_proName').hide();
                $('.lt_proDesc').hide();
                $('.lt_num').hide();
                $('.lt_price').hide();
                $('.lt_oldPrice').hide();
                $('.lt_size').hide();
                $('.lt_statu').hide();
                $('.lt_brandId').hide();
                $('.lt_upload').hide();
                $('.lt_img').hide();
                $('.lt_message').hide();
                $(".modal-dialog").width("300");
            } else if (e.relatedTarget.innerHTML == "上架") {
                $(".modal-title").html("温馨提示");
                $('.lt_error').hide();
                $('.lt_success').show();
                $('.lt_proName').hide();
                $('.lt_proDesc').hide();
                $('.lt_num').hide();
                $('.lt_price').hide();
                $('.lt_oldPrice').hide();
                $('.lt_size').hide();
                $('.lt_statu').hide();
                $('.lt_brandId').hide();
                $('.lt_upload').hide();
                $('.lt_img').hide();
                $('.lt_message').hide();
                $(".modal-dialog").width("300");
            } else if (e.relatedTarget.innerHTML == "编辑") {
                $(".modal-title").html("编辑");
                $('.lt_error').hide();
                $('.lt_success').hide();
                $('.lt_proName').show();
                $('.lt_proDesc').show();
                $('.lt_num').show();
                $('.lt_price').show();
                $('.lt_oldPrice').show();
                $('.lt_size').show();
                $('.lt_statu').show();
                $('.lt_brandId').show();
                $('.lt_upload').show();
                $('.lt_img').hide();
                $('.lt_message').hide();
                $(".modal-dialog").width("400");
            }
        }
    })

    /* 表单验证 */
    $('form').bootstrapValidator({
        /*校验插件默认会忽略  隐藏的表单元素
              不忽略任何情况的表单元素*/
        excluded: [],
        // 图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        // 要验证的字段
        fields: {
            // 用户名 
            proName: {
                // 用户名的提示信息
                // message: 'The username is not valid',
                validators: {
                    // 不能为空
                    notEmpty: {
                        message: '请输入商品名称'
                    },
                    // 提供给ajax回调使用
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            proDesc: {
                // 用户名的提示信息
                // message: 'The username is not valid',
                validators: {
                    // 不能为空
                    notEmpty: {
                        message: '请输入商品描述'
                    },
                    // 提供给ajax回调使用
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            num: {
                // 用户名的提示信息
                // message: 'The username is not valid',
                validators: {
                    // 不能为空
                    notEmpty: {
                        message: '请输入商品库存'
                    },
                    // 提供给ajax回调使用
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            price: {
                // 用户名的提示信息
                // message: 'The username is not valid',
                validators: {
                    // 不能为空
                    notEmpty: {
                        message: '请输入商品价格'
                    },
                    // 提供给ajax回调使用
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            oldPrice: {
                // 用户名的提示信息
                // message: 'The username is not valid',
                validators: {
                    // 不能为空
                    notEmpty: {
                        message: '请输入商品原价'
                    },
                    // 提供给ajax回调使用
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            size: {
                // 用户名的提示信息
                // message: 'The username is not valid',
                validators: {
                    // 不能为空
                    notEmpty: {
                        message: '请输入商品尺码'
                    },
                    // 提供给ajax回调使用
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            lt_statu: {
                // 用户名的提示信息
                // message: 'The username is not valid',
                validators: {
                    // 不能为空
                    notEmpty: {
                        message: '请选择上架信息'
                    },
                    // 提供给ajax回调使用
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            brandId: {
                // 用户名的提示信息
                // message: 'The username is not valid',
                validators: {
                    // 不能为空
                    notEmpty: {
                        message: '请选择归属品牌'
                    },
                    // 提供给ajax回调使用
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            // brandLogo: {
            //     // 用户名的提示信息
            //     // message: 'The username is not valid',
            //     validators: {
            //         // 不能为空
            //         notEmpty: {
            //             message: '请选择图片'
            //         },
            //         // 提供给ajax回调使用
            //         callback: {
            //             message: "用户名不存在"
            //         }
            //     }
            // }
        }
    }).on('success.form.bv', function (e) {
        // 点击提交的时候  
        addObj = {
            proName: $("#proName").val(),
            oldPrice: $("#oldPrice").val(),
            price: $("#price").val(),
            proDesc: $("#proDesc").val(),
            size: $("#size").val(),
            statu: $("#lt_statu").val(),
            num: $("#num").val(),
            brandId: $("#brandId").val()
        }

        // console.log(addObj);

        addProduct(function (res) {
            // console.log(res);
            if (res.success) {
                queryProductDetailList()
                $('#myModal').modal('hide');
            }
        })

        // 阻止默认提交事件
        e.preventDefault();

    });

    /* 重置表单 */
    $('#myModal').on('hidden.bs.modal', function (e) {
        // 重置验证信息
        $('form').data('bootstrapValidator').resetForm();
        $("#proName").val("");
        $("#oldPrice").val("");
        $("#price").val("");
        $("#proDesc").val("");
        $("#size").val("");
        $("#lt_statu").val("");
        $("#num").val("");
        $("#brandId").val("");
        $(".dropdown-text").html("请选择");
    })

    /* 添加產品 */
    function addProduct(callback) {
        $.post("/product/addProduct", addObj, function (res) {
            callback && callback(res);
        })
    }

    /* 更新产品 */
    function updateProduct(callback){
        $.post("/product/updateProduct",updateObj,function(res){
            callback && callback(res);
        })
    }

    /* 查询产品 */
    function queryProductDetailList(callback) {
        $.get("/product/queryProductDetailList", pageObj, function (res) {
            // console.log(res);
            var html = '<tr><th width="5%">序号</th><th width="25%">商品名称</th><th width="25%">商品描述</th><th width="10%">商品库存</th><th width="10%">商品尺寸</th><th width="10%">商品状态</th><th>操作</th></tr>';
            for (var i = 0; i < res.rows.length; i++) {
                html += "<tr data-list='" + JSON.stringify(res.rows[i]) + "'><td>" + ((pageObj.page - 1) * res.size + i + 1) + "</td><td>" + res.rows[i].proName + "</td><td>" + res.rows[i].proDesc + "</td><td>" + res.rows[i].num + "</td><td>" + res.rows[i].size + "</td><td>" + (res.rows[i].statu == 1 ? "已上架" : "已下架") + "</td><td>" + (res.rows[i].statu == 1 ? "<button href='javascript:;' class='btn btn-sm btn-danger lt_soldOut' data-toggle='modal' data-target='#myModal'>下架</butotn>" : "<button href='javascript:;' class='btn btn-sm btn-success lt_ground' data-toggle='modal' data-target='#myModal'>上架</butotn>") + "<button href='javascript:;' class='btn btn-sm btn-primary lt_edit' data-toggle='modal' data-target='#myModal'>编辑</button></td></tr>";
            }
            $(".lt_category_tab").html(html);
            callback && callback(res);
        })
    }

    /* 查询二级分类 */
    function querySecondCategoryPaging(callback) {
        $.get("/category/querySecondCategoryPaging", { page: 1, pageSize: 10000 }, function (res) {
            callback && callback(res);
        })
    }


})