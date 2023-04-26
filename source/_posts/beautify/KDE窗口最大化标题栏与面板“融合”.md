---
title: KDE窗口最大化标题栏与面板“融合”
toc_number: true
categories: beautify
tags:
  - KDE
  - Plasma
  - Latte Dock
description: 使用 Window AppMenu、Active Window Control、Window Button 三个插件与 Latte Dock 进行美化。
comments:
toc:
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

首先三个插件：

- Window AppMenu
- Active Window Control
- Window Button

不出意外应该有两个是已经安装了的，额外安装的只需要 `Active Window Control` 就好了。这里**注意**：不使用 Active Window Control 的任何额外功能，只用来显示标题（不用 Application Title 是感觉这个标题显示做的太烂了）

安装 Latte Dock

```bash
sudo pacman -S latte-dock
```

打开 latte dock，右键点击配置 latte,首选项选择在`不同布局间支持无边最大化窗口`，然后在布局编辑器里打开对应的布局的无边框选项就好了。

**建议不要使用 Active Window Control 的无边框选项**，因为会被 latte 覆盖，所以只要修改 latte 的就好了。

参考: [kde 最大化窗口时隐藏标题栏](https://blog.csdn.net/yalin1997/article/details/122711033)
