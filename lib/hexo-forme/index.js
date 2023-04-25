const path = require('path')
const moment = require('moment-timezone')
const { execSync } = require('child_process')

const getFilePath = (data) => path.resolve(hexo.config.source_dir, data.source)

const getDate = (data) => {
  const filePath = getFilePath(data)
  const date = execSync(`git log --follow --format="%ad" -- ${filePath} | tail -1`).toString().trim()
  if (date === '') return moment()
  return moment(new Date(date))
}

const getUpdated = (data) => {
  const filePath = getFilePath(data)
  const updated = execSync(`git log --follow -1 --format="%ad" -- ${filePath}`).toString().trim()
  if (updated === '') return moment()
  return moment(new Date(updated))
}

/** @type {import("hexo")} */
hexo.extend.filter.register(
  'before_post_render',
  (data) => {
    data.date = getDate(data)
    data.updated = getUpdated(data)
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
