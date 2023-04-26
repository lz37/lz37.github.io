---
title: KDE Plasma Wayland 使用体验
categories: tech
tags:
  - Manjaro
  - Plasma
  - KDE
  - Fcitx5
description: wayland安装与开启 + 输入法的配置 + 一些不足与tricks
comments:
toc:
toc_number: true
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

最近将系统从 Ubuntu Gnome 换为了 Manjaro Plasma，重新捣鼓了一下，总结了一些新的与不足。

## wayland

参考：[2022 年,用 Wayland 开启 linux](https://zhuanlan.zhihu.com/p/531205278?utm_id=0)

### 安装

```bash
pacman -S plasma-wayland-session \
          plasma-wayland-protocols \
          qt5-wayland \
          qt6-wayland \
          xorg-xwayland \
```

## 输入法

输入法方面的配置和 X11 有些许不同，下面详细的说一下。

### 安装 Fcitx5 输入法

```bash
sudo pacman -S manjaro-asian-input-support-fcitx5 \
               fcitx5-chinese-addons \
               fcitx5-material-color \
               fcitx5-configtool \
               fcitx5-lua \
               fcitx5-gtk \
               fcitx5-qt \
               fcitx5
```

就可以在 sddm 中看见 plasma(wayland)选项，选择之后就可以进入 wayland 的 kde.

### 配置 Fcitx5 输入法

在 Xorg 环境下，一般的配置文件是写在 `~/.xprofile` 中的，但是在 Wayland 下，这个文件是不会被执行的，一个解决方式是使用`~/.pam_environment`，这个文件无论是 wayland 还是 x11 都会执行。

不过我在 [arch bbs](https://bbs.archlinuxcn.org/viewtopic.php?id=11294) 上看到相关的情报：

> 因为 pam 这边提权漏洞 CVE-2010-4708 等，上游决定废弃 .pam_environment，目前 arch 还能用是因为打包者加了 patch （/etc/pam.d/system-login 加入 session required pam_env.so user_readenv=1），这种兼容性 patch 也会在将来被移除。

不过可以在 `~/.config/environment.d/*.conf` 中设置相关的变量，强烈不建议使用系统级别的 `/etc/environment`，权限、备份管理起来都很麻烦。

因此我选择修改 `~/.config/environment.d/fcitx5.conf`，添加以下内容：

```properties
GTK_IM_MODULE DEFAULT=fcitx
QT_IM_MODULE  DEFAULT=fcitx
XMODIFIERS    DEFAULT=@im=fcitx
INPUT_METHOD  DEFAULT=fcitx
SDL_IM_MODULE DEFAULT=fcitx
```

同时建议修改输入法 `ctrl + space` + `ctrl + .` 快捷键，免得和 vscode 冲突。

## wayland 优点

其实最大的优点我觉得就是解决了同时在使用两块分辨率不同的屏幕时，屏幕撕裂的问题（我使用的是 intel 集成显卡），我尝试过修改 xorg 的配置，但是都没有成功，好几次修改都显示不了画面，只好转 tty 再把配置文件删掉。

而且 wayland 支持多屏分别设置缩放，不过我的主屏在设置
200% 缩放后出现了 electron 应用后台无法右键的问题（listen1+linuxQQ），只好再转回 100%，这个问题应该是 plasma5.27 的问题，在使用 gnome42.5 时从未出现。（_但是 gnome 在开启 app 列表经常性出现卡死，那个问题更严重，索性还是选择了 KDE_）

## 缺点

最大缺点就是现在支持的应用和桌面还是比较少吧，能完美使用 wayland 的桌面也就是 gnome 了，kde 下还是会有小瑕疵，右键 qq 的系统托盘有几率造成 qq 的崩溃，需要手动删除 qq 的配置文件（`~/.config/QQ`)才能解决；以及 electron 应用的右键菜单也有几率出现文不对题的情况（右键 QQ 结果出现了 listen1 的菜单），目前的解决方案是在右键前仔细看下鼠标旁边的悬浮气泡的内容，确认一致之后再右键点击。

plasma5.27 是 plasma6 前的最后一版桌面，到 plasma6 时，wayland 将会在 KDE 桌面上得到全面支持，希望那个时候的表现能够好一些吧，现在反正凑合着还可以用。
