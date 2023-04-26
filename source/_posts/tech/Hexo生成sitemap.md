---
title: Hexo 生成 sitemap
categories: tech
tags:
  - Blog
  - Hexo
  - Sitemap
  - Github Action
description: hexo 生成 google sitemap 和 baidu sitemap
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

参考：[Hexo 生成 sitemap](https://xqhppt.github.io/2020/01/31/hexo-seo-sitemap/)

安装插件：

```bash
pnpm install hexo-generator-sitemap
pnpm install hexo-generator-baidu-sitemap
```

编辑 `_config.yml` 添加配置：

```yaml
sitemap:
  path: sitemap.xml
baidusitemap:
  path: baidusitemap.xml
```

`source` 目录下添加 `robots.txt`

```txt
User-agent: *
Disallow:
Sitemap: https://xqhppt.github.io/sitemap.xml
Sitemap: https://xqhppt.github.io/baidusitemap.xml
```

这样一来，在 `hexo g` 的时候就会自动生成 `sitemap` 文件，但是要注意，baidusitemap 插件比较古老，不会生成分类和 tag 页面的地图，介意的话可以使用 sitemap 模板功能定制一个。

[hexo-generator-sitemap 项目地址](https://github.com/hexojs/hexo-generator-sitemap)
