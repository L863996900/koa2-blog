const UserDao = require('../dao/user')
const {
    generateToken,
    AuthToken
} = require('../middlewares/jwt')

class LoginIn {
    // 用户/管理员登录
    static async adminLogin(params) {
        const { reg_phone, password } = params
        // 验证账号密码是否正确
        const user = await UserDao.verify(reg_phone, password)
        return generateToken(user.id, AuthToken.Admin)
    }
}

module.exports = {
    LoginIn
}
