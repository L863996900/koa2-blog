const {
    Rule,
    LinValidator
  } = require('../middlewares/lin-validator-v2')
  
  class LeaveValidator extends LinValidator {
    constructor() {
      super()
      this.leav_name = [
        new Rule("isLength", "留言人名字 reply_name 不能为空", {min: 1})
      ]
      this.content = [
        new Rule("isLength", "评论内容 content 不能为空", {min: 1})
      ]
    }
  }
  
  module.exports = {
    LeaveValidator
  }
  