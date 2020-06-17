const moment = require('moment');

const {Sequelize, Model} = require('sequelize')
const {sequelize} = require('../core/db')

class Leave extends Model {

}

Leave.init({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  leav_name: {
    type: Sequelize.STRING(64),
    allowNull: false,
    comment: '留言人的名字'
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    comment: '留言内容'
  },
  // 创建时间
  created_at: {
    type: Sequelize.DATE,
    get() {
      return moment(this.getDataValue('created_at')).format('YYYY-MM-DD');
    }
  }
}, {
  sequelize,
  tableName: 'leave',
  modelName: 'leave'
})

module.exports = {
    Leave
}
