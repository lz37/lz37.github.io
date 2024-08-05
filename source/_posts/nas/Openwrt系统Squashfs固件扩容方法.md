---
title: Openwrt 系统 SquashFS 固件扩容方法
categories: nas
tags:
  - Openwrt
  - SquashFS
  - parted
  - fdisk
description: 适用于安装前扩展 openwrt overlay 分区。
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

- [OpenWrt x86 官方 squashfs 固件安装时扩容方法](https://www.izilzty.com/?post=5) **注意：此文章内容仅适用于 legacy 启动，对于 uefi 看一下他的评论区**
- [OpenWrt 完美扩容 Overlay 硬核新方法，真扩容，零空间浪费，专治强迫症！](https://www.youtube.com/watch?v=Kap02m83W40) **这个比较简单完美**

## 操作

首先，将固件写入磁盘，本文不讨论扩展 img,因为两者基本是一样的

```bash
gzip -dc xxx.img.gz | dd of=/dev/xxx
```

修改磁盘分区

```bash
parted /dev/xxx
# 以下为parted的内置shell中的操作
print # 查看分区，找到要扩容的overlay分区编号，一般为2
resizepart 2 100% # 最后一个参数也可以是1G 10G之类的
quit
```
