const router = require('koa-router')({
    prefix: '/api/v2/user'
})

const { UserDao } = require('../../dao/user')
// const { AuthToken } = require('../../middlewares/jwt')

const { LoginIn } = require('../../service/login')

const {
    generateToken,
    AuthToken
} = require('../../middlewares/jwt')

const Auth_User = 16;

//注册
router.post('/register',async (ctx) =>{
    let {reg_phone,username,password,email,user_picture} = ctx.request.body
    const user = await UserDao.create({
        reg_phone:reg_phone,
        username:username,
        password:password,
        email:email,
        user_picture:user_picture,
    })

    ctx.response.status = 200;
    ctx.json(user)
})

//登陆
router.post('/login',async(ctx)=>{
    let {reg_phone,password} = ctx.request.body
    const user = await UserDao.verify({
        reg_phone:reg_phone, 
        password:password
    })
    if(user.id){
        const token = generateToken(user.id, AuthToken.Admin)
        ctx.response.status = 200;
        ctx.json({
            msg: '登陆成功',
            token:token
        })
    }else {
        ctx.error(user.err_msg)
    }

})

// 获取用户信息
router.get('/:id',new AuthToken(Auth_User).m, async(ctx)=>{
    // 获取用户id
    const id = ctx.params.id

    let userInfo = await UserDao.detail(id)

    ctx.response.status =200;
    ctx.json(userInfo)
    // ctx.body = ctx.json('获取用户信息成功',userInfo)
})

module.exports = router