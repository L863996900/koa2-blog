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
        secretKey: 'devon blog',
        expiresIn: 60 * 60 *10 
    },
    port: 3005,
    redisConfig: {
        port:6379,
        host: '127.0.0.1'
    }
 }
 module.exports = config