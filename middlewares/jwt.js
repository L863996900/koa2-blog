// token 令牌
const jwt = require('jsonwebtoken')
const basicAuth =require('basic-auth')

//颁布令牌
const generateToken = function (uid, scope) {
    const secretKey = global.config.security.secretKey;
    const expiresIn = global.config.security.expiresIn;
    const token = jwt.sign({
        uid, //签名
        scope
    }), secretKey, //加密私钥
        {
            expiresIn: expiresIn
        } //过期时间
    return token
}

//token 检测
//token 传递令牌
//HTTP 规定身份验证机制  使用HttpBasicAuth中间件
class AuthToken {
    constructor(level){
        this.level =level || 1;

        AuthToken.User = 8;
        AuthToken.Admin = 16;
        AuthToken.Spuser_Admin = 32;
    }
    get m() {
        return async (ctx,next) =>{
            const Token = basicAuth(ctx.req);
            let errMsg = "无效的token";
            // 无带token
            if(!Token || !Token.name){
                errMsg = "需要携带token值"
                throw new Error(errMsg)
            }
            try{
                var decode = jwt.verify(Token.name,global.config.security.secretKey)
            } catch(err) {
                if(err.name === "TokenExpireError"){
                    errMsg ="Token已过期"
                }
                throw new Error(errMsg)
            }
            if(decode.scope <this.level){
                errMsg="权限不足"
                throw new Error(errMsg)
            }
            ctx.auth = {
                uid:decode.uid,
                scope:decode.scope
            }
            await next()
        }
    }
}

module.exports = {
    generateToken,
    AuthToken
}