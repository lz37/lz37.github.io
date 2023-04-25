---
title: Hello World
categories: 其他
tags:
  - Blog
  - Hexo
keywords:
description: 经典 Hello World
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
sticky:
---

之前的博客源代码丢失了，无奈之下只能重新开始了。

~~我这该死的粗心大意哦~~

不过借着这次机会，重新部署了一遍，把之前踩坑的又全踩了，再次总结了不少经验。

## hexo 博客的搭建

没什么好说的，但还是在写一遍吧。

[hexo 官网链接](https://hexo.io/zh-cn/)

首先得安装 nodejs、git 等工具，这里不细说了，但是提一嘴 windows 上强烈推荐使用**scoop**包管理器进行安装！

安装 npm 之后，执行以下命令

```bash
npm install hexo-cli -g # 全局安装hexo脚手架
hexo init blog # 生成博客文件夹，blog可以换成任何一个你喜欢的名字，以后也可以换
cd blog # 进入blog文件夹，blog要与上方文件夹名一致
npm install # 安装hexo依赖
hexo server # 生成静态网页预览，当然如果你有服务器和域名的话，指定--port 为80或443便可以直接用http或https访问，但一般不会这样做
```

这样，一个简单的博客便生成了

接下来是几个简单的命令需要记住

```bash
hexo clean # 清除本地静态文件
hexo generate # 生成静态文件
hexo deploy # 将静态文件上传到服务器
hexo server # 开启服务器，你可以使用这个命令在本地预览博客，很少有人真的用这个命令在服务器上跑
```

以上命令可以简化成

```bash
hexo cl
hexo g
hexo d
hexo s
```

记不下来也没关系，如果使用 vscode 的话，在插件商店有一个叫做 npm 的插件，点点就行了

但请注意顺序，先清除缓存（cl），再生成静态文件（g），然后（可选）本地预览（s），再上传（d），命令行同理嗷

博客的简单搭建就说到这里，毕竟这只是一篇 Hello World，又不是专门的教程文章。

<(￣︶￣)>叉会腰

## 本博客的规划

主要还是以技术性文章为主，除非等我以后考虑转行了（但愿没这一天）

之前写博客的时候，很多小事情都不会专门去记录，比如：

- vscode 使用的插件啊
- utools 使用的一些工具啊
- markdown 细枝末节的小语法啊
- 冷门工具的使用啊
- 包括但不限于以上内容

utools 啥的倒也还好，充个 vip 有备份功能，而且全平台做的适配也很棒（然而我并不冲 vip，所以就没有备份功能）

vscode 一些插件在 windows 上的配置和在 linux 上的配置可完全不同，尤其是涉及到路径的时候，这时候使用设置同步可不是一个明智的事情。

所以也得适度地记录一些这些东西，不要每次都去百度。

等什么时候闲下来了也还会搞搞小说之类的，毕竟写代码是生活，写小说才是爱好！虽然搞到现在也不过是个扑街太监罢了。(；′⌒`)

丧气的话不多说，不管怎样，莽就完事了，冲冲冲！
