const router = require('koa-router')({
    prefix: '/api/v2/'
})
const { UserDao } = require('../../dao/user')
const {
    RegisterValidator,
    UserLoginValidator
} = require('../../validators/user')
const {
    generateToken,
    AuthToken
} = require('../../middlewares/jwt')
const { getRedis, setRedis } = require('../../cache/redis')

const REDIS_KEY_API_PREFIX = 'yongx_api'
const Auth_User = 16;

//注册
router.post('user/register', async (ctx) => {
    const v = await new RegisterValidator().validate(ctx);

    const user = await UserDao.create({
        reg_count: v.get('body.reg_count'),
        username: v.get('body.username'),
        password: v.get('body.password2'),
        email: v.get('body.email'),
        user_picture: v.get('body.user_picture'),
    })
    ctx.response.status = 200;
    ctx.json(user)
})

//登陆
router.post('user/login', async (ctx) => {
    const v = await new UserLoginValidator().validate(ctx);
    const user = await UserDao.verify({
        reg_count: v.get('body.reg_count'),
        password: v.get('body.password')
    })
    if (user.id) {
        const token = generateToken(user.id, AuthToken.Admin)
        ctx.response.status = 200;
        ctx.json({
            msg: '登陆成功',
            token: token
        })
    } else {
        ctx.error(user.err_msg)
    }

})

// 获取用户信息
router.get('user', new AuthToken(Auth_User).m, async (ctx) => {
    // 获取用户id
    try {
        if (!ctx.auth.uid) {
            ctx.error(ctx.auth.errMsg)
        } else if (ctx.auth.uid) {
            const id = ctx.auth.uid
            let userInfo = await UserDao.detail(id)
            ctx.response.status = 200;
            if (!userInfo) {
                ctx.error("账号或密码错误")
            } else {
                ctx.json(userInfo)
            }
        } else {
            ctx.error("未知错误，请重试或联系我！")
        }
    } catch (e) {
        ctx.error(e)
    }
})
// 获取用户列表
router.post('user/list', new AuthToken(Auth_User).m, async (ctx) => {
    // 获取用户id
    try {
        const key = `${REDIS_KEY_API_PREFIX}_user_list${ctx.request.body.reg_count}_page${ctx.request.body.page}_pageSize${ctx.request.body.pageSize}`
        const cacheUserListData = await getRedis(key)
        if (cacheUserListData) {
            ctx.response.status = 200;
            ctx.json(cacheUserListData, '获取用户列表成功')
            //  console.log('获取缓存')
        } else {
            if (!ctx.auth.uid) {
                ctx.error(ctx.auth.errMsg)
            } else if (ctx.auth.uid) {
                const id = ctx.auth.uid
                let userInfo = await UserDao.detail(id)
                if (userInfo.dataValues.level !== 0) return ctx.error("权限不足")
                let userList = await UserDao.list(ctx.request.body)
                // 设置缓存 过期时间1min 
                setRedis(key, userList, 60)
                ctx.response.status = 200;
                ctx.json(userList, '获取用户列表成功')
                //  console.log('请求数据库')
            }
        }
    } catch (e) {
        ctx.error(e)
    }
})



router.post('user/update', new AuthToken(Auth_User).m, async (ctx) => {
    const id = ctx.request.body.id
    console.log(ctx.request.body)
    const res = await UserDao.update(id,ctx.request.body)
    ctx.response.status = 200;
    if (res) {
        ctx.success(res.msg)
    } else {
        ctx.response.status = 500;
        ctx.error('更新失败')
    }
})
module.exports = router