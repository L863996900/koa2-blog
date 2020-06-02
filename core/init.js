// 路由自动挂载
const Router = require('koa-router')
const requireDiectory = require('require-directory')

class InitManager {
    static initCore(app){
        // 入口方法
        InitManager.app = app;
        InitManager.initLoadRouters()
        InitManager.loadHttpException()
        InitManager.loadConfig()
    }
    // 加载全部路由
    static initLoadRouters() {
        //绝对路径 process.cwd()
        const apiDirectory = `${process.cwd()}/routes`
        // 路由自动挂载
        requireDiectory(module, apiDirectory,{
            visit: whenLoadMoudule
        })
        // 判断 requireDiectory 挂载的模块是否为路由
        function whenLoadMoudule(obj) {
            if(obj instanceof Router){
                InitManager.app.use(obj.routes())
            }
        }
    }
    // 注册全局配置属性方法
    static loadConfig(path = ''){
        const configPath = path || process.cwd() + '/config/config.js'
        const config = require(configPath)
        global.config = config
    }
    // 注册全局请求错误处理  暂未开发
    // static loadHttpException() {
    //     const errors =require('./http-exception')
    //     global.errs = errors
    // }
}

module.exports = InitManager