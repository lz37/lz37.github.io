---
title: Hexo 压缩页面与其他文件
categories: tech
tags:
  - Blog
  - Hexo
  - XML
description: hexo 压缩 html、css、js 与 xml
comments:
toc:
toc_number:
toc_style_simple:
copyright:
copyright_author:
copyright_author_href:
copyright_url:
copyright_info:
katex:
highlight_shrink:
aside:
---

压缩前端三件套使用的是网上抄来的方案：[hexo 压缩页面和静态资源文件](https://blog.jijian.link/2020-03-05/hexo-compress/)

其他的还有等 hexo 打包完再用 gulp 打包的方案，在公司搞 gulp 的老项目已经 ptsd 了，不想再碰。

## 压缩前端三件套

安装插件

```bash
pnpm i hexo-clean-css hexo-html-minifier hexo-uglify
```

新增配置 `_config.yml`

```yaml
uglify:
  mangle: true
  # 这儿不能为空，为空会导致 js 文件压缩
  # output:
  # compress:
  exclude:
    - '*.min.js'
  es6: false

clean_css:
  exclude:
    - '*.min.css'

html_minifier:
  collapseBooleanAttributes: true
  collapseWhitespace: true
  # Ignore '<!-- more -->' https://hexo.io/docs/tag-plugins#Post-Excerpt
  ignoreCustomComments: [!!js/regexp /^\s*more/]
  removeComments: true
  removeEmptyAttributes: true
  removeScriptTypeAttributes: true
  removeStyleLinkTypeAttributes: true
  minifyJS: true
  minifyCSS: true
```

## 压缩 XML

像一些 sitemap 的 xml 自然也是要压缩最好，hexo 网站没搜到对象的插件，可以试下我写的脚本。

安装

```bash
pnpm i minify-xml -D
```

在`scripts`目录下新增文件`minify-xml.js`：

```javascript
const fs = require('hexo-fs') // fs也可以
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
```

想全部压缩的话把`expectXMLs`改掉就好了，`minify-xml`有些问题，压缩`hexo-generator-search`生成的`search.xml`时候容易卡死，这点要注意。
