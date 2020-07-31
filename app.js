const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const InitManager = require('./core/init')
const catchError = require('./middlewares/error')
const cors = require('koa2-cors');
onerror(app)
app.use(cors())


// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))
app.use(catchError)

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

app.use(require('./middlewares/response'))
InitManager.initCore(app)

// cors
// const isDev =process.env.NODE_ENV === 'development'
// app.use(cors({
//   origin: function (ctx) {
//     return isDev ? '*' : '*'
//   }
// }));

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
  ctx.render('error',{
    msg:'服务器错误!',
    error:err
  })
});


module.exports = app
