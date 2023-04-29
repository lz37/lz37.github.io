---
title: 使用 Gitalk 开通 Hexo 评论
categories: etc
tags:
  - Blog
  - Hexo
  - Gitalk
  - Github Action
description: 利用 Gitalk 让 Github 的 Issue 成为网站的评论系统后端，并使用 Github Action 与 Hexo Scripts 实现 id 与 secret 的隐藏。
comments:
toc:
toc_number:
toc_style_simple:
copyright:
copyright_author:
copyright_author_href:
copyright_url:
copyright_info:
katex: false
highlight_shrink:
aside:
sticky:
---

在第二版博客里本人使用过 `Valine` 作为后端组建过评论系统，可惜的是 `Valine` 作为后端并不是十分可靠的样子（2.0 博客销毁之前评论系统已经不可用了），当然这也和此类服务的提供商的商业属性有关。

面临这样的困境，自然而然，“利用 Github 的 Issue 作为评论系统后端” 这个想法就浮现在了脑海中，而 `Gitalk` 这个项目就是这样的一个实现，幸运的是 `Butterfly` 主题已经内置了 Gitalk 功能。

## 配置过程

参考 [Github+Hexo 个人博客搭建：butterfly 主题配置#评论功能](https://www.cnblogs.com/Likfees/p/16352004.html#评论功能)，以下是我的实践。

首先要申请一个 OAuth application，传送门在这里：[Register a new OAuth application](https://github.com/settings/applications/new)

懒得截图了，表格怎么填我口述一下：

1. `Application name`: OAuth 的名字，随意
2. `Homepage URL`: 应用网址，没啥好说的
3. `Application description`: 应用描述，随意
4. `Authorization callback URL`: 登陆 Github 会跳转到 Github 网页，这里填写的是在那个网页上完成登陆后的跳转地址，一般就写博客地址就好，和 `Homepage URL` 一样。
5. `Enable Device Flow`: 他的描述如下，我反正没勾选。
   > Allow this OAuth App to authorize users via the Device Flow.
   >
   > Read the [Device Flow documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#device-flow) for more information.

填好后会跳转到完成页面，点击 `Generate a new secret` 得到密钥，记下这个页面的 id 和密钥。

编辑主题配置文件，以下以`butterfly`主题为例：

```yaml
# Comments System
# --------------------------------------

comments:
  # Up to two comments system, the first will be shown as default
  # Choose: Disqus/Disqusjs/Livere/Gitalk/Valine/Waline/Utterances/Facebook Comments/Twikoo/Giscus/Remark42/Artalk
  use: Gitalk # Valine,Disqus
  text: true # Display the comment name next to the button
  # lazyload: The comment system will be load when comment element enters the browser's viewport.
  # If you set it to true, the comment count will be invalid
  lazyload: false
  count: true # Display comment count in post's top_img
  card_post_count: true # Display comment count in Home Page

# gitalk
# https://github.com/gitalk/gitalk
gitalk:
  client_id: # 建议填到 Github Secret里
  client_secret: # 同上，如果博客源代码是开源的，别填
  repo: lz37.github.io
  owner: lz37
  admin: lz37
  language: zh-CN # en, zh-CN, zh-TW, es-ES, fr, ru
  perPage: 10 # Pagination size, with maximum 100.
  distractionFreeMode: false # Facebook-like distraction free mode.
  pagerDirection: last # Comment sorting direction, available values are last and first.
  createIssueManually: false # Gitalk will create a corresponding github issue for your every single page automatically
  option:
```

编辑 `Github Workflows Yaml`：

```yaml
name: Hexo
on:
  push:
    branches:
      - master
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [16.17.1]
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: pnpm/action-setup@v2
        with:
          version: 7
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'pnpm'
      - name: Install dependencies
        run: pnpm install
      - name: Clean
        run: pnpm run clean
      - name: Build
        run: pnpm run build
        # -------- 重点在这 -------- #
        env:
          gitalk_id: ${{ secrets.GITALK_ID }}
          gitalk_secret: ${{ secrets.GITALK_SECRET }}
        # -------- 重点在上 -------- #
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.PAGE }}
          publish_dir: ./public
          publish_branch: main # default: gh-pages
```

在 `scripts` 文件夹下新建 `javascript` 脚本：

```javascript
hexo.extend.filter.register(
  'before_generate',
  () => {
    hexo.log.info('传入 Gitalk 私密参数')
    hexo.theme.config.gitalk.client_id = process.env.gitalk_id
    hexo.theme.config.gitalk.client_secret = process.env.gitalk_secret
  },
  0,
)
```

最后到对应的仓库的 `Settings` -> `Secrets and variables` -> `Actions` 点击 `New repository secret` 添加 `GITALK_ID` 和 `GITALK_SECRET` 两个变量，分别填写上面申请的 id 和密钥。

到此为止，全部完成！
