const {
  Rule,
  LinValidator
} = require('../middlewares/lin-validator-v2')


class ArticleValidator extends LinValidator {
  constructor() {
    super();
    
    this.title = [new Rule("isLength", "文章标题 title 不能为空", {min: 1})];
    this.author = [new Rule("isLength", "文章作者 author 不能为空", {min: 1})];
    this.keyword = [new Rule("isLength", "文章关键字 keyword 不能为空", {min: 1})];
    this.description = [new Rule("isLength", "文章简介 description 不能为空", {min: 1})];
    this.browse = [new Rule("isLength", "文章封面 cover 不能为空", {min: 1})];
    this.content = [new Rule("isLength", "文章内容 content 不能为空", {min: 1})];
    this.category = [new Rule("isLength", "文章分类 category 不能为空", {min: 1})];
  }
}


class PositiveIdParamsValidator extends LinValidator {
  constructor() {
    super();
    this.id = [
      new Rule('isInt', '文章ID需要正整数', {min: 1})
    ]
  }
}

class ArticleSearchValidator extends LinValidator {
  constructor() {
    super();
    this.keyword = [
      new Rule('isLength', '必须传入搜索关键字', {min: 1})
    ]
  }
}

module.exports = {
  ArticleValidator,
  PositiveIdParamsValidator,
  ArticleSearchValidator
}
