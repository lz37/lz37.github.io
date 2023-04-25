---
title: Linux增加交换空间
toc_number: true
categories: tech
tags:
  - Linux
  - Swap
keywords:
description: 适用于使用swap文件的linux系统，使用分区的请另外搜索
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

## 为什么要增加交换空间？

详细的可以看[这篇文章](https://www.jianshu.com/p/12e25ea172de)

Ubuntu20.04 装机的时候如果使用默认磁盘配置，交换空间默认会给 2.0G，感觉实在有些小是一个方面，而且今天在运行 ES 的时候，内存被这恐怖的家伙吃了个满满当当，连平日里一直为零的交换空间也被塞满了，电脑当场卡死，这才想着不增加点交换空间是不行了。

至于交换空间得多大，这个仁者见仁，不同机子看平常里运行的程序不同设置的当然也不同，只需要满足最低配置即可。**大概要求如下**

如果 RAM 小于 1GB，Swap 空间至少要和 RAM 一样大，甚至是要为 RAM 的两倍大小
如果 RAM 大于 1GB，Swap 交换空间应该至少等于 RAM 大小的平方根，并且最多为 RAM 大小的两倍
如果要休眠，Swap 交换大小应该等于 RAM 的大小加上 RAM 大小的平方根

附一张 Ubuntu 建议的 Swap 分配表

| Ram 大小 | Swap 大小 | 激活 Swap 后合计大小 |
| :------: | :-------: | :------------------: |
|  256MB   |   256MB   |        512MB         |
|  512MB   |   512MB   |         1GB          |
|   1GB    |    1GB    |         2GB          |
|   3GB    |    2GB    |         5GB          |
|   4GB    |    2GB    |         6GB          |
|   6GB    |    2GB    |         8GB          |
|   8GB    |    3GB    |         11GB         |
|   12GB   |    3GB    |         15GB         |
|   16GB   |    4GB    |         20GB         |
|   32GB   |    6GB    |         38GB         |
|   64GB   |    8GB    |         72GB         |
|  128GB   |   11GB    |        139GB         |

说完了为什么以及大概的要求后，我们可以准备冻手了

## 具体操作

本人的机器是 16G 的 RAM，对应最低的交换空间是 4G，最高是 32G，因此稍微折中一下，就~~设置和内存一模一样的 16G~~（桌面发行版建议内存大小+最低大小，非桌面版建议最低大小）。

因为系统自带有 2.0GB 的交换空间，干脆直接删除掉。

本部分参考：<https://www.myfreax.com/how-to-add-swap-space-on-ubuntu-20-04/>

### 删除系统自带的交换空间

首先使用`swapoff`命令关闭交换空间。

    sudo swapoff -v /swapfile

然后，打开文件`/etc/fstab`，并移除行`/swapfile swap swap defaults 0 0`

    sudo vim /etc/fstab

最后的一步是删除交换空间文件。

    sudo rm /swapfile

### 创建一个新的交换空间

使用`fallocate`创建一个`swap`交换的文件

    sudo fallocate -l 16G /swapfile

交换空间文件的权限只有`root`用户才能写入和读取交换文件的数据。因此要给交换文件的权限设置为`600`

    sudo chmod 600 /swapfile

交换空间文件所使用的文件系统与普通文件不一样，因此它有自己的格式和专用个格式化工具。使用`mkswap`命令来格式化交换空间文件：

    sudo mkswap /swapfile

输出如下

    正在设置交换空间版本 1，大小 = 16 GiB (17179865088  个字节)
    无标签， UUID=e662881a-e9ec-486d-9865-cc3c74923bba

启用交换空间，为了让系统识别交换空间文件，因此还需要手动启用交换空间文件。

    sudo swapon /swapfile

`swapon`命令启用交换空间仅此次会话可用，重启后将不会自动挂载。为了让交换空间永久启用，并在开机启动时自动挂载。因此我们需要修改 Linux 的自动挂载`/etc/fstab`配置文件。

    echo "/swapfile swap swap defaults 0 0" | sudo tee -a /etc/fstab

验证交换空间的状态

`swapon`命令

    sudo swapon --show
    NAME      TYPE SIZE USED PRIO
    /swapfile file  16G   0B   -2

`free`命令

    sudo free -h
    总计         已用        空闲      共享    缓冲/缓存    可用
    内存：        15Gi       5.9Gi       6.3Gi       1.0Gi       3.3Gi       8.3Gi
    交换：        15Gi          0B        15Gi

此外还可以调整 Swappiness 值来改变系统使用交换空间的频率，这个值我保持了默认 60，想改可以看上面的文章
