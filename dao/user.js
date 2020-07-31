// 数据访问对象
const { User } = require('../models/user')
const bcrypt = require('bcryptjs')

class UserDao {
    // 创建用户
    static async create(params) {
        const {
            reg_count,
            username,
            password,
            email,
            user_picture
        } = params

        const hasUser = await User.findOne({
            where: {
                reg_count,
                deleted_at: null
            }
        })
        if (hasUser) {
            return {
                err_msg: '用户已存在'
            }
        }
        const user = new User();
        user.reg_count = reg_count
        user.username = username
        user.password = password
        user.email = email
        user.user_picture = user_picture
        user.level = 1
        user.save();

        return {
            msg: '注册成功',
            reg_count: reg_count,
            username: username
        }
    }
    // 验证密码
    static async verify(params) {
        const {
            reg_count,
            password,
        } = params
        // 查询用户是否存在
        const hasUser = await User.findOne({
            where: {
                reg_count: reg_count
            }
        })
        if (!hasUser) {
            return {
                err_msg: '账号不存在或密码不正确'
            }
        }
        // 验证密码是否正确
        const correct = bcrypt.compareSync(password, hasUser.password)

        if (!correct) {
            return {
                err_msg: '密码不正确'
            }
        }
        return hasUser
    }
    //查询用户信息
    static async detail(id) {
        const scope = 'bh'
        const userInfo = await User.scope(scope).findOne({
            where: {
                id
            }
        })
        if (!userInfo) {
            return
        }
        return userInfo
    }
    // 更新用户信息
    // 更新文章
    static async update(id, params) {
        const {
            reg_count,
            username,
            email,
            level,
            user_picture
        } = params

        const user = await User.findByPk(id);
        if (!user) {
            return {
                code: 500,
                msg: '没有找到相关用户'
            }
        }

        user.reg_count = reg_count
        user.username = username
        user.email = email
        user.user_picture = user_picture
        user.level = level
        user.save();

        return {
            msg: '更新用户信息成功',
            reg_count: reg_count,
            username: username
        }
    }
    // 查询用户列表
    static async list(params) {
        const { reg_count, page = 1, pageSize = 10 } = params;

        // 筛选方式
        let filter = {
            deleted_at: null
        };
        if (reg_count) {
            filter.reg_count = reg_count;
        }
        const userList = await User.findAndCountAll({
            limit: pageSize, //每页10条
            offset: (page - 1) * pageSize,
            where: filter,
            order: [
                ['created_at']
            ]
        });

        return {
            list: userList.rows,
            // 分页
            meta: {
                current_page: parseInt(page),
                per_page: 10,
                count: userList.count,
                total: userList.count,
                total_pages: Math.ceil(userList.count / 10),
            }
        };
    }
}

module.exports = {
    UserDao
}