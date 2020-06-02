const config = {
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
    port: 3000
 }
 module.exports = config