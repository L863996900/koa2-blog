const router = require('koa-router')({
    prefix: '/api/v2'
})
const multer = require('koa-multer')
//文件上传
//配置
const path = require('path')

var storage = multer.diskStorage({
    //文件保存路径
    // destination: function (req, file, cb) {
    //     cb(null, 'public/uploads/')
    // },
    //路径根据具体而定。如果不存在的话会自动创建一个路径
    destination: path.resolve('public/uploads/'),
    //修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
// 加载配置
var upload = multer({ storage: storage });
router.post('/upload', upload.single('file'), async (ctx, next) => {
    ctx.body = {
        filename: 'http://localhost:3000/uploads/' + ctx.req.file.filename//返回文件名
    }
})
// const multer = require('koa-multer');//加载koa-multer模块
// // 上传 图片
// var storage = multer.diskStorage({
//         //文件保存路径
//         destination: function(req, file, cb) {
//             cb(null, 'public/uploads/')
//         },
//         //修改文件名称
//         filename: function(req, file, cb) {
//             var fileFormat = (file.originalname).split(".");
//             cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
//         }
//     })
//     //加载配置
// var upload = multer({
//     storage: storage
// });
// router.post('/upload', upload.single('file'), async(ctx, next) => {
//     ctx.body = {
//         filename: ctx.req.file.filename //返回文件名
//     }
// })


// const multer = require('koa-multer')//解析上传文件
// const path = require('path')

// let storage = multer.diskStorage({
// 	//定义文件保存路径
//     destination: path.resolve('upload'),//路径根据具体而定。如果不存在的话会自动创建一个路径
//     filename: (ctx, file, cb)=>{
//         cb(null, file.originalname);
//     },
// 	//修改文件名
// 	filename:function(req,file,cb){
//             var fileFormat = (file.originalname).split(".");
//                 cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
//         }
// });

// let upload = multer({ storage: storage});

// router.post('/upload',upload.single('file'), async ctx => {
//     console.log(ctx.req.body)//获取上传的表单数据
//     console.log(ctx.req.file)//获取上传的文件图片数据
// })
//html
// <form action="http://127.0.0.1:3005/api/v2/upload" method="post" enctype="multipart/form-data">
// <input type="file" name="file"/>
// <input type="submit" value="ok"/>
// </form>

module.exports = router