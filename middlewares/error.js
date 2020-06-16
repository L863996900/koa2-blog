const {HttpException} = require('./http-exception')

const catchError = async (ctx, next) => {
  try {
    await next()

  } catch (error) {
    // 开发环境
    const isHttpException = error instanceof HttpException;
    const isDev = global.config.environment === 'dev';

    if (isDev && !isHttpException) {
      throw error
    }

    // 生成环境
    if (isHttpException) {
      ctx.body = {
        error_code: error.errorCode,
        msg: error.msg,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.response.status = error.code

    } else {
      ctx.body = {
        error_code: 9999,
        msg: `${error}`,
        request: `${ctx.method} ${ctx.path}`
      }
      ctx.response.status = 500
    }
  }
}

module.exports = catchError
