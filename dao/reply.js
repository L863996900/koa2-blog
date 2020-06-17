const xss = require('xss')
const { Reply } = require('../models/reply')
const { Comment } = require('../models/comment')

class ReplyDao {
    // 创建回复
    static async create(v) {
        // 查询评论
        const comment = await Comment.findByPk(v.get('body.comment_id'));
        if (!comment) {
            return {
                msg: '没有找到相关评论'
            }
        }

        const reply = new Reply();
        reply.reply_name = xss(v.get('body.reply_name'));
        reply.reply_phone = xss(v.get('body.reply_phone'));
        reply.reply_avatar = xss(v.get('body.reply_avatar'));
        reply.content = xss(v.get('body.content'));
        reply.comment_id = xss(v.get('body.comment_id'));

        reply.save();
        return {
            msg: '回复成功'
        }
    }

    // 删除回复
    static async destroy(id) {
        const reply = await Reply.findOne({
            where: {
                id,
                deleted_at: null
            }
        });
        if (!reply) {
            return {
                msg: '没有找到相关评论'
            }
        }
        reply.destroy()
        return {
            msg: '删除成功！'
        }
    }

    // 获取回复详情
    static async detail(id) {
        const reply = await Reply.scope('iv').findOne({
            where: {
                id,
                deleted_at: null
            }
        });
        if (!reply) {
            return {
                msg: '没有找到相关评论'
            }
        }

        return reply
    }

    // 更新回复
    static async update(id, v) {
        const reply = await Reply.findByPk(id);
        if (!reply) {
            throw new global.errs.NotFound('没有找到相关评论信息');
        }
        reply.reply_name = xss(v.get('body.reply_name'));
        reply.reply_phone = xss(v.get('body.reply_phone'));
        reply.reply_avatar = xss(v.get('body.reply_avatar'));
        reply.content = xss(v.get('body.content'));
        reply.comment_id = xss(v.get('body.comment_id'));


        reply.save();
        return {
            msg: '更新回复成功'
        }
    }


    // 回复列表
    static async list(comment_id) {
        return await Reply.findAll({
            where: {
                comment_id,
                deleted_at: null
            },
            order: [
                ['created_at', 'DESC']
            ]
        });
    }
}

module.exports = {
    ReplyDao
}
