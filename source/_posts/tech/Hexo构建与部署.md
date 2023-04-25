---
title: Hexo构建与部署
categories: tech
tags:
  - Blog
  - Hexo
  - NodeJs
  - Github Action
description: 最新心得，全自动化构建+部署流程，省去写date与update、运行hexo命令的麻烦，以及其他黑科技
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
---

建议在看此篇文章之前弄懂什么是 CI/CD（持续集成），并拥有一定的 NodeJS 基础知识。

推荐阅读：

- [什么是 CI/CD ？](https://zhuanlan.zhihu.com/p/422815048)
- [Github Action 快速入门](https://docs.github.com/zh/actions/quickstart) 建议开个空仓库练练手，编译一个 hello world 并输出。

## 心得 3.0

网上部署 hexo 博客多数都要用到`hexo-deployer-git`这个插件，同时还要在`_config.yml`中配置`deploy`，这样每次部署都要手动运行`hexo clean && hexo g && hexo d`，十分麻烦。

或许会有人嫌麻烦，自己写了一个 git 脚本或者是 python 脚本，自动化部署博客，不过在我看来，还是多了一个执行脚本的命令，不够优雅。（就像之前的我）

不过经过半年的工作和开源项目开发，我首先接触到了 AWS CI/CD,又接触了`Github Action`。一个自然而然的想法就形成了，何不用`Github Action`进行持续集成呢？

经过一番摸索，我总结出了如下流程：

### CI/CD

创建博客仓库，名称命名为`username.github.io`，注意，此仓库不仅作为博客编译后的 html 文件所在仓库，还将作为博客源码仓库，两个项目分属不同分支。

开创两个分支，名称什么都可以，我这里分别命名为`master`（源码分支）和`main`（编译文件分支）。

源码分支创建`.github/workflows`文件夹，里面添加一个随便起名的`yaml`文件。文件内容如下：

```yaml
name: Hexo # 名称随意
 on:
   push:
     branches:
       - master
 jobs:
   build:
     runs-on: ubuntu-latest
     strategy:
       matrix:
         node-version: [16.17.1] # 版本建议和本地一致
     steps:
       - uses: actions/checkout@v3
         with:
           fetch-depth: 0 # 读取更多历史信息，hexo-filter-date-from-git 要用到
       - uses: pnpm/action-setup@v2
         with:
           version: 7
       - name: Use Node.js ${{ matrix.node-version }}
         uses: actions/setup-node@v3
         with:
           node-version: ${{ matrix.node-version }}
           cache: "pnpm"
       - name: Install dependencies
         run: pnpm install
       - name: Clean
         run: pnpm run clean
       - name: Build
         run: pnpm run build
       - name: Deploy
         uses: peaceiris/actions-gh-pages@v3
         with:
           github_token: ${{ secrets.PAGE }}
           publish_dir: ./public
           publish_branch: main  # default: gh-pages
```

同时在帐号里开一个`token`，名称随意，权限选择`workflow`即可，添加到仓库的`secrets`中，名称为`PAGE`。（这里`PAGE`也随意）

我这个配置文件有点长，不用 pnpm 包管理的同学可以去 github action 模板找一个 nodejs 的模板，那个短一点。

有了这个配置文件，每次 push 到`master`分支，就会自动运行`pnpm install`，`pnpm run clean`，`pnpm run build`，`pnpm run deploy`，最后将编译后的文件推送到`main`分支，一个网站就在云上被部署好了。

### date 与 update

安装`hexo-filter-date-from-git`即可，他这个单纯调用 git 命令获得这两个时间的，所以要注意文件名不要有空格，介意的话可以给这个库打个 patch, 或者提个 pr, 处理一下，源码一共就小几十行，很简单。

**注意**：**windows**可能会因为文件名编码问题导致不能用中文（猜的，我也不知道，总之建议 wsl）

### 自定义插件黑科技

在博客目录下（或者其他地方也行，不过推荐博客目录）创建一个新的`nodejs`项目，至少要包含`package.json`与`index.js`文件。同时项目名称（package.js 中定义的）要为 **hexo** 开头，就像其他插件那样。

博客项目安装子项目，这个网上有很多方案，我选择 pnpm 方案，这里不细说，可以 `search the fucking web` 或者研究下我的项目构成：

- [我的博客](https://github.com/lz37/lz37.github.io)
- [noveler](https://github.com/lz37/noveler)

然后就可以在`index.js`里编写插件代码了，API 参考 [Hexo: API](https://hexo.io/zh-cn/api/).

本人的自定义插件代码如下：

````javascript
/** @type {import("hexo")} */ // 解决编辑器的代码提示问题
hexo.extend.filter.register(
  'before_post_render', // 生命周期
  (data) => {
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
  0, // 表示最优先执行，数字越大，执行顺序越后，建议抢在其他插件渲染前执行
)
````

主要实现了两个功能：

1. 博客的封面与顶部图与分类页面的顶部图统一
2. 将 mermaid 代码块翻译为 hexo 标签

写完此插件以后，我的页头几乎只要写四个内容就够了，比如本篇文章，其他几项都自动生成了，而且不会影响到文章的源代码。

```yaml
title: Hexo构建与部署
categories: tech
tags:
  - Blog
  - Hexo
  - NodeJs
  - Github Action
description: 最新心得，全自动化构建+部署流程，省去写date与update、运行hexo命令的麻烦，以及其他黑科技
```

另外注意，不需要再费力气写 `keywords` 了，对 SEO 冇用，有的主题甚至都不搞 keywords 生成了，也就在文档里提一嘴（说的就是你，butterfly！）

### 替换渲染引擎为 markdown-it

这个基操了，参考[將 Hexo 的 Markdown 渲染引擎換成 markdown-it](https://titangene.github.io/article/hexo-markdown-it.html)

### 不要用 pangu 会变得不幸

butterfly 的 `pangu.js` 的 load 周期是在文章渲染之后才执行的，有点逆天，有的地方版式都被破坏了。

建议用`prettier`，prettier 在格式化的时候也会自动在中英文间加空格，不过有的地方因为符号问题，不会加，这部分就自己手动加一下。

懒得一篇篇文章手动格式化的直接运行命令就好

```bash
pnpm dlx prettier --write **/*.md
```

设置 git 提交时自动格式化。

```bash
pnpm i -D husky lint-staged prettier
pnpm dlx husky install
```

编辑`.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

if [ -t 2 ]; then
  exec >/dev/tty 2>&1
fi

npm run lint-staged
```

编辑`.lintstagedrc`:

```json
{
  "**/*.md": ["prettier --write"]
}
```

这样在运行`git commit`时，会自动格式化修改过的文件。

## 结语

不用`hugo`用`hexo`的原因之一就是因为 hexo 可扩展性强，而且背靠 NodeJS，生态可以说很好了，这对自定义要求高的使用者来说是件好事。（hugo 体验过一点点，但没仔细研究，莫喷）
