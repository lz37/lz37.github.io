---
title: SmartDNS 配合 Clash 提升上网速度
categories: tech
tags:
  - SmartDNS
  - Clash
  - NixOS
  - Nix
description: 非透明网关，但依然可以使用 Clash 配合 SmartDNS 的方案。
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

参考：

- [SmartDNS](https://pymumu.github.io/smartdns/)
- [[openwrt(x86)] adguardh+smartdns+openclash 设置参考](https://www.right.com.cn/forum/thread-8269668-1-1.html)
- [SmartDns 上游服务器列表大整合（含国内外公共、加密 DNS)](https://www.zctou.com/2154.html)

事情的起因是我在研究 clash 配置文件的字段时，对 `dns` 字段产生了疑惑，后来发现，如果不将机器的 DNS 服务器指向本机的话，那么配置的 DNS 实质上也不会工作。（当然开 tun 之后是否还需要这么做不清楚，NixOS 上还没摸索出怎么开 tun，而 \*nix 上系统代理速度也不慢）

在 `OpenWRT` 系统上，作为路由器，`OpenClash` 会自动劫持局域网内的 DNS 指向自己，但在非软路由环境下，这一步需要自己手动完成。

在 NixOS 上，对应的配置可以写为：

```nix
{...}:

{
  networking.networkmanager.insertNameservers = [
    "127.0.0.1"
    "::1"
  ];
}
```

暂且没有尝试使用 resolv.conf 来配置，理论上可能可以吧，但是不清楚其优先级和 NetworkManager 的优先级孰高孰低。

同时不要忘了配置 clash 的 DNS 字段。

```yaml
dns:
  enable: true
  ipv6: true
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  use-hosts: true
  nameserver:
  # 若干国内 dns 服务器
  fallback:
  # 若干国外 dns 服务器
  fallback-filter:
    geoip: true
    ipcidr:
      - 240.0.0.0/4
      - 0.0.0.0/32
```

注意挑选延迟低的 DNS 服务器，否则会影响上网速度。

而我在被影响到上网速度后，加上了本地运营商的 DNS，速度显著快了许多。但同时我想到，何不使用 smartdns 来解决 DNS 的问题呢，毕竟在路由器上也捣鼓过。

之前只在 openwrt 上配过 smartdns，没有写过配置文件，不过好在官方的文档非常详细，于是我照猫画虎写了一个配置文件。

```conf
# 缓存的条数
cache-size 32768
# 是否持久化缓存
cache-persist yes
# 设置缓存预获取，避免缓存超时
prefetch-domain yes
# 过期缓存
serve-expired yes
# 过期缓存超时时间
serve-expired-ttl 3600
# 过期缓存响应TTL
serve-expired-reply-ttl 3
# cache定时保存
cache-checkpoint-time 3600
# 去广告 ## 将对应的仓库克隆到对应的位置
## https://github.com/Cats-Team/AdRules.git
conf-file /etc/nixos/profile/smartdns/AdRules/smart-dns.conf
## https://github.com/privacy-protection-tools/anti-AD.git
conf-file /etc/nixos/profile/smartdns/anti-AD/anti-ad-smartdns.conf
## https://github.com/neodevpro/neodevhost.git
conf-file /etc/nixos/profile/smartdns/neodevhost/lite_smartdns.conf
# 双栈优选
dualstack-ip-selection yes
# 代理
proxy-server socks5://127.0.0.1:7891 -name socks5
# 文件位置
log-file /etc/nixos/profile/smartdns/smartdns.log
audit-file /etc/nixos/profile/smartdns/smartdns-audit.log
cache-file /etc/nixos/profile/smartdns/smartdns.cache

# 上游 dns 服务器 cn
## 苏州
server 61.177.7.1 -group cn
## 常州
server 202.102.3.144 -group cn
## 阿里
server 223.5.5.5 -group cn
server 223.6.6.6 -group cn
## 腾讯
server 119.29.29.29 -group cn
## 百度
server 180.76.76.76 -group cn
## 360
server 101.226.4.6 -group cn
server 218.30.118.6 -group cn
server 123.125.81.6 -group cn
server 140.207.198.6 -group cn
## 114
server 114.114.114.114 -group cn
server 114.114.115.115 -group cn
## 阿里加密DNS
server-https alidns_ip/dns-query -group cn
server-https dns.alidns.com/dns-query -group cn
## 腾讯加密DNS
server-https doh.pub/dns-query -group cn
server-https sm2.doh.pub/dns-query -group cn

# 上游 dns 服务器 oversea
## Cloudflare公共DNS
server 1.1.1.1 -group oversea -proxy socks5
## Google 公共DNS
server 8.8.8.8 -group oversea -proxy socks5
server 8.8.4.4 -group oversea -proxy socks5
## Norton 公共DNS
server 199.85.126.10 -group oversea -proxy socks5
server 199.85.127.10 -group oversea -proxy socks5
## 威瑞信 公共DNS
server 64.6.64.6 -group oversea -proxy socks5
server 64.6.65.6 -group oversea -proxy socks5
## Comodo 公共DNS
server 8.26.56.2 -group oversea -proxy socks5
server 68.20.247.2 -group oversea -proxy socks5
## DNS Watch 公共DNS
server 84.200.69.80 -group oversea -proxy socks5
server 84.200.70.40 -group oversea -proxy socks5
## OpenDNS 公共DNS
server 208.67.222.222 -group oversea -proxy socks5
## Google 加密DNS
server-https dns.google/dns-query -group oversea -proxy socks5
server-tls dns.google -group oversea -proxy socks5
## Cloudflare 加密DNS
server-tls 1.1.1.1/dns-query -group oversea -proxy socks5
## Quda9 加密DNS
server-https dns11.quad9.net/dns-query -group oversea -proxy socks5
## OpenDNS 加密DNS
server-https doh.opendns.com/dns-query -group oversea -proxy socks5

# dns 监听地址
bind [::]:5335 -group oversea -no-speed-check
bind [::]:6053 -group cn
```

如此一来，smartdns 便可以开启两个端口，一个向国内 DNS 服务器组发送请求，另一个向国外 DNS 服务器组发送请求。

此时，我们需要配置 clash 的 DNS 字段，将其指向 smartdns 的监听地址。

```yaml
dns:
  enable: true
  ipv6: true
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  use-hosts: true
  nameserver:
    # smartdns
    - 127.0.0.1:6053
  fallback:
    # smartdns
    - 127.0.0.1:5335
  fallback-filter:
    geoip: true
    ipcidr:
      - 240.0.0.0/4
      - 0.0.0.0/32
```

这样，我们就可以在无软路由环境下，使用 smartdns 和 clash 了。

最后别忘了将 clash 和 smartdns 注册到 systemctl 里。

下面贴一下我的科学上网相关的 Nix 配置，权当参考。

```nix
{ config, pkgs, ... }:

{

  systemd.services = {
    clash = {
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];
      serviceConfig = {
        ExecStart = "${pkgs.clash-meta}/bin/clash-meta -d /etc/nixos/profile/clash";
        Type = "simple";
        Restart = "on-abort";
      };
    };
    smartdns = {
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];
      serviceConfig = {
        ExecStart = "${pkgs.smartdns}/bin/smartdns -f -x -c /etc/nixos/profile/smartdns/smartdns.conf";
        Type = "simple";
        Restart = "on-abort";
      };
    };
  };
  environment.sessionVariables = rec {
    http_proxy = "http://127.0.0.1:7890";
    HTTP_PROXY = http_proxy;
    https_proxy = http_proxy;
    HTTPS_PROXY = https_proxy;
    socks_proxy = "socks5://127.0.0.1:7891";
    SOCKS_PROXY = socks_proxy;
    all_proxy = socks_proxy;
    ALL_PROXY = all_proxy;
    no_proxy = "localhost, 127.0.0.1, 192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12";
    NO_PROXY = no_proxy;
  };
  virtualisation.oci-containers.containers.yacd = {
    image = "haishanh/yacd";
    ports = [ "1234:80" ];
  };
  networking.networkmanager.insertNameservers = [
    "127.0.0.1"
    "::1"
  ];

}

```

完整代码参考仓库: [lz37/nix](https://github.com/lz37/nix)
