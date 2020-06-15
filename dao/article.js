const xss = require('xss')
const { Op } = require('sequelize')

const { Article } = require('../models/article')

// 定义文章模型
class ArticleDao {

  // 创建文章
  static async create(params) {
    const {
      title,
      author,
      keyword,
      description,
      content,
      browse,
      category
    } = params
    // 检测是否存在文章
    const hasArticle = await Article.findOne({
      where: {
        title: title,
        deleted_at: null
      }
    });
    // 如果存在，抛出存在信息
    if (hasArticle) {
      return {
        code: 500,
        msg: '文章已存在'
      }
    }

    // 创建文章

    const article = new Article();

    article.title = title;
    article.author = author;
    article.keyword = keyword;
    article.description = description;
    article.content = xss(content);
    article.browse = browse;
    article.category = category;

    article.save();
    return {
      code: 200,
      msg: "文章发布成功"
    }
  }
  // 获取文章列表
  static async list(params) {
    const { category, keyword, page = 1 } = params;
    const pageSize = 10

    // 筛选方式
    let filter = {
      deleted_at: null
    };

    // 筛选方式：存在分类
    if (category) {
      filter.category = category;
    }

    // 筛选方式：存在搜索关键字
    if (keyword) {
      filter.keyword = {
        [Op.like]: `%${xss(keyword)}%`
      };
    }
    const article = await Article.findAndCountAll({
      limit: pageSize, //每页10条
      offset: (page - 1) * pageSize,
      where: filter,
      order: [
        ['created_at', 'DESC']
      ]
      //   // 查询每篇文章下关联的分类
      //   include: [{
      //     model: Category,
      //     as: 'category',
      //     attributes: {
      //       exclude: ['deleted_at', 'updated_at']
      //     }
      //   }]
    });

    return {
      data: article.rows,
      // 分页
      meta: {
        current_page: parseInt(page),
        per_page: 10,
        count: article.count,
        total: article.count,
        total_pages: Math.ceil(article.count / 10),
      }
    };
  }

  // 删除文章
  static async destroy(id) {
    // 检测是否存在文章
    const article = await Article.findOne({
      where: {
        id,
        deleted_at: null
      }
    });
    // 不存在抛出错误
    if (!article) {
      return {
        code: 500,
        msg: '没有找到相关文章'
      }
    }

    // 软删除文章
    article.destroy()
    return {
      code: 200,
      msg: '文章删除成功'
    }
  }

  // 更新文章
  static async update(id, params) {
    // 查询文章
    const article = await Article.findByPk(id);
    if (!article) {
      return {
        code: 500,
        msg: '没有找到相关文章'
      }
    }
    const {
      title,
      author,
      keyword,
      description,
      content,
      browse,
      category
    } = params

    // 更新文章
    article.title = title;
    article.author = author;
    article.keyword = keyword;
    article.description = description;
    article.content = xss(content);
    article.browse = browse;
    article.category = category;

    article.save();
    return {
      code: 200,
      msg: '文章更新成功'
    }
  }

  // 更新文章浏览次数
  static async updateBrowse(id, browse) {
    // 查询文章
    const article = await Article.findByPk(id);
    if (!article) {
      return {
        code: 500,
        msg: '没有找到相关文章'
      }
    }
    // 更新文章浏览
    article.browse = browse;
    article.save();
    return {
      code: 200,
      msg: '浏览次数更新'
    }
  }

  // 文章详情
  static async detail(id) {
    const article = await Article.findOne({
      where: {
        id
      }
      // // 查询每篇文章下关联的分类
      // include: [{
      //   model: Category,
      //   as: 'category',
      //   attributes: {
      //     exclude: ['deleted_at', 'updated_at']
      //   }
      // }]
    });

    if (!article) {
      return {
        code: 500,
        msg: '没有找到相关文章'
      }
    }

    return article;
  }

}

module.exports = {
  ArticleDao
}
