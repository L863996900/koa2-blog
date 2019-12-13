function changepic() {
    console.log(1);
    var file = document.querySelector('input[type=file]').files[0]; //IE10以下不支持
    EXIF.getData(file, function() {
        var Orientation = EXIF.getTag(this, 'Orientation');
        if (Orientation && Orientation != 1) { //图片角度不正确
            fileFun(Orientation, file);
            console.log(Orientation)
        } else {
            //不需处理直接上传
        }
    });

    //base64格式图片 转为Blob  
    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
    //图片处理函数
    function fileFun(Orientation, file) {
        var reader = new FileReader();
        var image = new Image();
        reader.readAsDataURL(file);

        reader.onload = function(ev) {
            image.src = ev.target.result;
            image.onload = function() {
                var imgWidth = this.width,
                    imgHeight = this.height; //获取图片宽高
                var canvas = document.getElementById("myCanvas");
                var ctx = canvas.getContext('2d');
                canvas.width = imgWidth;
                canvas.height = imgHeight;
                if (Orientation && Orientation != 1) {
                    switch (Orientation) {
                        case 6: // 旋转90度
                            canvas.width = imgHeight;
                            canvas.height = imgWidth;
                            ctx.rotate(Math.PI / 2);
                            ctx.drawImage(this, 0, -imgHeight, imgWidth, imgHeight);
                            break;
                        case 3: // 旋转180度
                            ctx.rotate(Math.PI);
                            ctx.drawImage(this, -imgWidth, -imgHeight, imgWidth, imgHeight);
                            break;
                        case 8: // 旋转-90度
                            canvas.width = imgHeight;
                            canvas.height = imgWidth;
                            ctx.rotate(3 * Math.PI / 2);
                            ctx.drawImage(this, -imgWidth, 0, imgWidth, imgHeight);
                            break;
                    }
                } else {
                    ctx.drawImage(this, 0, 0, imgWidth, imgHeight);
                }
                var dataurl = canvas.toDataURL("image/jpeg", 0.8); //canvase 转为base64
                var blob = dataURLtoBlob(dataurl); //base64转为blog
            }
        }
    }
}
// // 1.图片旋转及图片压缩  fileObj指input上传的图片文件,callback会将base64图片传入，自行处理显示
// function compress(fileObj, callback) {
//     if (typeof(FileReader) === 'undefined') {
//         console.log("当前浏览器内核不支持base64图片压缩")
//             // getObjectURL()方法见下方，无法压缩图片时直接将fileObj处理为网页可显示的图片
//         callback(getObjectURL(fileObj))
//     } else {
//         try {
//             var reader = new FileReader();
//             reader.onload = function(e) {
//                 var image = new Image();
//                 image.onload = function() {
//                     var Orientation
//                     EXIF.getData(image, function() {
//                         Orientation = EXIF.getTag(this, 'Orientation');
//                     });

//                     var canvas = document.createElement('canvas'),
//                         context = canvas.getContext('2d'),
//                         squareW = this.width, //定义画布大小,也就是图片压缩之后的像素
//                         squareH = this.height;

//                     if (Orientation == 3) {
//                         canvas.width = squareW;
//                         canvas.height = squareH;
//                         context.rotate(Math.PI);
//                         context.drawImage(image, 0, 0, -squareW, -squareH);

//                     } else if (Orientation == 8) {
//                         canvas.width = squareH;
//                         canvas.height = squareW;
//                         context.rotate(Math.PI * 3 / 2);
//                         context.drawImage(image, 0, 0, -squareW, squareH);

//                     } else if (Orientation == 6) {
//                         canvas.width = squareH;
//                         canvas.height = squareW;
//                         context.rotate(Math.PI / 2);
//                         context.drawImage(image, 0, 0, squareW, -squareH);

//                     } else {
//                         canvas.width = squareW;
//                         canvas.height = squareH;
//                         context.drawImage(image, 0, 0, squareW, squareH);

//                     }

//                     var data = canvas.toDataURL('image/jpeg')
//                     callback(data)
//                 }

//                 image.src = e.target.result
//             };
//             reader.readAsDataURL(fileObj);
//         } catch (e) {
//             console.log('压缩失败!')
//             callback(getObjectURL(fileObj))
//         }
//     }
// }

// //  getObjectURL()  将file类型转化为可显示的图片
// function getObjectURL(file) {
//     var url = null;
//     if (window.createObjectURL != undefined) { // basic
//         url = window.createObjectURL(file);
//     } else if (window.URL != undefined) { // mozilla(firefox)
//         url = window.URL.createObjectURL(file);
//     } else if (window.webkitURL != undefined) { // webkit or chrome
//         url = window.webkitURL.createObjectURL(file);
//     }
//     return url;
// }