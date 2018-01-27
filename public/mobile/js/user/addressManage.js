$(function () {

    var queryObj;
    init();
    function init() {
        var picker = new mui.PopPicker({
            layer: 3
        });

        picker.setData(cityData3);

        $(".lt_address").on("click", function () {
            picker.pickers[0].setSelectedIndex(1, 200);//选中一级菜单的第一项
            picker.pickers[1].setSelectedIndex(1);//选中二级菜单中的第一项
            picker.show(function (SelectedItem) {
                var addressTxt = "";
                console.log(SelectedItem);
                for (var i = 0; i < SelectedItem.length; i++) {
                    if (SelectedItem[i].text) {
                        addressTxt += SelectedItem[i].text;
                    }
                    if (SelectedItem[0].text == SelectedItem[1].text && !SelectedItem[2].text) {
                        break;
                    }
                }
                $(".lt_address").val(addressTxt);
            })
        })

        /* 拿到id渲染数据渲染数据 */
        var id = $.getQueryProduct("addressId");
        if(id){
            queryAddress(function (res) {
                var data;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].id == id) {
                        data = res[i];
                    }
                }
                $(".lt_username").val(data.recipients);
                $(".lt_email").val(data.postCode);
                $(".lt_address").val(data.address);
                $(".lt_addressManage").val(data.addressDetail);
            })
        }

        /* 点击确认按钮 */
        $(".is_true").on("tap", function () {
            var username = $(".lt_username").val();
            var email = $(".lt_email").val();
            var address = $(".lt_address").val();
            var addressManage = $(".lt_addressManage").val();
            /* id不存在是新增逻辑 */
            if (!id) {
                if (!checkAdd(username, email, address, addressManage)){
                    return;
                }
                queryObj = {
                    recipients: username,
                    postcode: email,
                    address: address,
                    addressDetail: addressManage
                }

                console.log(queryObj);

                addAddress(function (res) {
                    console.log(res);
                    if (res.success) {
                        location.href = "/mobile/user/address.html";
                    }
                    mui.toast("添加失败");
                })
            } else {/* id存在是跟新逻辑 */
                if (!checkAdd(username, email, address, addressManage)) {
                    return;
                }
                queryObj = {
                    recipients: username,
                    postcode: email,
                    address: address,
                    addressDetail: addressManage,
                    id: id
                }
                console.log(queryObj);
                updateAddress(function(res){
                    console.log(res);
                    if(res.success){
                        location.href = "/mobile/user/address.html";
                        return;
                    }   
                    mui.toast("更新失败");
                })
            }

        })
    }

    /* 验证邮编 */
    function checkEmail(name) {
        var emailRxp = new RegExp(/[1-9]\d{5}(?!\d)/);
        if (emailRxp.test(name)) {
            return true;
        }
        return false;
    }

    /* 添加购物车 */
    function addAddress(callback) {
        $.ltAjax({
            url: "/address/addAddress",
            data: queryObj,
            type: "post",
            success: function (res) {
                callback && callback(res);
            }
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

    /* 更新地址信息 */
    function updateAddress(callback) {
        $.ltAjax({
            url: "/address/updateAddress",
            type: "post",
            data: queryObj,
            success: function (res) {
                callback && callback(res);
            }
        })
    }

    /* 验证添加信息 */
    function checkAdd(username, email, address, addressManage){
        if (!$.trim(username)) {
            mui.toast("请输入收货人")
            return false;
        }
        if (!$.trim(email)) {
            mui.toast("请输入邮编")
            return false;
        } else if (!checkEmail(email)) {
            mui.toast("请输入合法邮编")
            return false;
        }

        if (!$.trim(address)) {
            mui.toast("请选择省市区")
            return false;
        }

        if (!$.trim(addressManage)) {
            mui.toast("请输入详细地址")
            return false;
        }
        return true;
    }

})