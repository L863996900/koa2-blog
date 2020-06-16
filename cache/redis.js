const redis = require('redis')
const {
    redisConfig
} =require('../config/config')

// 创建客户端
const redisClient = redis.createClient(
    redisConfig.port,
    redisConfig.host
)

redisClient.on('error',err => {
    console.log('redis err')
    throw new Error(err)
})

// 配置redis
// key 键
// val 值
// timeout 过期时间，单位s

function setRedis(key, val, timeout = 60 * 60){
    if(typeof val ==='object'){
        val = JSON.stringify(val)
        redisClient.set(key,val)
        redisClient.expire(key, timeout)
    }
}

// 获取redis 
// key 键
function getRedis(key){
    return new Promise((resolve,reject)=>{
        redisClient.get(key,(err,val)=>{
            if(err){
                reject(err)
                return
            }
            if(val === null) {
                resolve(null)
                return
            }
            try{
                resolve (
                    JSON.parse(val)
                )  
            } catch{
                resolve(val)
            }
        })
    })
}

module.exports = {
    setRedis,
    getRedis
}