---
title: Hello World
categories: etc
tags:
  - Blog
  - Hexo
  - NodeJs
  - Python
description: Hello World + README
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
sticky: 100
---

## Blog 3.0

老博客地图：<https://lz38.github.io/>

上手了一些前端（与 NodeJs）项目，越发的觉得第二版博客费拉不堪，改用 pnpm 都做不到（npm 和 yarn 简直就是无底洞），于是决定重构博客。

本篇文章不详细介绍重构的内容，只是简单的介绍一下博客的使用方法。

## hexo 博客的搭建

[hexo 官网链接](https://hexo.io/zh-cn/)

安装 nodejs、git,不细说，建议用 linux 或者 wsl（这里建议 archwsl），内存不够上不了 wsl 就推荐 scoop 包管理器吧，非常不建议 msys2 等 mingw 方案，天天报 bug。搞不了 wsl 也不想用 powershell 建议双系统。

老博客记录的搭建过程，看看就好，这个没有难度

```bash
npm install hexo-cli -g # 全局安装hexo脚手架
hexo init blog # 生成博客文件夹，blog可以换成任何一个你喜欢的名字，以后也可以换
cd blog # 进入blog文件夹，blog要与上方文件夹名一致
npm install # 安装hexo依赖
hexo server # 生成静态网页预览
```

一些 hexo 命令：

```bash
hexo clean # 清除本地静态文件
hexo generate # 生成静态文件
hexo deploy # 将静态文件上传到服务器
hexo server # 开启服务器，你可以使用这个命令在本地预览博客，很少有人真的用这个命令在服务器上跑
```

以上命令可以简化成

```bash
hexo cl
hexo g
hexo d
hexo s
```

**一般不用**，直接在 package.json 里写脚本更符合我的习惯，也就添加新功能调试的时候用用。

脚本他不香吗：

```json
{
  // ...
  "scripts": {
    "prepare": "husky install",
    "build": "hexo generate",
    "clean": "hexo clean",
    "deploy": "hexo deploy",
    "server": "hexo server",
    "lint-staged": "lint-staged"
  }
  // ...
}
```

husky 配合 github action 配合自己写写的 hexo 小扩展不要太舒服，比 2.0 搞的一键 python 脚本香多了。

之前写的一键脚本，不嫌弃的话就用用吧。

```python
import time
import os
import re
from git import Repo


def time_stamp_to_time(timestamp):
    time_struct = time.localtime(timestamp)
    return time.strftime('%Y-%m-%d %H:%M:%S', time_struct)


def time_to_time_stamp(_time):
    time_struct = time.strptime(_time, '%Y-%m-%d %H:%M:%S')
    return int(time.mktime(time_struct))


def get_file_modify_time(file_path):
    t = os.path.getmtime(file_path)
    return time_stamp_to_time(t)


def get_file_head_time(file_path):
    f = open(file_path, 'r', encoding='utf-8')
    lines = f.readlines()
    # 遍历lines, 找出第一个updated
    for line in lines:
        if 'updated' in line:
            # 提取时间戳
            updated_time = line.replace('updated: ', '')
            updated_time = updated_time.replace('\n', '')
            # 正则判断是否符合%Y-%m-%d %H:%M:%S格式
            if not re.match(r'^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$', updated_time):
                updated_time = '1970-01-01 00:00:00'
            break
    f.close()
    return updated_time


def update_head_time(file_path, time):
    f = open(file_path, 'r', encoding='utf-8')
    lines = f.readlines()
    # 遍历lines, 找出第一个updated
    for line in lines:
        if 'updated' in line:
            lines[lines.index(line)] = 'updated: ' + time + '\n'
            # 写入文件
            f = open(file_path, 'w', encoding='utf-8')
            f.writelines(lines)
            f.close()
            break
    f.close()


now_time = time_stamp_to_time(time.time())
repo = Repo('.')
# 获取git状态
status = repo.git.status('--porcelain', '--untracked-files=all')
for line in status.split('\n'):
    # 获取文件名
    file_name = str(line[3:])
    if re.search(r'source(/|\\)_posts', line) is not None:
        update_head_time(file_name, now_time)
        print('\033[0;31m update head time:\033[0m ' + file_name)
repo.git.add('.')
repo.git.commit('-m', now_time)
repo.git.push()
os.system('hexo clean')
os.system('hexo generate')
os.system('gulp build')
os.system('hexo deploy')
```

顺带一提，自动更新创建时间和更新时间只要安装`hexo-filter-date-from-git`这个包就可以。

```python
os.system('hexo clean')
os.system('hexo generate')
os.system('gulp build')
os.system('hexo deploy')
```

这一大串也只要写在 github action 里就行了，`git push`后自动构建。
