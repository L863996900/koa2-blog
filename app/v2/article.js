const Router = require('koa-router');

const { AuthToken } = require('../../middlewares/jwt');
const { ArticleDao } = require('../../dao/article');
// const { CommentDao } = require('../../dao/comment');


const router = new Router({
    prefix: '/api/v2'
})
const AUTH_ADMIN = 16;
/**
 * 创建文章
 */
router.post('/article', new AuthToken(AUTH_ADMIN).m, async (ctx) => {


    const res = await ArticleDao.create(ctx.request.body);

    // 返回结果
    if (res) {
        ctx.response.status = res.code;
        ctx.success(res.msg)
    } else {
        ctx.response.status = 500;
        ctx.error('参数错误')
    }
});

/**
 * 删除文章
 */
router.delete('/article/:id', new AuthToken(AUTH_ADMIN).m, async (ctx) => {

    // 获取文章ID参数
    const id = ctx.params.id
    // 删除文章
    const res = await ArticleDao.destroy(id);


    // 返回结果
    if (res) {
        ctx.response.status = res.code;
        ctx.success(res.msg)
    } else {
        ctx.response.status = 500;
        ctx.error('参数错误')
    }
})

/**
 * 更新文章
 */
router.put('/article/:id', new AuthToken(AUTH_ADMIN).m, async (ctx) => {


    // 更新文章
    const res = await ArticleDao.update(ctx.params.id, ctx.request.body);


    // 返回结果
    if (res) {
        ctx.response.status = res.code;
        ctx.success(res.msg)
    } else {
        ctx.response.status = 500;
        ctx.error('参数错误')
    }
})


/**
 * 获取文章列表
 */
router.get('/article', async (ctx) => {
    const articleList = await ArticleDao.list(ctx.query);
    ctx.response.status = 200;

    ctx.json(articleList, '获取文章列表成功')
});

/**
 * 查询文章详情
 */
router.get('/article/:id', async (ctx) => {


    // 查询文章
    const article = await ArticleDao.detail(ctx.params.id);
    // 获取关联此文章的评论列表
    const commentList = await CommentDao.targetComment({
        target_id: id,
        target_type: 'article'
    });
    // 更新文章浏览
    await ArticleDao.updateBrowse(id, ++article.browse);
    await article.setDataValue('article_comment', commentList);



    // 返回结果
    if (res) {
        ctx.response.status = res.code;
        ctx.json(article,'获取文章详情成功')
    } else {
        ctx.response.status = 500;
        ctx.error('参数错误')
    }

})

module.exports = router
