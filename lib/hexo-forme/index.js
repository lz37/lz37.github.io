/** @type {import("hexo")} */
hexo.extend.filter.register(
  'before_post_render',
  (data) => {
    /**@type {Array<{[key: string]:string}>} */
    const categoryPerImg = hexo.theme.config.category_per_img
    if (data.layout === 'post') {
      categoryPerImg.forEach((items) => {
        Object.entries(items).forEach((item) => {
          if (data.categories.data[0].name === item[0]) {
            data.cover = item[1]
            data.top_img = item[1]
          }
        })
      })
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
