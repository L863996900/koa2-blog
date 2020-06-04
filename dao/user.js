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
            msg: '账号注册成功'
         }
    }
    // 验证密码
    static async verify(regPhone,password){
        // 查询用户是否存在
        const hasUser =await User.findOne({
            where:{
                reg_phone:regPhone
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
}

module.exports = {
    UserDao
}