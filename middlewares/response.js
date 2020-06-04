const Response = async (ctx,next) => {
    ctx.success =(msg) =>{
        ctx.body={
            code:200,
            msg
        }
    }
    ctx.json = (msg,data,code) =>{
        ctx.body={
            code:code || 200,
            msg,
            data
        }
    }
    ctx.error= (msg,data,code) => { 
        ctx.body={
            code: code || 500,
            msg,
            data
        }
    } 
    await next()
}
module.exports = Response