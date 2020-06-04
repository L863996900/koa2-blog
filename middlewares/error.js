const catchError = async (ctx, next) => {
    try {
        await next()

    } catch (error) {
        // 开发环境
        const isDev = global.config.environment === 'dev';
        const isPro = global.config.environment === 'production';
      // 生产环境
        if (isPro) {
            throw error
        } else {
            if (isDev) {
                ctx.body = {
                    msg: error.msg,
                    error_code: error.errorCode,
                    request: `${ctx.method} ${ctx.path}`
                }
                ctx.response.status = error.code
            } else {
                ctx.body = {
                    msg: "未知错误！",
                    error_code: 500,
                    request: `${ctx.method} ${ctx.path}`
                }
                ctx.response.status = 500
            }


        }
    }
}

module.exports = catchError