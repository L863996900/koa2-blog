const Router = require('koa-router')

const { CommentDao } = require('../../dao/comment')
const {
    CommentValidator,
    PositiveArticleIdParamsValidator } = require('../../validators/comment')
const { AuthToken } = require('../../middlewares/jwt');



const { setRedis } = require('../../cache/redis')
const REDIS_KEY_PREFIX = 'yongx_'

const REDIS_KEY_API_PREFIX = 'yongx_api'
const AUTH_ADMIN = 16;

const router = new Router({
    prefix: '/api/v2'
})

// 创建评论
router.post('/comment',new AuthToken(AUTH_ADMIN).m,async (ctx) => {

    // 通过验证器校验参数是否通过
    const v = await new CommentValidator().validate(ctx);
    const res = await CommentDao.create(v);


    // 清除Redis
    const key = `${REDIS_KEY_PREFIX}_article_detail_${v.get('body.com_id')}`
    const apikey = `${REDIS_KEY_API_PREFIX}_article_detail_${v.get('body.com_id')}`
    setRedis(key, null, 0)
    setRedis(apikey, null, 0)

    // 返回结果
    ctx.response.status = 200;
    ctx.json(res);
})

// 删除评论
router.delete('/comment/:id', new AuthToken(AUTH_ADMIN).m, async (ctx) => {

    // 通过验证器校验参数是否通过
    const v = await new PositiveArticleIdParamsValidator().validate(ctx);

    // 获取分类ID参数
    const id = v.get('path.id');
    await CommentDao.destroy(id);

    // 返回结果
    ctx.response.status = 200;
    ctx.success('删除评论成功')
})

// 修改评论
router.put('/comment/:id', new AuthToken(AUTH_ADMIN).m, async (ctx) => {

    // 通过验证器校验参数是否通过
    const v = await new PositiveArticleIdParamsValidator().validate(ctx);

    // 获取分类ID参数
    const id = v.get('path.id');
    await CommentDao.update(id, v);

    // 返回结果
    ctx.response.status = 200;
    ctx.success('更新评论成功')
})

// 获取评论列表
router.get('/comment', async (ctx) => {
    const page = ctx.query.page;
    let commentList = await CommentDao.list(page);

    // 返回结果
    ctx.response.status = 200;
    ctx.json(commentList);

})

// 获取评论详情
router.get('/comment/:id', async (ctx) => {
    // 通过验证器校验参数是否通过
    const v = await new PositiveArticleIdParamsValidator().validate(ctx);

    // 获取分类ID参数
    const id = v.get('path.id');
    let comment = await CommentDao.detail(id)

    // 返回结果
    ctx.response.status = 200;
    ctx.json(comment);

})

// 获取关联目标下的评论列表
router.get('/comment/target/list', async (ctx) => {
    let comment = await CommentDao.targetComment(ctx.query)

    // 返回结果
    ctx.response.status = 200;
    ctx.json(comment);
})

module.exports = router
