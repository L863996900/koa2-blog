$(document).ready(function () {
    let article_num = window.location.href.split("?")[1].split("=")[1];
    console.log(article_num);
    getComment(article_num)
});

function getComment(article_num) {
    let commentNum = 0;
    fetch('http://127.0.0.1:8080/SelectComment?article_id=' + article_num).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
        let commentList = [];
        commentList = data.data;
        commentNum = data.data.length;
        console.log(commentList)
        getContent(article_num, commentNum)
        $(".leavingText").append(" 已有" + commentNum + "条评论")
        for (i = 0; i < commentList.length; i++) {
            let comItem = $("<div class=\"comment-item\"></div>")
            let comItemLe = $("<div class=\"comment-item-left\"><img src=\"./img/36.jpg\" alt=\"\"></div>")
            let comItemCe = $("   <div class=\"comment-item-center\">\n" +
                "                 <div class=\"comment-item-center-name\">" + commentList[i].com_name + "</div>\n" +
                "                 <div class=\"comment-item-center-content\">" + commentList[i].content + "</div>\n" +
                "                 </div>")
            let comtime_1 = commentList[i].date.substring(0, 10);
            let comtime_2 = commentList[i].date.substring(11, 16);
            let comtime = comtime_1 + " " + comtime_2;
            let comItemRi = $("<div class=\"comment-item-right\">" + comtime + "</div>")
            comItem.append(comItemLe).append(comItemCe).append(comItemRi)
            $(".item-comment-content").append(comItem)
        }
    });
}

function getContent(article_num, commentNum) {
    let articleList = [];
    fetch('http://127.0.0.1:8080/SelectArticleOne?article_id=' + article_num).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
        articleList = data.data[0];
        console.log(articleList);
        let time_1 = articleList.date.substring(0, 10);
        let time_2 = articleList.date.substring(11, 16);
        let time = time_1 + " " + time_2;
        let title = $(" <h1>" + articleList.title + "</h1>");
        let dTitle = $("    <div class=\"d-title-date\">\n" +
            "            <span><img class=\"d-title-icon\" src=\"./icons/catege_title.png\" alt=\"\">" + articleList.category + "</span>\n" +
            "            <span><img class=\"d-title-icon\" src=\"./icons/comment_title.png\" alt=\"\">" + commentNum + "</span>\n" +
            "            <span><img class=\"d-title-icon\" src=\"./icons/time_title.png\" alt=\"\">" + time + "</span>\n" +
            "        </div>");
        $(".d-title").append(title).append(dTitle);
        let backImg = $("<img class=\'back\' src=\'" + articleList.picture + " \'>")
        $('.item-content').append(articleList.content);
        $('.container').append(backImg)
    });
}