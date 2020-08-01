const Router = require('koa-router');

const {
  CategoryValidator,
  PositiveIdParamsValidator
} = require('../../validators/category');

const router = new Router({
  prefix: '/api/v2'
})

const {CategoryDao} = require('../../dao/category');

const { AuthToken } = require('../../middlewares/jwt');

const { getRedis, setRedis } = require('../../cache/redis')
// redis key 前缀
const REDIS_KEY_API_PREFIX = 'yongx_api'

const AUTH_ADMIN = 16;

/**
 * 创建分类
 */
router.post('/category', new AuthToken(AUTH_ADMIN).m, async (ctx) => {
  // 通过验证器校验参数是否通过
  const v = await new CategoryValidator().validate(ctx);
  const result = await CategoryDao.create({
    name: v.get('body.name'),
    key: v.get('body.key'),
    parent_id: v.get('body.parent_id'),
  });
  // 返回结果
  ctx.response.status = 200;
  ctx.json(result)
})


/**
 * 删除分类
 */
router.delete('/category/:id', new AuthToken(AUTH_ADMIN).m, async (ctx) => {

  // 通过验证器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取分类ID参数
  const id = v.get('path.id');
  // 删除分类
  await CategoryDao.destroy(id);

  ctx.response.status = 200;
  ctx.success('删除分类成功');
})


/**
 * 更新分类
 */
router.put('/category/:id', new AuthToken(AUTH_ADMIN).m, async (ctx) => {

  // 通过验证器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取分类ID参数
  const id = v.get('path.id');
  // 更新分类
  await CategoryDao.update(id, v);

  // 返回结果
  ctx.response.status = 200;
  ctx.success('更新分类成功');
})

/**
 * 获取所有的分类
 */
router.get('/category', async (ctx) => {
  const key = `${REDIS_KEY_API_PREFIX}_category_list`
  const cacheCategoryListData = await getRedis(key)
  if (cacheCategoryListData) {
    // 返回结果
    ctx.json(cacheCategoryListData);
  } else {
    const categoryList = await CategoryDao.list();
    setRedis(key, categoryList, 60)
    // 返回结果
    ctx.response.status = 200;
    ctx.json(categoryList);
  }
})

/**
 * 获取分类详情
 */
router.get('/category/:id', async (ctx) => {

  // 通过验证器校验参数是否通过
  const v = await new PositiveIdParamsValidator().validate(ctx);

  // 获取参数
  const id = v.get('path.id');
  // 获取分类
  const category = await CategoryDao.detail(id);

  // 返回结果
  ctx.response.status = 200;
  ctx.json(category);
})

module.exports = router
