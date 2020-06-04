const Sequelize = require('sequelize')

const {
    dbname,
    host,
    port,
    user,
    password
} = require('../config/config').database

const sequelize = new Sequelize(dbname,user,password, {
    dialect: 'mysql',
    host,
    port,
    logging: false, // true代表开启数据库操作日志 false 代表关闭数据库操作日志
    timezone: '+08:00',
    define: {
        // 时间日期格式
        timestamps: true,
        // false返回非null delete列
        paranoid: true,
        // create_time && update_time && delete_time
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        // 驼峰命名转下划线
        underscored: true,
        scopes: {
            bh: {
                attributes: {
                    exclude: ['password', 'created_at','updated_at','deleted_at']
                }
            },
            iv: {
                attributes: {
                    exclude: ['content', 'created_at','updated_at','deleted_at']
                }
            }
        }
        
    }
})
// 创建模型 
sequelize.sync({
    force: false //true创建表并将原表删除  false创建表并不删除原表

})

module.exports = {
    sequelize
}