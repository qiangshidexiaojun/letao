/**
 * 把getQueryProduct方法挂载在$对象上
 */
$.extend($, {
    /**
     * 用正则获取url上的参数的一个函数
     * @param {*参数名} name 
     */
    getQueryProduct: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]); return null;
    }
})



