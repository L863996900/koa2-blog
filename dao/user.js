// 数据访问对象
const { User } = require('../models/user')
const bcrypt = require('bcryptjs')

class UserDao {
    // 创建用户
    static async create(params) {
        const { 
            reg_phone,
            username,
            password,
            email,
            user_picture
        } = params

        const hasUser = await User.findOne({
            where: {
                reg_phone,
                deleted_at: null
            }
        })
        if(hasUser){
            return {
                msg:'用户已存在'
            }
        }
        const user = new User();
        user.reg_phone = reg_phone
        user.username = username
        user.password = password
        user.email = email
        user.user_picture = user_picture 
        user.level = '1'
        user.save();

        return {
            reg_phone:reg_phone,
            username:username
         }
    }
    // 验证密码
    static async verify(reg_phone,password){
        // 查询用户是否存在
        const hasUser =await User.findOne({
            where:{
                reg_phone:reg_phone
            }
        })
        if(!hasUser){
            return {
                msg: '账号不存在或密码不正确'
            }
        }
        // 验证密码是否正确
        const correct = bcrypt.compareSync(password, hasUser.password)

        if(!correct){
            return {
                msg: '密码不正确'
            }
        }
        return hasUser
    }
    //查询用户信息
    static async detail(id){
        const userInfo = await User.findOne({
            where:{
                id
            }
        })
        if(!userInfo){
            ctx.error('账号不存在或密码不正确')
        }
        return userInfo
    }
}

module.exports = {
    UserDao
}