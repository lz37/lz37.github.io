---
title: 使用 DevContainers 愉快地进行容器开发
categories: tech
tags:
  - VSCode
  - DevContainers
  - docker
description: DevContainers 的使用心得，环境为 NixOS 23.05，VSCode 1.78.2, Docker 20.10.23
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

！**注意**：本文初次写于 `2023.07.29` 此时 NixOS 上 docker 版本因由于升级到 go1.20.6，导致 devcontainer 无法正常工作，解决方法为降级 docker 。

_参考 [Docker fails to run containers#Quickfix](https://github.com/NixOS/nixpkgs/issues/244159#issuecomment-1640353626)_

docker 程序正常的用户可以跳过上一步。

## 起因

因为滚挂了 Manjaro，同时 Arch 在安装后因为 zen 内核的原因无法正常使用 Wifi（非 Arch 原因，NixOS 安装 zen 内核也有该问题），所以萌生了润到一个更加稳定的发行版，Gentoo 和 NixOS 都久仰大名，但是 Gentoo 的安装过程太过繁琐，而我想要尽早安装好完事，于是便选择了 NixOS.

总体使用下来，NixOS 不愧于又新又稳，除了 docker 因为其官方的问题存有 Bug 以外，其他方面的完美程度可以说达到了 90%，几乎就是我理想中的发行版。

比如，在 Ubuntu 或者 Manjaro 上，Waydroid 的多窗口模式几乎是依托答辩（以前是这样的，所以我基本就不用多窗口模式了），只要来回切换一次之后，多窗口的标题栏和窗口主体就要分离了，而在 NixOS 上就来回随便切，不怕崩。

又比如，Arch 或者说 Manjaro 上的 Jellyfin Media Player 无法正常连接到服务器，只有 flatpak 下的才可以正常使用，而 NixOS 上的 Jellyfin Media Player 就可以流畅使用。

还有，当我发现 docker 有问题的时候，可以手动将 NixOS 回退一个大版本（指的是 23.05 上的一个大版本，不是 23 回退到 22），往回滚都能不挂，这样的事 Arch 做得到吗.jgp?（说实话，我的 Manjaro 就是因为从 unstable 往 stable 回滚的时候滚挂了一片）

只可惜，它不支持 FHS、也无法正常支持 POSIX.

不支持 FHS 就导致很多开源软件在 NixOS 这里就失去了功能，除非等大佬或者官方适配（还有自己动手），GUI 应用倒还好，但命令行应用诸如 nvm 就无法正常工作，因为这一类 xxx version manager 需要 POSIX 支持。虽然 NixOS 下的 home-manager 确实可以作为一种替代，但 nvm、sdkman、goenv 啥的用了这么久总有路径依赖的问题，而且每次切版本号都要修改配置文件，实在是太麻烦了。

不过好在还有 docker，使用 docker 起一个支持 FHS 的发行版，可以较为轻松地解决这个问题（优不优雅另说:yum:

## Visual Studio Code Dev Containers

The **Dev Containers** extension lets you use a [Docker container](https://www.docker.com/) as a full-featured development environment. Whether you deploy to containers or not, containers make a great development environment because you can:

- Develop with a consistent, easily reproducible toolchain on the same operating system you deploy to.
- Quickly swap between different, separate development environments and safely make updates without worrying about impacting your local machine.
- Make it easy for new team members / contributors to get up and running in a consistent development environment.
- Try out new technologies or clone a copy of a code base without impacting your local setup.
- The extension starts (or attaches to) a development container running a well defined tool and runtime stack. Workspace files can be mounted into the container from the local file system, or copied or cloned into it once the container is running. Extensions are installed and run inside the container where they have full access to the tools, platform, and file system.

You then work with VS Code as if everything were running locally on your machine, except now they are separated inside a container.

_以上内容复制自[官网](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)_

其主要功能就是利用 json + dockerfile 或 docker-compose.yaml(后两个可以都没有) 来构建一个容器，然后在容器内远程运行 VSCode，这样就可以在容器内进行开发，而不用担心环境问题。

这样一来，~~就可以享受到容器里的 FHS 了~~(bushi

这样一来，单独一个项目便可以自成一个环境，而且此环境还可以使用 git 进行备份，共享给团队里的其他人，真正做到了项目级别的环境同步。

## 使用

### 安装

#### 官方模板

可以按下 `F1` 输入 `Dev Container: Try a Dev Container Sample...` 来尝试官方提供的模板，先试用下，但这里的模板不太好用于实际开发，因为本地的项目没有和他们进行绑定。

#### 官方模板（进阶）

按下 `F1` 输入 `Dev Container: Add Dev Container Configuration Files...` 从官方给的项目中进行组合，适配到自己当前的项目环境。

组合一般是基础系统（单选）+ 软件包（多选）+ 各个软件包配置三个阶段进行排列组合，注意软件包和软件包之间可能存在冲突，比如 `Nodejs` 和 `zsh`，所以在选择安装的软件包的时候不要贪心，能够覆盖到当前项目要用到的就行。

最后应该会在项目当前的目录下生成一个 `.devcontainer` 文件夹，里面包含了 `devcontainer.json` 文件。

比如我使用 `Debian` + `Nodejs` 两者进行组合，最后生成的 `devcontainer.json` 文件如下：

```json
// For format details, see https://aka.ms/devcontainer.json. For config options, see the
// README at: https://github.com/devcontainers/templates/tree/main/src/debian
{
  "name": "Debian",
  // Or use a Dockerfile or Docker Compose file. More info: https://containers.dev/guide/dockerfile
  "image": "mcr.microsoft.com/devcontainers/base:bullseye",
  "features": {
    "ghcr.io/devcontainers/features/node:1": {
      "nodeGypDependencies": true,
      "version": "lts"
    }
  }

  // Features to add to the dev container. More info: https://containers.dev/features.
  // "features": {},

  // Use 'forwardPorts' to make a list of ports inside the container available locally.
  // "forwardPorts": [],

  // Configure tool-specific properties.
  // "customizations": {},

  // Uncomment to connect as root instead. More info: https://aka.ms/dev-containers-non-root.
  // "remoteUser": "root"
}
```

#### 自定义

没搞 dockerfile 和 docker-compose 啥啥啥的，以后再说吧。。。

### 配置

#### 代理

如果要想开发容器的内部使用主机代理的话，可以进行如下配置：

```json
{
  "runArgs": ["--network=host"],
  "containerEnv": {
    "HTTP_PROXY": "http://127.0.0.1:7890",
    "HTTPS_PROXY": "http://127.0.0.1:7890"
  }
}
```

简单来说就是让容器以 host 网络模式跑起来，这样就可以通过 127.0.0.1 访问到主机了，从而可以连接到主机的代理端口。

Windows 和 MacOS 下的话就不清楚了，毕竟 Windows 和 MacOS 的 docker 跑不了 host 模式

#### 挂载

挂载分为两个格式：

```json
{
  "mounts": [
    // 对象格式
    {
      "source": "${localEnv:HOME}/.ssh",
      "target": "/home/vscode/.ssh",
      "type": "bind"
    },
    {
      "source": "${localEnv:HOME}/.wakatime.cfg",
      "target": "/home/vscode/.wakatime.cfg",
      "type": "bind"
    },
    {
      "source": "${localEnv:HOME}/.local/share/pnpm/store/v3",
      "target": "/workspaces/lz37.github.io/.pnpm-store/v3",
      "type": "bind"
    },
    // 字符串格式
    "source=${localEnv:HOME}/.ssh,target=/home/vscode/.ssh,type=bind,consistency=cached",
    "source=${localEnv:HOME}/.wakatime.cfg,target=/home/vscode/.wakatime.cfg,type=bind,consistency=cached",
    "source=${localEnv:HOME}/.local/share/pnpm/store/v3,target=/workspaces/lz37.github.io/.pnpm-store/v3,type=bind,consistency=cached"
  ]
}
```

对象格式和字符串格式都是可以的，一般建议需要挂载 `.ssh`。

用到什么包管理的话建议把包管理的缓存目录也挂载进去，这样可以加快包的安装速度。

#### 运行命令

devcontainer.json：

```json
{
  "postCreateCommand": "/workspaces/lz37.github.io/.devcontainer/postCreateCommand"
}
```

postCreateCommand：

```bash
#!/bin/bash
git config --global user.name "xxx"
git config --global user.email "xxx@xxx.com"
```

这也可以进行 git 设置，但多人协作的时候还是不建议这样做，至少也得用 gitignore 忽略掉这个文件。

不过能够运行命令就意味着可以整很多花活，有兴趣的可以自行研究。

#### 全局配置

我用到的全局配置如下

```json
{
  "dev": {
    "containers": {
      "cacheVolume": true,
      "copyGitConfig": true, // 默认只会复制 .gitconfig 文件，所以位置不为默认的话需要手动ln一下
      "defaultExtensions": [
        // 默认安装的插件，需要填写插件id
        "streetsidesoftware.code-spell-checker",
        "naumovs.color-highlight",
        "GitHub.vscode-github-actions",
        "GitHub.copilot",
        "eamodio.gitlens",
        "oderwat.indent-rainbow",
        "yzhang.markdown-all-in-one",
        "shd101wyy.markdown-preview-enhanced",
        "DavidAnson.vscode-markdownlint",
        "christian-kohler.path-intellisense",
        "esbenp.prettier-vscode",
        "WakaTime.vscode-wakatime",
        "redhat.vscode-xml",
        "redhat.vscode-yaml"
      ],
      "mountWaylandSocket": false
    }
  }
}
```

只弄懂了其中的几个选项，这里权当提供参考

以上就是我对 vscode `DevContainers` 插件的使用心得，希望对你有所帮助 :kissing_heart:
