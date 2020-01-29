$(document).ready(function () {//在文档加载完毕后执行
    $(window).scroll(function () {//开始监听滚动条
        var top = $(document).scrollTop();//获取当前滚动条高度
        if (top > 500) {
            $(".backtop").fadeIn(100);

        }
        if (top < 500) {
            $(".backtop").fadeOut(100);
        }
        if (top > 100) {
            // $(".backtop").css('display','block');
            var hh = top / 240;
            hh = hh > 1 ? 1 : hh;
            hh.onchange($('.navbar').css('opacity', hh));
        }
    });
    $(".backtop").click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 700);
        return false; //防止冒泡
    });
});
//第二种监听方式
// $(function () {
//     $(window).scroll(function(){
//         if ($(document).scrollTop()>100){
//             console.log('1');
//             $('.backtop').attr('style','display:block;');//显示
//         }
//         else
//         {
//             $('.backtop').attr('style','display:none;');//隐藏
//             // $(".backtop").style.display='block';
//             // $(".backtop").fadeOut(700);
//         }
//     });
//     $(".backtop").click(function(){
//         $('body,html').animate({
//             scrollTop:0
//         },700);
//         return false; //防止冒泡
//     });
// });
$(document).click(function(e) {
    var size = 300//自定义大小
    $('body').append("<div class='dianjixiaoguo'>").append("<div class='dianjixiaoguo2'>")//创建一个div
    $('.dianjixiaoguo').css({//设置初始样式
        position: 'fixed',//使用相对于浏览器进行定位(必须)
        left: e.clientX,
        top: e.clientY,
        borderRadius: size + 'px',
        border: '2px solid #8a8a8a',
    }).stop().animate({//设置最终样式，用动画来表现(当点击过快时需要用stop来终止上一次未进行完的动画)
        width: size,
        height: size,
        speed:2000,
        left: e.clientX - size / 2,
        top: e.clientY - size / 2,
        opacity: '0'
    }, function() {//动画运行完毕后删除此div
        $('body .dianjixiaoguo').remove()
    });
    $('.dianjixiaoguo2').css({//设置初始样式
        position: 'fixed',//使用相对于浏览器进行定位(必须)
        left: e.clientX,
        top: e.clientY,
        borderRadius: 200 + 'px',
        border: '2px solid #8a8a8a',
    }).stop().animate({//设置最终样式，用动画来表现(当点击过快时需要用stop来终止上一次未进行完的动画)
        width: 200,
        height: 200,
        speed:2000,
        left: e.clientX - 200 / 2,
        top: e.clientY - 200 / 2,
        opacity: '0'
    }, function() {//动画运行完毕后删除此div
        $('body .dianjixiaoguo2').remove()
    })
})

