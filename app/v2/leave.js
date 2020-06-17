const Router = require('koa-router');

const { AuthToken } = require('../../middlewares/jwt');
const { LeaveDao } = require('../../dao/leave');
const { LeaveValidator } = require('../../validators/leave');

const router = new Router({
    prefix: '/api/v2'
})
const { getRedis, setRedis } = require('../../cache/redis')

const REDIS_KEY_API_PREFIX = 'yongx_api'
const AUTH_ADMIN = 16;
/**
 * 添加留言
 */
router.post('/leave', async (ctx) => {

    // 通过验证器校验参数是否通过
    const v = await new LeaveValidator().validate(ctx);
    const res = await LeaveDao.create(v);

    ctx.success(res.msg)
});

/**
 * 删除留言
 */
router.delete('/leave/:id', new AuthToken(AUTH_ADMIN).m, async (ctx) => {

    const v = await new LeaveValidator().validate(ctx);


    const id = v.get('path.id');
    const res = await LeaveDao.destroy(id);
    ctx.success(res.msg)
})

/**
 * 更新留言
 */
router.put('/article/:id', new AuthToken(AUTH_ADMIN).m, async (ctx) => {

    // 通过验证器校验参数是否通过
    const v = await new LeaveValidator().validate(ctx);

    // 获取文章ID参数
    const id = v.get('path.id');
    // 更新文章

    const res = await LeaveDao.update(id, v);


    // 返回结果
    ctx.success(res.msg)
})


/**
 * 获取留言列表
 */
router.get('/article', async (ctx) => {
    // 尝试获取缓存
    const key = `${REDIS_KEY_API_PREFIX}_leave_list_page${ctx.query.page}`
    const cacheArticleData = await getRedis(key)

    if (cacheArticleData) {
        ctx.response.status = 200;
        ctx.json(cacheArticleData, '获取留言列表成功')
    } else {
        // 没有缓存 读取数据库
        const leaveList = await LeaveDao.list(ctx.query);
        setRedis(key, leaveList, 60)
        // 设置缓存 过期时间1min 
        ctx.response.status = 200;
        ctx.json(leaveList, '获取留言列表成功')
    }
});



module.exports = router
