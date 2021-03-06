const moment = require('moment');

const {Sequelize, Model} = require('sequelize')
const {sequelize} = require('../core/db')

class Comment extends Model {

}

Comment.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  com_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    comment: '评论目标id, 如普通文章，专栏的文章id'
  },
  com_avatar:{ 
    type: Sequelize.STRING,
    allowNull: false,
    comment: '评论人头像'
  },
  com_type: {
    type: Sequelize.STRING(32),
    allowNull: false,
    comment: '评论目标类型, 如article, column'
  },
  com_name: {
    type: Sequelize.STRING(64),
    allowNull: false,
    comment: '评论人的名字'
  },
  com_phone: {
    type: Sequelize.STRING(64),
    allowNull: false,
    comment: '评论人的注册手机号'
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    comment: '评论内容'
  },
  created_at: {
    type: Sequelize.DATE,
    allowNull: false,
    get() {
      return moment(this.getDataValue('created_at')).format('YYYY-MM-DD');
    }
  }
}, {
  sequelize,
  modelName: 'comment',
  tableName: 'comment'
})

module.exports = {
  Comment
}
