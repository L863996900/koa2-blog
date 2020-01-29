$(document).ready(function () {
    let articleList = [];
    fetch('http://127.0.0.1:8080/SelectArticleAll').then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
        articleList = data.data.list;
        console.log(articleList);
        for (i = 0; i < articleList.length; i++) {
            let msgListItem = $("<div class=\"msgList-item\"></div>");
            let Ahref=$(" <a target='_blank' href=\'./detail.html?article_id="+articleList[i].article_id+"\'></a>");
            // let Ahref=$(" <a href=\'./detail.html\' ></a>");
            let time_1 = articleList[i].date.substring(0, 10);
            let time_2 = articleList[i].date.substring(11, 16);
            let time = time_1 + " " + time_2;
            let art_title = $("<div class=\'item-title\'>" + articleList[i].title + "</div>");
            let art_date = $("<div class=\'item-data\'><span class=\'item-category\'><img src=\"./icons/label.png\" alt=\"\">" + articleList[i].category + "</span><span\n" +
                "class=\"item-time\"><img src=\"./icons/time.png\" alt=\"\">" + time + "</span></div>")
            let art_img = $("<div class='item-img'><img class=\'item-img-sc\' alt=\"\" src=" + articleList[i].picture + "></div>")
            let art_content = $("<div class=\"item-content\">" + articleList[i].content + "</div>")
            let art_detail = $("<div class=\"item-detail\"><img src=\"./icons/more.png\" alt=\"\"><img src=\"./icons/more.png\" alt=\"\"></div>")
            Ahref.append(art_title).append(art_date).append(art_img).append(art_content).append(art_detail);
            msgListItem.append(Ahref);
            $(".msgList").append(msgListItem);
        }
    });
});
//第二种请求方式
// function get(){
// $.ajax({
//    type:"GET",
//     url:"http://127.0.0.1:8080/SelectArticleAll",
//     dataType:"JSON",
//     success:function (res) {
//         console.log(res)
//     }
// });
// }