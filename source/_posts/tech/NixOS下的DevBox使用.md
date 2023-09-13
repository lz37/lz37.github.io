---
title: NixOS下的 DevBox 使用
categories: tech
tags:
  - Nix
  - NixOS
  - DevBox
description: 使用 DevBox 替代 FHS 方案
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

之前在[NixOS 的 FHS 环境](https://www.zerozawa.top/2023/nixos-%E7%9A%84-fhs-%E7%8E%AF%E5%A2%83/index.html)中讲过，如何在 NixOS 中实现 FHS 环境，目的是为了使用以前一直用的 nvm、goenv、sdkmannager 等工具，因为这些工具大多都是依附于 POSIX 标准而工作的。

当时也不是没有想过使用项目级别的 mkshell 方案，但是 nixos 提供的软件包默认是最新的，无法指定详细的版本号。（除非在 flake 中指定 nixpkgs 的 sha256，但这样无疑十分麻烦）

不过好在有一个工具实现了使用版本号下载 nixpkgs 的功能，并且可以做到类似 nvm 的不同项目间的版本切换，那就是 [devbox](https://www.jetpack.io/devbox)

此工具的使用方法十分简单，由于内核使用 nix 包管理器，因此在 nixos 上直接下载就好。

## 安装

[Installing Devbox](https://www.jetpack.io/devbox/docs/installing_devbox/)

NixOS 上建议直接添加到 `environment.systemPackages` 中，或者使用 `home-manager` 也可以。

## 使用

摸索下来，最常用的功能如下：

- `devbox init`: 为项目初始化 devbox, 运行后项目目录下会出现 `devbox.json` 文件，可以直接在文件中添加要使用的软件包，也可以像 npm 之类的包管理器一样使用 `devbox add` 添加软件包。
- `devbox add`: 添加软件包，软件包名可以使用 `dev search` 进行搜索，后面可以跟有 `@xxx` 指定版本号，如 `devbox add nodePackages.pnpm@8.6.12`
- `dev search`: 搜索软件包
- `dev rm`: 删除软件包
- `devbox generate direnv`: 自动为 `direnv` 生成 `.envrc` 钩子，安装配置好 `direnv` 之后进入目录自动载入环境。
- `devbox shell`: 手动进入环境终端
- `devbox run`: 手动运行命令（在 `devbox.json` 中 `shell.scripts` 字段下手动添加 script，类似 `node` 的 `package.json` 中的 `scripts`）

## CI/CD

github action 也有 devbox 对应的插件，然而 devbox 在 github action 的小云主机上安装太慢（本身安装很快，但安装 node 的时候半个小时都没有完成，估计是远程没有缓存而本地编译了），所以在 cicd 的阶段建议还是使用其他的包管理器。

不过要注意 devbox 本身不提供 fhs 环境能力，只是一个简化的项目级别的 nixpkgs 下载器和环境配置器而已，像需要 fhs 的工具还是需要另外配置。
