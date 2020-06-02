(async function() {
    const koa = require('koa');
    const Router = require('koa-router');
    const views = require('koa-views')
    const Bodyparser = require('koa-bodyparser');
    const fs = require('fs');
    const mysql = require('mysql2/promise');
    const app = new koa();
    const multer = require('koa-multer')
    const ueditor = require('koa2-ueditor');
    const router = new Router();
    const path = require('path');
    const cors = require('koa2-cors');
    const Static = require('koa-static');
    app.use(cors());
    app.use(Bodyparser());
    app.use(Static(path.join(__dirname + 'static')));
    app.use(Static(path.join(__dirname + 'image')));
    //配置前端页面静态资源
    app.use(Static('./static', {
        prefix: '/static',
        gzip: true,
    }));
    //创建数据库方法 连接数据库
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '123456',
        database: 'blog'
    });
    //配置本地图片上传接口
    //配置

    //文件上传
    //配置
    var storage = multer.diskStorage({
        //文件保存路径
        destination: function(req, file, cb) {
            cb(null, 'static/img/')
        },
        //修改文件名称
        filename: function(req, file, cb) {
            var fileFormat = (file.originalname).split("."); //以点分割成数组，数组的最后一项就是后缀名
            // cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);     
            cb(null, Date.now() + ".jpg");

        }
    });
    //加载配置
    var upload = multer({ storage: storage });
    router.post('/upload', upload.single('file'), async(ctx, next) => {
        ctx.body = {
            filename: 'http://localhost:8080/img/' + ctx.req.file.filename //返回文件名
        }
    })
    router.post('/Uploadimg', ctx => (req, res, next) => {
        let imgData = ctx.request.body.imageUrl
            // var base64Data = imgData.replace(/^data:image\/\w+;base64,/, '')
        var dataBuffer = new Buffer(imgData, 'base64')
        fs.writeFile(path.normalize(__dirname + "/" + "./img/") + "1" + ".jpg", dataBuffer, function(err) {
            if (err) {
                return
            } else {
                console.log('图片保存成功')
                ctx.body = {
                    code: 200
                }
            }
        })
        res.end('ok')
    });

    //配置编辑器上传图片接口
    router.all('/ImgUpload',
        ueditor(['static', {
            // 上传图片的格式
            "imageAllowFiles": [".png", ".jpg", ".jpeg"],
            // 最后保存的文件路径
            "imagePathFormat": "/image/{yyyy}{mm}{dd}/{filename}",
            "imageUrlPrefix": "http://localhost:8080"
        }])
    );
    //创建增加文章路由
    router.get('/article', async ctx => {
        const content = fs.readFileSync('./static/BlogAdmin/AddArticle.html');
        ctx.body = content.toString();
    });

    router.get('/home', async ctx => {
        const content = fs.readFileSync('./static/home.html');
        ctx.body = content.toString();
    });

    //创建前端页面路由
    router.get('/', async ctx => {
        const content = fs.readFileSync('./static/index.html');
        ctx.body = content.toString();
    });
    router.get('/ss', async ctx => {
        const content = fs.readFileSync('./static/ss.html');
        ctx.body = content.toString();
    });
    //路由模块
    //添加文章
    router.post('/AddArticle', async ctx => {
        const user_id = ctx.request.body.user_id || '';
        const category = ctx.request.body.category || '';
        const title = ctx.request.body.title || '';
        const content = ctx.request.body.content || '';
        const picture = ctx.request.body.picture || '';
        if (user_id == '' && user_id == null && user_id == undefined) {
            ctx.body = {
                code: 501,
                data: '用户id不能为空'
            }
            return;
        }
        if (category == '' && category == null && category == undefined) {
            ctx.body = {
                code: 502,
                data: '文章类型不能为空'
            }
            return;
        }
        if (title == '' && title == null && title == undefined) {
            ctx.body = {
                code: 503,
                data: '文章标题不能为空'
            }
            return;
        }
        if (content == '' && content == null && content == undefined) {
            ctx.body = {
                code: 504,
                data: '文章内容不能为空'
            }
            return;
        }
        // const [result] = await connection.query("INSERT INTO article (title, user_id) VALUES ('" + title + "', 0)");
        const [result] = await connection.query("INSERT INTO article (user_id,category,title,content,picture) VALUES ('" + user_id + "','" + category + "','" + title + "','" + content + "','" + picture + "')")
        if (result.affectedRows > 0) {
            ctx.body = {
                code: 200,
                data: '添加文章成功'
            }
        } else {
            ctx.body = {
                code: 500,
                data: '添加文章失败'
            }
        }
    });
    //删除文章
    router.post('/DeleteArticle', async ctx => {
        const article_id = Number(ctx.request.body.article_id) || 0;
        let sql = "DELETE FROM article WHERE ??=?";
        let [result] = await connection.query(sql, ['article_id', article_id]);
        if (result.affectedRows > 0) {
            ctx.body = {
                code: 200,
                data: '删除文章成功'
            }
        } else {
            ctx.body = {
                code: 400,
                data: '删除文章失败'
            }
        }
    });
    //分页查询文章
    router.get('/SelectArticle', async ctx => {
        // const [data] = await connection.query("SELECT id,title,done FROM art ORDER BY done DESC, id DESC");
        // 接受前端 分页请求参数 
        let page = ctx.query.page || 1;
        page = Number(page);
        let prepage = ctx.query.prepage || 4;
        prepage = Number(prepage);
        let type = ctx.query.type || 0;
        let where = '';
        if (type) {
            where = 'WHERE category=' + type;
        }
        // 查询总的记录条数
        const sql = `SELECT * FROM article ${where}`;
        const [listAll] = await connection.query(sql);
        // 总的数据量 / 每页显示条数，注意：小数
        const pages = Math.ceil(listAll.length / prepage);

        const sql2 = `SELECT * FROM article ${where} LIMIT ? OFFSET ?`;

        const [list] = await connection.query(sql2, [prepage, (page - 1) * prepage]);

        ctx.body = {
            code: 200,
            msg: '分页查询文章成功',
            data: {
                page,
                prepage,
                pages,
                list
            }
        }
    });
    //查询总的文章条数
    router.get('/SelectArticleAll', async ctx => {
        const sql2 = `SELECT * FROM article  ORDER BY article_id DESC`;
        const [list] = await connection.query(sql2);
        ctx.body = {
            code: 200,
            msg: '查询所有文章成功',
            data: {
                list
            }
        }
    });
    //查询某一个文章
    router.get('/SelectArticleOne', async ctx => {
        let article_id = ctx.query.article_id || ""
        article_id = Number(article_id)
        if (article_id) {
            where = 'WHERE article_id=' + article_id
        }
        const sql = `SELECT * FROM article ${where}`;
        const [list] = await connection.query(sql);
        ctx.body = {
            code: 200,
            msg: '查询某个文章成功',
            data: list
        }
    });
    // 用户模块
    //用户登陆
    router.post('/login', async ctx => {
        let { username, password } = ctx.request.body;
        let sql = `SELECT * FROM user WHERE username = ${username} AND password=${password}`;
        let [data] = await connection.query(sql);
        if (data.length > 0) {
            ctx.body = {
                code: 200,
                msg: '登陆成功',
                data: [data]
            }
        } else {
            ctx.body = {
                code: 500,
                msg: '登陆失败',
                data: [data]
            }
        }
    });
    //用户注册
    router.post('/regist', async ctx => {
        let { username, password } = ctx.request.body;
        let sql = `SELECT * FROM user WHERE username = ${username}`
        let [result] = await connection.query(sql);
        if (result.length > 0) {
            ctx.body = {
                code: 202,
                msg: '用户已存在'
            }
        } else {
            let sql2 = `INSERT INTO user (username,password,level) values ('${username}','${password}',1)`;
            let [rs] = await connection.query(sql2);
            if (rs.affectedRows > 0) {
                ctx.body = {
                    code: 200,
                    msg: '注册成功'
                }
            } else {
                ctx.body = {
                    code: 201,
                    msg: '注册失败'
                }
            }
        }
    });
    //用户评论
    router.post('/AddComment', async ctx => {
        let { content, article_id,com_name } = ctx.request.body || "";
        let sql = `INSERT INTO comment (article_id,content,com_name) values ('${article_id}','${content}','${com_name}')`;
        let [res] = await connection.query(sql)
        if (res.affectedRows > 0) {
            ctx.body = {
                code: 200,
                msg: '评论成功'
            }
        } else {
            ctx.body = {
                code: 201,
                msg: '评论失败'
            }
        }
    });
    //查询某个id文章下的评论
    router.get('/SelectComment', async ctx => {
        let article_id = ctx.query.article_id || 0;
        article_id = Number(article_id);
        if (article_id) {
            where = 'WHERE article_id=' + article_id
        };
        const sql = `SELECT * FROM comment ${where}`;
        const [list] = await connection.query(sql);
        if (list.length > 0) {
            ctx.body = {
                code: 200,
                msg: '查询评论成功',
                data: list
            }
        } else {
            ctx.body = {
                code: 201,
                msg: '查询失败'
            }
        }
    });
    //删除某个评论
    router.post('/DelectComment', async ctx => {
        const id = Number(ctx.request.body.id) || 0;
        let sql = "DELETE FROM comment WHERE ??=?";
        let [result] = await connection.query(sql, ['id', id]);
        if (result.affectedRows > 0) {
            ctx.body = {
                code: 200,
                data: '删除评论成功'
            }
        } else {
            ctx.body = {
                code: 201,
                data: '删除评论失败'
            }
        }
    });
    //增加留言
    router.post('/AddLevaingMsg', async ctx => {
        let content = ctx.request.body.content || "";
        let sql = `INSERT INTO leavingmsg (content) values ('${content}')`;
        let [res] = await connection.query(sql)
        if (res.affectedRows > 0) {
            ctx.body = {
                code: 200,
                msg: '留言成功'
            }
        } else {
            ctx.body = {
                code: 201,
                msg: '留言失败'
            }
        }
    });
    //删除某个留言
    router.post('/DelectLevaingMsg', async ctx => {
        const id = Number(ctx.request.body.id) || 0;
        let sql = "DELETE FROM leavingmsg WHERE ??=?";
        let [result] = await connection.query(sql, ['id', id]);
        if (result.affectedRows > 0) {
            ctx.body = {
                code: 200,
                data: '删除留言成功'
            }
        } else {
            ctx.body = {
                code: 201,
                data: '删除留言失败'
            }
        }
    });
    //查询所有留言
    router.get('/SelectLeavingMsg', async ctx => {
        const sql = `SELECT * FROM leavingmsg`;
        const [list] = await connection.query(sql);
        if (list.length > 0) {
            ctx.body = {
                code: 200,
                msg: '查询留言成功',
                data: list
            }
        } else {
            ctx.body = {
                code: 201,
                msg: '查询留言失败'
            }
        }
    });
    app.use(router.routes());
    app.listen(8080,function(){
        console.log('listen on 8080')
    });
})()