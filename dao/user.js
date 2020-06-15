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
                err_msg:'用户已存在'
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
            msg:'注册成功',
            reg_phone:reg_phone,
            username:username
         }
    }
    // 验证密码
    static async verify(params){
        const { 
            reg_phone,
            password,
        } = params
        // 查询用户是否存在
        const hasUser =await User.findOne({
            where:{
                reg_phone:reg_phone
            }
        })
        if(!hasUser){
            return {
                err_msg: '账号不存在或密码不正确'
            }
        }
        // 验证密码是否正确
        const correct = bcrypt.compareSync(password, hasUser.password)

        if(!correct){
            return {
                err_msg: '密码不正确'
            }
        }
        return hasUser
    }
    //查询用户信息
    static async detail(id){
        const scope = 'bh'
        const userInfo = await User.scope(scope).findOne({
            where:{
                id
            }
        })
        if(!userInfo){
           return
        }
        return userInfo
    }
}

module.exports = {
    UserDao
}