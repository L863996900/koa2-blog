// const router = require('koa-router')({
//     prefix: '/api/v2/user'
// })

// const { UserDao } = require('../../dao/user')
// const { AuthToken } = require('../../middlewares/jwt')

// const { Login } = require('../../service/login')

// const Auth_User = 16;

// //注册
// router.post('/register',async (ctx) =>{
//     let {reg_phone,username,password,email,user_picture} = ctx.request.body
//     const user = await UserDao.create({
//         reg_phone:reg_phone,
//         username:username,
//         password:password,
//         email:email,
//         user_picture:user_picture,
//     })

//     ctx.response.status = 200;
//     ctx.body = ctx.json('注册成功',user)
// })

// //登陆
// router.post('/login',async(ctx)=>{
//     let {reg_phone,password} = ctx.request.body
//     const token = await Login.LoginIn({
//         reg_phone:reg_phone,
//         password:password
//     })
//     ctx.response.status = 200;
//     ctx.body = ctx.json('登陆成功',token)
// })

// // 获取用户信息
// router.get('/:id',new AuthToken(Auth_User).m, async(ctx)=>{
//     // 获取用户id
//     const id = ctx.params.id

//     let userInfo = await UserDao.detail(id)

//     ctx.response.status =200;
//     ctx.body = ctx.json('获取用户信息成功',userInfo)
// })

// module.exports = router