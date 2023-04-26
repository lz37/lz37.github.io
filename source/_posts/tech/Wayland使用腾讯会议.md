---
title: Manjaro Plasma Wayland 下使用腾讯会议
toc_number: true
categories: tech
tags:
  - Linux
  - KDE
  - Plasma
  - Wayland
  - Manjaro
  - Arch
  - Wemeet
  - OBS
description: 使用OBS虚拟摄像头在wayland下使用腾讯会议（wemeet）
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

本文参考：

- [wayland 下使用腾讯会议分享屏幕](https://zhuanlan.zhihu.com/p/579004291)
- [Install v4l2loopback](https://forum.manjaro.org/t/install-v4l2loopback/79240)

首先安装腾讯会议：

```bash
yay -S wemeet-bin
```

现在的腾讯会议在 wayland 下也能打开了，只是没有屏幕分享。

登陆弹窗**显示不了**的可以调用`/opt/wemeet/bin/wemeetapp`打开登陆，然后 wemeet 也就登陆上了。

安装 obs studio

这里附上知乎参考来的安装过程

```bash
# 安装
yay -S obs-studio xdg-desktop-portal-lxqt xdg-desktop-portal-wlr v4l2loopback-dkms xdg-desktop-portal
# 创建虚拟摄像头
sudo modprobe v4l2loopback devices=1 video_nr=10 card_label='OBS Cam' exclusive_caps=1
sudo modprobe snd-aloop index=10 id='OBS Mic'
pacmd 'update-source-proplist alsa_input.platform-snd_aloop.0.analog-stereo device.description="OBS Mic"'
```

不过内核没有对应功能的话，obs 的右边选项栏里大概率是没有虚拟摄像头的，这个需要改一下内核。

看看自己的内核版本，5.12 的就安装 `linux512-headers`，我的内核是 6.1 的，那么就安装 `linux61-headers`。

再安装 v4l2loopback-dkms 与 dkms 即可

完整代码如下：

```bash
# 安装 headers, 不用再查看版本号了，直接下载对应的
sudo pacman -S $(ls /boot | awk -F "-" '/^linux/ { print $1"-headers" }')
sudo pacman -Syu dkms base-devel --needed
sudo pacman -S v4l2loopback-dkms
# 重启
reboot
```

重启后 OBS 差不多就会有虚拟摄像头的选项了。

以下三段文字复制于知乎：

> 打开 obs, source 里选中 screen capture, 选择要分享的屏幕, 然后点右边的 start virtual camera 就可以了.
>
> 最后发起一个腾讯会议, 使用摄像头, 这个时候就可以在摄像头设备列表中看到虚拟摄像头了, 选中就可以分享屏幕了.
>
> 最后, 如果出现啥奇怪现象, 比如 start virtual camera 点了没反应啥的, 重启一下然后重新执行创建虚拟摄像头的指令应该就好.

以上
