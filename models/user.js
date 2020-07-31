const moment = require('moment')
const bcrypt = require('bcryptjs')
const {sequelize}  = require('../core/db')
const {Sequelize, Model} = require('Sequelize');

class User extends Model {

}

User.init({
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    reg_count:{
        type: Sequelize.STRING(64),
        allowNull: false,
        comment: '用户手机号（登陆账号）'
    },
    username:{
        type: Sequelize.STRING(64),
        allowNull: false,
        comment: '用户名称'
    },
    password:{
        type: Sequelize.STRING,
        set(val){
            const salt = bcrypt.genSaltSync(10);
            const pwd = bcrypt.hashSync(val, salt)
            this.setDataValue("password",pwd)
        },
        allowNull:false,
        comment: "用户密码"
    },
    email: {
        type: Sequelize.STRING(64),
        allowNull: true,
        comment: '用户邮箱'
    },
    user_picture:{
        type: Sequelize.TEXT,
        allowNull:false,
        comment: "用户头像"
    },
    created_at:{
        type: Sequelize.DATE,
        allowNull: false,
        get(){
            return moment(this.getDataValue('created_at')).format('YYYY-MM-DD')
        }
    },
    level: {
        type: Sequelize.ENUM('0', '1'),
        allowNull: false,
        comment: '用户等级'
    },
}, {
    sequelize,
    modelName: 'user',
    tableName: 'user'
})

module.exports = {User}