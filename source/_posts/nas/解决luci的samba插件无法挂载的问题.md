---
title: 解决 luci 的 samba 插件无法挂载的问题
categories: nas
tags:
  - Openwrt
  - Samba
  - TrueNAS SCALE
  - TrueNAS
description: 某些 openwrt 无法正常挂载 samba 的解决方式，使用 busybox 解决问题。
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

- [SMB/CIFS 网络共享文件夹 挂载不上](https://github.com/stupidloud/nanopi-openwrt/issues/988)

本人使用的 openwrt 为 [esir](https://www.youtube.com/c/esirplayground) 大佬编译的高大全固件。[esir 的谷歌云盘](https://drive.google.com/drive/folders/1dqNUrMf9n7i3y1aSh68U5Yf44WQ3KCuh)

其使用 samba 插件时一直有个问题，那就是开机无法正常自动挂载，必须得再手动点击挂载才行。为了解决这个问题，我手贱升级了一下 samba 依赖（opkg update...）。

事实证明 opkg 和其他 linux 发行版的包管理逻辑不完全一样，内核版本不对就别指望着升级吧，基本就相当于摆设，特别是对于新版本 openwrt 来说。

升级过后，不仅原来的问题没有解决，就连 mount.cifs 命令都冇用了，那自然是在启动脚本中手动添加挂载命令都不行了，不过好在这个问题不仅我一个人遇到过，其他编译的版本有的也有这个问题。

解决方案就是不使用系统提供的 mount.cifs,而是使用 busybox 中的 mount, 因为这种情况下，mount.cifs 显然已经损坏了。

将 `/etc/init.d/cifs` 改为以下内容即可：

```bash
START=97

ENABLED=0
WORKGROUPD=0
IOCHARSET=0
GUEST=""
USERS=""
AGM=""

cifs_header() {
    local enabled
    local workgroup

    config_get enabled $1 enabled
    config_get workgroup $1 workgroup

    ENABLED=$enabled
    WORKGROUPD=$workgroup
}

mount_natshare() {
    local server
    local name
    local natpath
    local guest
    local users
    local pwd
    local agm
    local iocharset
    local smbver

    config_get server $1 server
    config_get name $1 name
    config_get natpath $1 natpath
    config_get guest $1 guest
    config_get users $1 users
    config_get pwd $1 pwd
    config_get agm $1 agm
    config_get iocharset $1 iocharset
    config_get smbver $1 smbver

    mkdir -p $natpath && chmod 777 $natpath
    #echo "mount -t cifs -o vers=$smbver,user=$users,password=$pwd,iocharset=$iocharset,$agm //$server/$name $natpath"
    # 原来
    # mount -t cifs -o vers=$smbver,user=$users,password=$pwd,iocharset=$iocharset,$agm //$server/$name $natpath
    # 现在
    busybox mount -t cifs -o vers=$smbver,user=$users,password=$pwd,iocharset=$iocharset,$agm //$server/$name $natpath
}

start() {
    config_load cifs
    config_foreach cifs_header cifs

    if [ $ENABLED == 1 ]
    then {
        config_foreach mount_natshare natshare
        #echo "Cifs Mount succeed."
        }
    fi
}

stop() {
    mount | grep '//' | awk -F ' ' '{print$3}' | while read line; do
    #echo "umount -d -l $line"
    umount -d -l $line 2>/dev/null
    done
}
```

使用 mount.cifs 命令的时候也使用 busybox 内置的就可以了。
