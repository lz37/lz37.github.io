---
title: 公共 DNS 收集总结
categories: etc
tags:
  - DNS
  - Public DNS
description: 分享一下最近收集的公共 DNS
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

合理利用 DNS 可以提升上网速度，避免网络劫持，提高安全性。这里分享一下最近收集的公共 DNS。

## 国内（可能有污染）

- 腾讯：udp://119.29.29.29
- 阿里：udp://223.6.6.6
- 114：udp://114.114.114.114
- 运营商: 建议自行查询就近的 dns,宽带配好后在 wan 口配置应该可以直接看到.

国内的不多说，虽然有污染存在，但胜在速度快，为了不浪费速度快这个优势，建议还是选择 udp 连接方式。

## 国外（及国内无污染）

- 谷歌：
  - tls://dns.google:853
  - tls://8.8.8.8:853
  - udp://[2001:4860:4860::8888]
  - udp://[2001:4860:4860::8844]
- cloudflare:
  - <https://dns.cloudflare.com/dns-query>
  - <https://1.1.1.1/dns-query>
- iij(日本): <https://public.dns.iij.jp/dns-query>
- tiar(日本)
  - <https://jp.tiar.app/dns-query>
  - <https://jp.tiarap.org/dns-query>
  - tls://dot.tiar.app
- twnic(台湾): <https://dns.twnic.tw/dns-query>
- apple: <https://doh.dns.apple.com/dns-query>
- quad9: <https://dns.quad9.net/dns-query>
- opendns: <https://doh.opendns.com/dns-query>
- [MoeDNS(国内无污染)](https://t.me/s/NyarimeW?before=3980): quic://pdns.itxe.net:853
- [产品人笔记(国内无污染)](https://apad.pro/dns-doh/): <https://doh.apad.pro/dns-query>

国外以及无污染 dns 最好还是选择 tls 或者 https 连接方式，避免被劫持，就算想要使用 udp,也最好是使用 ipv6 地址，猜测可能污染会少些。

尽量使用大公司的 dns,大公司的 dns 服务器通常会遍布各个国家和地区，这样在使用代理时也会自动访问就近的 dns 服务器，免得代理自动切换到日本，dns 还是新加坡的，这就尴尬了。

如此多的公共 dns 服务器，想原生充分利用几乎是不可能的，推荐配置 smartdns/mosdns + 梯子 进行分流,smartdns 全走国内,置为国内分流的上游 dns,国外 dns 置为国外分流的上游 dns,软件支持的话建议开启并行查询.
