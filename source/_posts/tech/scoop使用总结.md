---
title: scoop 使用总结
categories: tech
tags:
  - Scoop
  - Windows
description: scoop 的安装与使用
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

参考

- [Scoop 安装、使用与卸载](https://zhuanlan.zhihu.com/p/609534833)
- [Scoop](https://scoop.sh/)

## 安装

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser # Optional: Needed to run a remote script the first time
irm get.scoop.sh | iex
```

有时需要在 windows server 上安装 scoop，若 windows server 只存在 Administrator 账户，默认的安装方法是拒绝安装的，需要额外添加参数。

```powershell
iwr -useb get.scoop.sh -outfile 'install.ps1'
.\install.ps1 -RunAsAdmin
```

设置代理

```powershell
scoop config proxy localhost:7890
```

建议不在 scoop 中配置代理，而是使用 clash 的 tun 模式统一转发。

## 添加 bucket

执行 `scoop bucket known` 查看已知的 bucket。

```powershell
scoop bucket known
## 输出
main
extras
versions
nirsoft
sysinternals
php
nerd-fonts
nonportable
java
games
```

执行 `scoop bucket add <bucket-name>` 添加 bucket。

```powershell
scoop bucket add extras
scoop bucket add versions
## ...
```

推荐添加第三方 bucket `dorado`。

```powershell
scoop bucket add dorado https://github.com/chawyehsu/dorado
```

## 必装软件

- `aria2`: 下载工具，添加以后 scoop 自动使用多线程下载。
- `7zip`: 解压工具，scoop 的依赖之一。
- `git`: 版本控制工具，scoop 的依赖之一。
- `scoop-search`: scoop 的搜索工具，比 scoop 的默认搜索更快。安装后还需要配置一下，自动覆盖`scoop search`的子命令：

  ```powershell
  echo "Invoke-Expression (&scoop-search --hook)" >> $PROFILE # $PROFILE不存在请创建
  ```
