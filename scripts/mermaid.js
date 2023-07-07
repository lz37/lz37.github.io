const reg = /```mermaid([\s\S]+?)```/g
hexo.extend.filter.register(
  'before_post_render',
  (data) => {
    /**@type {boolean} */
    const useMermaid = data.mermaid
    if (useMermaid) {
      // 替换
      data.content = data.content.replace(reg, (_, codeBlockContent) => {
        return `{% mermaid %}
      ${codeBlockContent}
      {% endmermaid %}`
      })
      hexo.log.info(`Generated: mermaid of ${data.title}`)
    }
  },
  0,
)
