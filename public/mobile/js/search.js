$(function(){

    /* 点击搜索按钮 */
    $(".search").on("tap",function(){
        var txt = $(".search_content").val();
        if(!$.trim(txt)){
            mui.toast("请输入关键字")
            return;
        }
        var ls = localStorage;
        var arr = (ls.getItem("ltHistory") && JSON.parse(ls.getItem("ltHistory"))) || [];

        for(var i = 0;i<arr.length;i++){
            var element = arr[i];
            if(element == txt){
                arr.splice(i,1);
            }
        }

        arr.push(txt);
        ls.setItem("ltHistory",JSON.stringify(arr));

        var str = "";
        for(var i = 0;i<arr.length;i++){
            str += '<li><a href = "javascript:;" >' + arr[i] +'</a><span class="fa fa-close removeItem"></span></li>';
        }

        $(".lt_list").html(str);
        location.href = "./searchList.html?key=" + txt;
        // init();
    })

    /* 单击删除某个记录 */
    $(".lt_list").on("tap",".removeItem",function(e){
        var index = $(e.target).parent().index();
        var ls = localStorage;
        var arr = (ls.getItem("ltHistory") && JSON.parse(ls.getItem("ltHistory"))) || [];
        arr.splice(index,1);
        var str = "";
        for(var i = 0;i<arr.length;i++){
            var element = arr[i];
            str += '<li><a href = "javascript:;" >' + arr[i] + '</a><span class="fa fa-close removeItem"></span></li>';
        }
        ls.setItem("ltHistory",JSON.stringify(arr));
        $(".lt_list").html(str);
    })

    /* 删除所有记录 */
    $(".clearAll").on("tap",function(){
        var ls = localStorage;
        ls.removeItem("ltHistory");
        $(".lt_list").html("");
    })

    /* 初始化样式 */
    init();
    function init(){
        var ls = localStorage;
        var arr = (ls.getItem("ltHistory") && JSON.parse(ls.getItem("ltHistory"))) || [];

        var str = "";
        for (var i = 0; i < arr.length; i++) {
            var element = arr[i];
            str += '<li><a href = "javascript:;" >' + element + '</a><span class="fa fa-close removeItem"></span></li>';
        }
        $(".lt_list").html(str);

        if(arr.length > 0){
            $(".title").hide();
            $(".history").show();
        }else{
            $(".history").hide();
            $(".title").show();
        }
    }
    
}); 