const {
  Rule,
  LinValidator
} = require('../middlewares/lin-validator-v2')

class CommentValidator extends LinValidator {
  constructor() {
    super()

    this.com_name = [
      new Rule("isLength", "评论人名字 com_name 不能为空", { min: 1 })
    ]
    this.com_avatar = [
      new Rule("isLength", "评论人头像 com_avatar 不能为空", { min: 1 })
    ]
    this.com_phone = [
      new Rule(
        'matches',
        '手机号 com_phone 请输入正确的手机号',
        '^[1]([3-9])[0-9]{9}$'
      )
    ]
    this.content = [
      new Rule("isLength", "评论内容 content 不能为空", { min: 1 })
    ]
    this.com_id = [
      new Rule("isLength", "目标 com_id 不能为空", { min: 1 })
    ]
    this.com_type = [
      new Rule("isLength", "目标 com_type 不能为空", { min: 1 })
    ]
  }
}

class PositiveArticleIdParamsValidator extends LinValidator {
  constructor() {
    super();
    this.id = [
      new Rule('isInt', '评论ID需要正整数', { min: 1 })
    ]
  }
}

module.exports = {
  CommentValidator,
  PositiveArticleIdParamsValidator
}
