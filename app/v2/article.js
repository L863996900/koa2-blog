const Router = require('koa-router');

const { AuthToken } = require('../../middlewares/jwt');
const { ArticleDao } = require('../../dao/article');
const {
    ArticleValidator,
    PositiveIdParamsValidator
  } = require('../../validators/article');

const router = new Router({
    prefix: '/api/v2'
})
const { getRedis, setRedis} = require('../../cache/redis')

const REDIS_KEY_API_PREFIX = 'yongx_api'
const AUTH_ADMIN = 16;
/**
 * 创建文章
 */
router.post('/article', new AuthToken(AUTH_ADMIN).m, async (ctx) => {

    // 通过验证器校验参数是否通过
    const v = await new ArticleValidator().validate(ctx);
    const res = await ArticleDao.create(v);

    // 返回结果
    ctx.response.status = res.code;
    ctx.success(res.msg)
});

/**
 * 删除文章
 */
router.delete('/article/:id', new AuthToken(AUTH_ADMIN).m, async (ctx) => {

    const v = await new PositiveIdParamsValidator().validate(ctx);

    // 获取文章ID参数
    const id = v.get('path.id');
    const res = await ArticleDao.destroy(id);


    // 返回结果
    if (res) {
        ctx.success(res.msg)
    } else {
        ctx.response.status = 500;
        ctx.error('删除失败')
    }
})

/**
 * 更新文章
 */
router.put('/article/:id', new AuthToken(AUTH_ADMIN).m, async (ctx) => {


    // 更新文章
      // 通过验证器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取文章ID参数
  const id = v.get('path.id');
  // 更新文章
  
    const res =await ArticleDao.update(id, v);


    // 返回结果
    if (res) {
        ctx.success(res.msg)
    } else {
        ctx.response.status = 500;
        ctx.error('更新失败')
    }
})


/**
 * 获取文章列表
 */
router.get('/article', async (ctx) => {
    // 尝试获取缓存
    const key = `${REDIS_KEY_API_PREFIX}_article_list_category${ctx.query.category}_page${ctx.query.page}`
    const cacheArticleData = await getRedis(key)

    if(cacheArticleData){
        ctx.response.status = 200;
        ctx.json(cacheArticleData, '获取文章列表成功')
        //  console.log('获取缓存')
    }else{        
        // 没有缓存 读取数据库
        const articleList = await ArticleDao.list(ctx.query);
        setRedis(key, articleList, 60)
        // 设置缓存 过期时间1min 
        ctx.response.status = 200;
        ctx.json(articleList, '获取文章列表成功')
        //  console.log('请求数据库')
    }
    console.log(global.config)
});

/**
 * 查询文章详情
 */
router.get('/article/:id', async (ctx) => {

    console.log(ctx.params.id)
    // 查询文章
    const res = await ArticleDao.detail(ctx.params.id);
    // 获取关联此文章的评论列表
    // const commentList = await CommentDao.targetComment({
    //     target_id: id,
    //     target_type: 'article'
    // });
    // // 更新文章浏览
    // await ArticleDao.updateBrowse(id, ++article.browse);
    // await article.setDataValue('article_comment', commentList);
    // console.log(res)


    // 返回结果
    if (res) {
        ctx.json(res, '获取文章详情成功')
    } else {
        ctx.response.status = 500;
        ctx.error('获取文章详情失败')
    }

})

module.exports = router
