# ZeroZawa's Blog

零泽的小站，基于 [astro-koharu](https://github.com/cosZone/astro-koharu) 主题（Astro 7 + React 19 + Tailwind 4 + MDX），部署在 GitHub Pages：<https://www.zerozawa.top>

## 技术栈

- **框架**: Astro 7（静态输出，无后端）+ React 19 + MDX
- **样式**: Tailwind CSS 4
- **内容**: `src/content/blog/**/*.mdx`（分类目录即分类），frontmatter 支持 `title/date/updated/tags/categories/cover/description/sticky/draft/series/link/tocNumbering`
- **包管理**: pnpm（corepack 锁定）
- **开发环境**: Nix + devenv（`flake.nix`，direnv 自动加载）
- **工具链**: oxlint + oxfmt（替代 eslint/prettier）、tsgo（typescript-go 7，替代 tsc）
- **搜索/评论**: Pagefind（本地索引）；giscus（已配置，待开启，见 config/site.yaml 注释）

## 常用命令

```bash
pnpm dev        # 开发服务器
pnpm build      # 构建到 dist/
pnpm preview    # 预览构建产物
pnpm lint       # oxlint
pnpm format     # oxfmt
pnpm check      # tsgo --noEmit
```

## 主题更新

```bash
pnpm koharu update --check   # 检查上游新版本
pnpm koharu update --clean   # 备份用户内容 → 替换主题文件 → 还原
```

用户内容区（更新时自动备份/还原）：`src/content/blog`、`config/`、`public/img`、`.env`、`src/components/series`、`src/pages/gallery`。

## 自定义组件

- `src/components/series/SeriesBox.astro` — 系列文章导航（替代 Hexo `{% series %}`），MDX 中用法：`<SeriesBox series="系列名" />`
- `src/pages/gallery/` — 画廊页（数据在 `config/gallery.yaml`）

## 部署

push 到 `master` → GitHub Actions 构建 → 发布到 `main` 分支（GitHub Pages）。
