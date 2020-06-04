const UserDao = require('../dao/user')
const {
    generateToken,
    AuthToken
} = require('../middlewares/jwt')

class Login {
    // 管理员登陆
    static async adminLogin(params){
        const {reg_phone,password} = params
    }
}