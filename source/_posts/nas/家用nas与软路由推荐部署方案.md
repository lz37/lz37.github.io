---
title: 家用 nas 推荐方案
categories: nas
tags:
  - Openwrt
  - Proxmox
  - TrueNas
description: 硬件、组网、系统选择、docker等等
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

玩了 nas 有一段时间了，这里记录一下推荐的部署方案。

由于 nas 通常是和软路由配套玩的，所以也会涉及到软路由的相关知识。

## 硬件选择

最好选择二手淘汰服务器 + ECC 内存 + 最好三条 SSD（一条要好的，另外两条差点，当缓存盘使用，加快读写，后两条非必须）+ 若干 HDD + 淘汰的服务器矿卡（显卡，说是矿卡其实是夸张描述，建议购买 Nvidia P40/M40/P4 这类淘汰的企业级显卡，P4 只能当当转码卡用了，P40 还能以较慢的速度跑跑深度学习）

以上是第一梯队，也是我未来想要彻底转向到的硬件标准。如果对能耗敏感的话，建议买星际蜗牛、畅网等牌子的低耗成品，但选低耗平台的话，PVE 系统就别想了，直接物理裸装 TrueNas、unRaid、OpenMediaVault 吧，但低耗成品一般都是笔记本内存，后面升级硬件的话内存也不通用。

折衷方案是买二手的台式机（也是我目前的硬件配置），选择带比较多的 SATA 接口的主板。买前注意查看是否支持 ECC 内存，由于是二手台式机，CPU 自带的的集显性能应该也能用，无需仅仅为了转码而买独显了。（注意主板是否能和企业级的独显兼容，我试过我手上的就不行）

软路由方面，根据家里的预计带宽选择对应性能的软路由，稍带点冗余就够了，如果 NAS 是二手服务器的话，买个软路由还不如 ALL IN ONE（前提是有多网口，但服务器一般都有多网口）

## 网络组网

首先，光猫桥接是必须的。

建议不要搞旁路由，因为一旦主路由开 ipv6，子网下的 ipv6 流量都会直接走主路由，不经过旁路由。当然有的主路由可以自定义 ipv6 网关，但终究是麻烦，就算 DNS 过滤掉 ipv6，强制子网走 ipv4，也防不住各个终端里的各种软件里各种奇奇怪怪的行为。

就算禁用子网中的 ipv6，旁路由本身就是会存在问题，建议不搞。

### 关于 ipv6

鉴于目前运营商都不给公网 ipv4 地址了，ipv4 的限制也是各种各样，比如有的家庭 ipv4 上行比 ipv6 上行少很多，有的 ipv4 禁用很多常用端口（比如我在苏州租的房子，，ipv4 小于 10000 的端口基本用不了，老家的 ipv6 只发现 ban 了 80、443、8080 这三个，而前几个月连 80 都能用）。因此我建议只使用 ipv6，ipv4 有最好，没有也无所谓（抢 pt 上传的和跑 pcdn 的除外）。

还有一点，ipv6 建议只给主路由，通常是 openwrt 就够了。因为对于`科学上网`来说，ipv6 会造成各种各样的问题，一般情况下，拥有 ipv6 也并不会让网络变得更快，倘若只是为了暴露服务的话，在 openwrt 上部署一个反代就好了。

**ipv6 下暴露子网端口**：我尝试过使用端口转发来在路由器上暴露子网端口，然而本人太菜，没搞定。关闭 ipv6 防火墙也非常不安全。因此我折腾出来的解决方案就是在 openwrt 中部署 nginx，效果可以说是非常完美。

**无 ipv6 网络访问家中服务**：网上又说搞啥 cloudflare 的，这玩意儿在大陆使用简直慢到怀疑人生。推荐搞个 zerotier 直接做穿透，两边都开梯子可以访问到域外的话，穿透的过程并不慢。

## 系统配置

软路由单独一台机子的话，直接上 openwrt，啥虚拟化都不要。

NAS 的话，推荐 Proxmox + TrueNas Scale。TrueNas Scale 作为虚拟机运行在 pve 上。pve 将储存相关的硬件（SATA controller，缓存盘）全部直通给 TrueNas Scale，但注意别直通 pve 的系统盘。

truenas 掌管除 pve 以外的所有存储，对外暴露 nfs、smb 等服务。对存储敏感的服务（数据库等）也可以直接运行在 truenas 上，不过我认为安全的 docker 应用都可以运行在 pve 上。

至于说不安全的 docker 应用，比如说 redroid，就得另开虚拟机了，因为这东西对内核也有要求，我是开 arch，用 zen 内核起的服务。

## Docker 推荐

1. [portainer](https://www.portainer.io/)，管理 docker 的 docker，部署教程：[TrueNAS SCALE 使用 K8S 安装 portainer 管理 docker](https://www.zerozawa.top/2023/truenas-scale-%E4%BD%BF%E7%94%A8k8s%E5%AE%89%E8%A3%85portainer%E7%AE%A1%E7%90%86docker/index.html)
2. [redroid](https://github.com/remote-android/redroid-doc)，docker 上的安卓模拟器
3. [Alas](https://github.com/LmeSzinc/AzurLaneAutoScript)，碧蓝航线脚本，alas 与 redroid 是配套的，当然对于其他手游也有其他脚本，请自行搜索。相关部署教程：[利用 Docker 部署云手机和碧蓝航线脚本](https://www.zerozawa.top/2023/%E5%88%A9%E7%94%A8-docker-%E9%83%A8%E7%BD%B2%E4%BA%91%E6%89%8B%E6%9C%BA%E5%92%8C%E7%A2%A7%E8%93%9D%E8%88%AA%E7%BA%BF%E8%84%9A%E6%9C%AC/index.html)
4. [aria2-pro](https://p3terx.com/archives/docker-aria2-pro.html)，多线程下载器，建议配置在 openwrt 上，因为 bitTorrent 协议需要公网 ip.
5. [Docker-qBittorrent-Enhanced-Edition](https://github.com/SuperNG6/Docker-qBittorrent-Enhanced-Edition)，磁力下载器，和 aria2 同理
6. 数据库，比如 mariadb，redis，mongodb，elasticsearch，不多说了。
7. [filebrowser](https://filebrowser.org/)，文件管理器
8. [navidrome](https://www.navidrome.org/)，音乐服务器
9. [autobangumi](https://www.autobangumi.org/)，自动下载番剧，需要部署 qBittorrent
10. [jellyfin](https://jellyfin.org/)，媒体服务器，做家庭影音啥的
11. [heimdall](https://heimdall.site/)，自定义网页面板，通常用来做家里的各个服务的入口
12. [reader](https://github.com/hectorqin/reader)，阅读 3 服务器版，用过“那个”阅读 app 的都知道我在说什么
13. [music tag](https://github.com/xhongc/music-tag-web)，music tag 网页版，自动刮削音乐文件并修改文件元数据，jellyfin 也能刮，但是并不直接修改文件元数据，而是保存在数据库中，或者 nfo 中。

另外推荐不是 docker 的虚拟机，当然也可以作为 docker 部署：NixOS，目前可以说是我见到过的最好的 linux 发行版，开个 nixos 虚拟机，写代码 ssh 上去，不要太爽。
