const {
  Rule,
  LinValidator
} = require('../middlewares/lin-validator-v2')

class ReplyValidator extends LinValidator {
  constructor() {
    super()

    this.reply_name = [
      new Rule("isLength", "评论人名字 reply_name 不能为空", {min: 1})
    ]
    this.reply_phone = [
      new Rule(
        'matches',
        '手机号 reply_phone 不符合规范 请输入正确的手机号',
        '^[1]([3-9])[0-9]{9}$'
      )
    ]
    this.reply_avatar = [
      new Rule('isLength', '头像 reply_avatar 不符合规范', {min: 1})
    ]
    this.content = [
      new Rule("isLength", "评论内容 content 不能为空", {min: 1})
    ]
    this.comment_id = [
      new Rule("isLength", "评论内容 content 不能为空", {min: 1})
    ]
  }
}

class PositiveArticleIdParamsValidator extends LinValidator {
  constructor() {
    super();
    this.id = [
      new Rule('isInt', '评论ID需要正整数', {min: 1})
    ]
  }
}

module.exports = {
  ReplyValidator,
  PositiveArticleIdParamsValidator
}
