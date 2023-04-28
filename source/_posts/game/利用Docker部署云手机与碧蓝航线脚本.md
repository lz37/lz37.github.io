---
title: 利用 Docker 部署云手机和碧蓝航线脚本
categories: game
tags:
  - Docker
  - Alas
  - Azur Lane
  - ADB
  - Scrcpy
  - Redroid
description: 利用 Docker 部署云手机运行碧蓝航线和部署 Alas 自动刷图脚本的心得
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

## 安装工具

首先得要安装需要的一些工具：docker、adb、scrcpy 等。

### Docker

> Docker 是一种打包、传输和运行任何程序作为轻量级容器的实用工具.

```bash
# 安装 docker
sudo pacman -S docker docker-compose
# 启动 docker
sudo systemctl start docker.service
# docker 添加到启动项
sudo systemctl enable docker.service
# 将用户添加到 Docker 组中，否则只有sudo才能调用docker
sudo usermod -aG docker ${USER}
# 建议重启
reboot
# 测试下 docker
docker run hello-world
```

### ADB

> Android 调试桥（ADB）是一种命令行工具，可用于安装、卸载和调试应用程序，传输文件和访问设备的 shell。

```bash
# 安装 adb
sudo pacman -S android-tools
```

### scrcpy

> scrcpy 是一个免费的开源屏幕镜像程序，它允许以 Windows 、 macOS 或 Linux 台式计算机查看并控制 Android 设备，可轻松实现快速的屏幕镜像。

```bash
# 安装 scrcpy
sudo pacman -S scrcpy
# 不熟悉命令行的也可以使用带有图形界面的qtscrcpy，或者安装额外的guiscrcpy
yay -S qtscrcpy guiscrcpy # 选一个安装就行，或者都不安装，就用命令行
```

### 内核

其他的发行版可能需要解决内核问题，Manjaro 实测不需要管。

## 部署云手机

这里要使用一个叫做 Redroid 的镜像，我们使用 docker-compose 基于这个镜像构建容器。

### 使用转译器

参考：[ReDroid 教學：用 Docker 跑 Android 系統，在 x86 電腦玩 ARM 手機遊戲](https://ivonblog.com/posts/redroid-android-docker/)

普通的镜像是无法运行 arm 架构的程序的，所幸碧蓝航线支持 X86_64 架构，所以无需使用转译器，对于需要转译器的同学，以下是一点点参考（就玩几个特定游戏的并且支持 X86 的建议别上转译器，吃的内存多了一倍）：

先找一个目录，新建一个文件，名为`dockerfile`，内容如下：

```dockerfile
# docker build . -t redroid:11.0.0-nb
FROM redroid/redroid:11.0.0-latest

ADD git/Droid-NDK-Extractor/working/extracted/native-bridge.tar /
```

然后在这个目录下执行：

```bash
git clone https://github.com/sickcodes/Droid-NDK-Extractor.git
cd Droid-NDK-Extractor
chmod +x android-extract-ndk.sh
./android-extract-ndk.sh x86_64
cd working/extracted
mkdir native-bridge
cd native-bridge
sudo tar -xpf ../native-bridge.tar
sudo chmod 0644 system/etc/init/ndk_translation_arm64.rc
sudo chmod 0755 system/bin/arm
sudo chmod 0755 system/bin/arm64
sudo chmod 0755 system/lib/arm
sudo chmod 0755 system/lib64/arm64
sudo chmod 0644 system/etc/binfmt_misc/*
sudo tar -cpf native-bridge.tar system
mv native-bridge.tar ..
cd ..
sudo rm -r native-bridge
```

这样一来就得到 ARM 转译器`native-bridge.tar`了。

使用这个转译器与`redroid:11.0.0-latest`镜像构建出一个新的镜像。

回到`dockerfile`存在的目录，将 native-bridge.tar 复制到此处,运行

```bash
sudo docker build . -t redroid-11-nb
```

然后编辑 `docker-compose.yaml` 文件，填入 docker 启动参数：

```yaml
services:
  redroid:
    privileged: true
    volumes:
      - ./data:/data
    ports:
      - 5555:5555
    command:
      - androidboot.redroid_gpu_mode=host
      - ro.product.cpu.abilist=x86_64,arm64-v8a,x86,armeabi-v7a,armeabi
      - ro.product.cpu.abilist64=x86_64,arm64-v8a
      - ro.product.cpu.abilist32=x86,armeabi-v7a,armeabi
      - ro.dalvik.vm.isa.arm=x86
      - ro.dalvik.vm.isa.arm64=x86_64
      - ro.enable.native.bridge.exec=1
      - ro.dalvik.vm.native.bridge=libndk_translation.so
      - ro.ndk_translation.version=0.2.2
      - ro.secure=0 # 允许 ADB Root 调试
    container_name: redroid
    image: 'redroid/redroid:11.0.0-latest' # 对X86的镜像来说上面的参数多了，但是加了也没事
    # image: 'redroid:11.0.0-nb' 有转译需求的话使用这个
    network_mode: bridge
```

### 启动容器

```bash
# 建议别 -d，云手机还是很吃资源的，需要的时候再手动打开
docker compose up
```

### 显示

```bash
# 连接手机
adb connect localhost:5555
# 显示安卓桌面
scrcpy -s localhost:5555
```

## 部署 Alas 脚本

参考：[Alas Wiki for Docker](https://github.com/LmeSzinc/AzurLaneAutoScript/wiki/Installation_en_docker)

安装

```bash
git clone https://github.com/LmeSzinc/AzurLaneAutoScript
cd AzurLaneAutoScript
```

然后运行

```bash
# 官网是使用podman-compose，
# 注意使用podman的话设置开机启动比较麻烦，
# 而且本人使用podman并没有成功启动
podman-compose up
# 我使用的还是docker
# 没有自启动需求的可以不加 -d, 但是记得要自启得在compose文件加restart: always
docker compose up -d
```

等很长时间。。。

启动好后记得去修改`config/deploy.yaml`文件，把一些路径和代理改了。

至此，全部完成。

## 一些方便的工具

安装 `podman-desktop-bin` 方便一键打开/关闭容器

```bash
yay -S podman-desktop-bin
```

当然也可以用 vscode 的 Docker 插件，但是 podman 起的容器不会被管理到。
