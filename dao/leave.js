const xss = require('xss')
const { Leave } = require('../models/leave')

class LeaveDao {
    // 创建留言
    static async create(v) {
        // 查询评论

        const leave = new Leave();
        leave.leav_name = xss(v.get('body.leav_name'));
        leave.content = xss(v.get('body.content'));

        leave.save();
        return {
            msg: '留言成功'
        }
    }

    // 删除留言
    static async destroy(id) {
        const leave = await Leave.findOne({
            where: {
                id,
                deleted_at: null
            }
        });
        if (!leave) {
            return {
                msg: '没有找到留言'
            }
        }
        leave.destroy()
        return {
            msg: '留言删除成功！'
        }
    }

    // 更新留言
    static async update(id, v) {
        const leave = await Leave.findByPk(id);
        if (!leave) {
            throw new global.errs.NotFound('没有找到相关留言信息');
        }
        leave.reply_name = xss(v.get('body.reply_name'));
        leave.content = xss(v.get('body.content'));

        leave.save();
        return {
            msg: '更新留言成功'
        }
    }


    // 留言列表
    static async list(id) {
        return await Leave.findAll({
            where: {
                id,
                deleted_at: null
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }
}

module.exports = {
    LeaveDao
}
