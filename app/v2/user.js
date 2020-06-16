const router = require('koa-router')({
    prefix: '/api/v2/user'
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

const Auth_User = 16;

//注册
router.post('/register', async (ctx) => {
    const v = await new RegisterValidator().validate(ctx);

    const user = await UserDao.create({
        reg_phone: v.get('body.reg_phone'),
        username: v.get('body.username'),
        password: v.get('body.password2'),
        email: v.get('body.email'),
        user_picture: v.get('body.user_picture'),
    })
    ctx.response.status = 200;
    ctx.json(user)
})

//登陆
router.post('/login', async (ctx) => {
    const v = await new UserLoginValidator().validate(ctx);
    const user = await UserDao.verify({
        reg_phone: v.get('body.reg_phone'),
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
router.get('/:id', new AuthToken(Auth_User).m, async (ctx) => {
    // 获取用户id
    try {
        if (!ctx.auth.uid) {
            ctx.error(ctx.auth.errMsg)
        } else if (ctx.auth.uid) {
            const id = ctx.auth.uid
            console.log(id)
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

module.exports = router