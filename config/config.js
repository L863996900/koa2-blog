const config = {
    environment: 'development',
    database: {
        dbname: 'blog',
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '123456'
    },
    security: {
        secretKey: 'yongx blog',
        expiresIn: 60 * 60 *10 
    },
    port: 3000,
    redisConfig: {
        port:6379,
        host: '127.0.0.1'
    }
 }
 module.exports = config