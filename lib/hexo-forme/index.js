/** @type {import("hexo")} */
hexo.extend.filter.register(
  'before_post_render',
  (data) => {
    /**@type {Array<{[key: string]:string}>} */
    const categoryPerImg = hexo.theme.config.category_per_img
    if (data.layout === 'post') {
      data.cover = categoryPerImg[data.categories.data[0].name]
      data.top_img = categoryPerImg[data.categories.data[0].name]
    }
    const reg = /```mermaid([\s\S]+?)```/g
    // 替换
    data.content = data.content.replace(reg, (_, codeBlockContent) => {
      return `{% mermaid %}
      ${codeBlockContent}
      {% endmermaid %}`
    })
  },
  0,
)
