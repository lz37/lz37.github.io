const fs = require('hexo-fs')
const path = require('path')
const { minify } = require('minify-xml')
hexo.extend.filter.register(
  'before_exit',
  async () => {
    if (!isGen) return
    const publicPath = hexo.public_dir
    const expectXMLs = ['baidusitemap', 'browserconfig', 'sitemap']
      .map((file) => `${file}.xml`)
      .map((file) => path.join(publicPath, file))
    for (const file of expectXMLs) {
      hexo.log.info(`Minified ${file}`)
      const xml = fs.readFileSync(file)
      const minifiedXml = minify(xml)
      fs.writeFileSync(file, minifiedXml)
    }
  },
  Number.MAX_SAFE_INTEGER,
)

let isGen = false

hexo.extend.filter.register('after_generate', () => {
  isGen = true
})
