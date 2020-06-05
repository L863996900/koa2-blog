module.exports = async (ctx, next) => {
    ctx.success = (msg) => {
        ctx.body = {
            code: 200,
            msg
        }
    }
    ctx.json = (data, msg, code) => {
        ctx.body = {
            code: code || 200,
            msg,
            data
        }
    }
    ctx.error = (msg, code, data) => {
        ctx.body = {
            code: code || 500,
            msg,
            data
        }
    }
    await next()
}