if(!self.define){let e,i={};const d=(d,a)=>(d=new URL(d+".js",a).href,i[d]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=d,e.onload=i,document.head.appendChild(e)}else e=d,importScripts(d),i()})).then((()=>{let e=i[d];if(!e)throw new Error(`Module ${d} didn’t register its module`);return e})));self.define=(a,c)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(i[r])return;let n={};const b=e=>d(e,r),s={module:{uri:r},exports:n,require:b};i[r]=Promise.all(a.map((e=>s[e]||b(e)))).then((e=>(c(...e),n)))}}define(["./workbox-65248c09"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"2023/hello-world/index.html",revision:"ece059629a919633837755c8cac84e07"},{url:"2023/hexo-压缩页面与其他文件/index.html",revision:"39de86f7d9d9716d1c8755b56f63d9ab"},{url:"2023/hexo-生成-sitemap/index.html",revision:"53c11a0925f44f802a9b91ee1422b8b3"},{url:"2023/hexo中添加emoji支持/index.html",revision:"bbd6cca6c3a00eac1535fcdde470787b"},{url:"2023/hexo构建与部署/index.html",revision:"30cce012f305c20f073ddca90a15a5c2"},{url:"2023/kde-plasma-wayland-使用体验/index.html",revision:"76af6ae36269974c7e58316d335d819e"},{url:"2023/kde-plasma-使用的插件总结/index.html",revision:"992aa7a36b2bf6a9d0464bc793ad4a64"},{url:"2023/kde窗口最大化标题栏与面板“融合”/index.html",revision:"99d43c0eb408c75705d0c2b47da3e387"},{url:"2023/leetcode刷题笔记-2022-05/index.html",revision:"5d0bbb1b08b052a64be97dbd4aca6ea2"},{url:"2023/leetcode刷题笔记-2022-06/index.html",revision:"e810f67083917ca71cbe6934a26cc796"},{url:"2023/leetcode刷题笔记-2022-07-08/index.html",revision:"b19e8f037f6e931f73f9b7e0ca397e9a"},{url:"2023/leetcode刷题笔记-2022-09/index.html",revision:"04ff7195e770b008536c41565f935142"},{url:"2023/leetcode刷题笔记-2022-11/index.html",revision:"a1f99720ed7ef7b7f94d77eed549794b"},{url:"2023/linux增加交换空间/index.html",revision:"fe072bd6a13319ec56320ff0cc627932"},{url:"2023/manjaro-plasma-wayland-下使用腾讯会议/index.html",revision:"397833a0443a19cc1878234dd5eea92a"},{url:"2023/nixos-的-fhs-环境/index.html",revision:"87a06613224bc72c1433e00ec8ef8070"},{url:"2023/nixos下的-devbox-使用/index.html",revision:"d45deca8f811ca7ce92a927d30423a56"},{url:"2023/openwrt-系统-squashfs-固件扩容方法/index.html",revision:"868dd377663d99a946896f41792d9b10"},{url:"2023/scoop-使用总结/index.html",revision:"cdf17c9fae2ae93a91ea5ee606419862"},{url:"2023/smartdns-配合-clash-提升上网速度/index.html",revision:"cc3551353fcf50400f523960d6e86d98"},{url:"2023/truenas-scale-使用-k8s-安装-portainer-管理-docker/index.html",revision:"78b57cc0b26da8c8441ca7cf64b8f108"},{url:"2023/vscode添加对markdown扩展语法的支持/index.html",revision:"8850bf0093f9b726f6d46489632a6775"},{url:"2023/使用-devcontainers-愉快地进行容器开发/index.html",revision:"65b9a0822e2dd320e7738df72271acdc"},{url:"2023/使用-gitalk-开通-hexo-评论/index.html",revision:"8068c54c0c6dd6a48d97521966c1a1aa"},{url:"2023/使用-zerotier-搭建自己的-ipv6-网络/index.html",revision:"848f52cea3b2374035369ed2fae38f06"},{url:"2023/公共-dns-收集总结/index.html",revision:"9683a242e470e3237ab072994255e653"},{url:"2023/利用-docker-部署云手机和碧蓝航线脚本/index.html",revision:"56b8ceb94c81a0ebfabc9afc2ce4a9ae"},{url:"2023/家用-nas-推荐方案/index.html",revision:"921da740e58ca1523365814012b540d1"},{url:"2023/解决-luci-的-samba-插件无法挂载的问题/index.html",revision:"fbb4273335cd4d7a3193260c94030539"},{url:"2023/配置网站域名/index.html",revision:"7a70a4e304d66912f1b9d1ddf7781a34"},{url:"404.html",revision:"7f0040bb00076a7f4c690eefbb8e256c"},{url:"archives/2023/04/index.html",revision:"dcb4b2c3d9041a59718b8223cd827550"},{url:"archives/2023/04/page/2/index.html",revision:"76d610f0ddb23edfd63f9aec04b6b300"},{url:"archives/2023/07/index.html",revision:"bf6149c394a854f9d4a1d07a5f3d775c"},{url:"archives/2023/08/index.html",revision:"a845f69ec0e1968c3f1fd5ff3d45347c"},{url:"archives/2023/09/index.html",revision:"10d2e90f2a66773b699b89427251d34c"},{url:"archives/2023/11/index.html",revision:"4add90cf5a05fcedb6e045b4560678dd"},{url:"archives/2023/index.html",revision:"1f93d9dc5227c7be880513de11b8d2c8"},{url:"archives/2023/page/2/index.html",revision:"72b015c5d8d5477694748bddf6c9f6ec"},{url:"archives/2023/page/3/index.html",revision:"68ef9c0e57aae994f269e72ec68d21c6"},{url:"archives/index.html",revision:"8d678fdab3d114a4e2da78b8909f52d6"},{url:"archives/page/2/index.html",revision:"856a4d11cbb0bbfd33d94e1c2c0fa86c"},{url:"archives/page/3/index.html",revision:"6647fce189ef70f0c7e5e133cab78c00"},{url:"categories/algorithm/index.html",revision:"30dccd5541e5de088d9a8118c2442860"},{url:"categories/beautify/index.html",revision:"e75393018be346d67bf1b5eaf4cf2f96"},{url:"categories/etc/index.html",revision:"ce298c5647b7a02b9d52509e96e32910"},{url:"categories/game/index.html",revision:"c52bb2d3eddca66b9b16308cc4295bfe"},{url:"categories/index.html",revision:"d1967168bc72fa6da3fb2fecf5f5ce8b"},{url:"categories/nas/index.html",revision:"19ceedd1fb0ac90348d25c6baa60e3d6"},{url:"categories/tech/index.html",revision:"a2f5e159c53d125b3f916292a3e0f4da"},{url:"categories/tech/page/2/index.html",revision:"458dd51198bb97bf1a300d4dde7fbc7a"},{url:"css/index.css",revision:"dc995da46180246fca66871971331e8c"},{url:"css/var.css",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"gallery/Archieve.html",revision:"d8f12b2b317fd1384256dc2f2c81765b"},{url:"gallery/index.html",revision:"117fc2f6822febfba36a50827416606c"},{url:"gallery/ヒトこもる.html",revision:"20b29787e41d9af9df70c3e460b267a0"},{url:"icons/android-chrome-144x144.png",revision:"baa86ac76c4b1f0abc7689b231d2e96e"},{url:"icons/android-chrome-192x192.png",revision:"a0600d9130a474a32054fd28a323affa"},{url:"icons/android-chrome-256x256.png",revision:"717165bc189bef5b5486029685e68931"},{url:"icons/android-chrome-36x36.png",revision:"a690a65366238abfa6244096679c5fa7"},{url:"icons/android-chrome-384x384.png",revision:"c9ef447064d87944986c8100e594c347"},{url:"icons/android-chrome-48x48.png",revision:"0fec91517b7466056d5f9bc8b84a970e"},{url:"icons/android-chrome-512x512.png",revision:"b240c5610045aebfa58daa835a190097"},{url:"icons/android-chrome-72x72.png",revision:"c7d34630e9964dd7da5b3d090a2a45bd"},{url:"icons/android-chrome-96x96.png",revision:"07a083bceb79f434d3ec2623be2b0568"},{url:"icons/apple-touch-icon.png",revision:"50ebd2c43b7c659a0d8558258b7f9389"},{url:"icons/favicon-16x16.png",revision:"aa569fc174bfb847622d1119e9ebc088"},{url:"icons/favicon-32x32.png",revision:"a0a6cb79e905a77aabd6d5b4a1bc398c"},{url:"icons/mstile-150x150.png",revision:"4380ed3311b7c7d01c0ef67406eaf12c"},{url:"icons/mstile-310x150.png",revision:"210fa2b10d28110cc55aaa5236c0f7b7"},{url:"icons/mstile-310x310.png",revision:"04a9b0824cdfd03aa84dc02b5870b17f"},{url:"icons/mstile-70x70.png",revision:"03c91a1dd3524636b75e9a7d6fb32346"},{url:"icons/safari-pinned-tab.svg",revision:"6a0917d9d6380cd913ebde94c0a8af54"},{url:"img/404.jpg",revision:"4ef3cfb882b6dd4128da4c8745e9a507"},{url:"img/etc/NixOS的FHS环境-1.png",revision:"07f34386f746d8794828da8c577df9e9"},{url:"img/etc/TrueNAS_SCALE使用K8S安装portainer管理docker-1.png",revision:"63b53d3544bbe36af21d4a3083fe8ca4"},{url:"img/etc/TrueNAS_SCALE使用K8S安装portainer管理docker-2.png",revision:"9722ef8bb279c19da79029760890b39d"},{url:"img/etc/TrueNAS_SCALE使用K8S安装portainer管理docker-3.png",revision:"471fa39e7ce0daef40bb154427333b7a"},{url:"img/etc/TrueNAS_SCALE使用K8S安装portainer管理docker-4.png",revision:"b848f5823b1deb56b6a639421175d102"},{url:"img/etc/使用zerotier搭建自己的IPv6网络-1.png",revision:"d3448d02416eb9c7d120253a72e87b4c"},{url:"img/etc/使用zerotier搭建自己的IPv6网络-2.png",revision:"0aa34b7f167c3feef60e3b2b3f9de0d0"},{url:"img/etc/使用zerotier搭建自己的IPv6网络-3.png",revision:"d4d58a77a3c9290c4ee1226cafc1a9bd"},{url:"img/etc/使用zerotier搭建自己的IPv6网络-4.png",revision:"fab8acf277dda966deb063b9888c4e15"},{url:"img/favicon.png",revision:"7a8c47cb5a2149c1a1af21e90ecd9ca7"},{url:"img/friend_404.gif",revision:"68af0be9d22722e74665ef44dd532ba8"},{url:"img/pixiv/2179695_86142125_p0_羽々斬_自機の人たち.png",revision:"3d20df98a7d0731604284d127e122b7d"},{url:"img/pixiv/29535589_70310588_p0_Archive  里个人存档处_DysonSphere of binary_starsystem.jpg",revision:"42e39802bee8c5c4913a61b68ab7df2b"},{url:"img/pixiv/29535589_72608843_p0_Archive  里个人存档处_( • ̀ω•́ )✧Great Crisis II.jpg",revision:"edff339c63a7148f1ce580509ad471d4"},{url:"img/pixiv/29535589_73139361_p2_Archive  里个人存档处_Ruler of stellar domain.jpg",revision:"0a23bfe4b6aa3de7b445093921497164"},{url:"img/pixiv/29535589_74215883_p0_Archive  里个人存档处_Melody of dream.jpg",revision:"61e1f5c6cf66dec44ba0b351ea819036"},{url:"img/pixiv/29535589_76842811_p0_Archive  里个人存档处_辉珖之朝.jpg",revision:"4fd75af82c513017db257cb2e2b09bce"},{url:"img/pixiv/29535589_78228344_p0_Archive  里个人存档处_清空光露.jpg",revision:"a357637bd8ba5953899dd880884bdb8f"},{url:"img/pixiv/29535589_81095956_p0_Archive  里个人存档处_时域飞渡／Crossing the stellar domain.jpg",revision:"3cdabe75fdf7d267e84d65bd4b3ee9cd"},{url:"img/pixiv/29535589_84295672_p0_Archive  里个人存档处_辉珖突围.jpg",revision:"450db65658ce31adaaf3a75e5070712e"},{url:"img/pixiv/29535589_87376088_p0_Archive  里个人存档处_兔与鸟.jpg",revision:"ad320821419306c19f61c73143bf0aa3"},{url:"img/pixiv/30837811_82882659_p0_ヒトこもる_メイドさん.jpg",revision:"14039a822cdff145243f7971e2eb52cf"},{url:"img/pixiv/30837811_83115950_p0_ヒトこもる_no title.jpg",revision:"145b2f3527a80e622ba0cd72e49b8ceb"},{url:"img/pixiv/30837811_84764299_p0_ヒトこもる_no title.jpg",revision:"c8e367035673de2d6d5023680afeedac"},{url:"img/pixiv/30837811_88427122_p2_ヒトこもる_no title.jpg",revision:"e5545d3e43a13e94e003647bf4e6708b"},{url:"img/pixiv/30837811_89532340_p0_ヒトこもる_🌒.jpg",revision:"9c1ea00cfad12c25b26495743b1bc9b6"},{url:"img/pixiv/30837811_89703294_p0_ヒトこもる_🩸.jpg",revision:"a84861a3ce8ef8a5dd8245907cc8b3e3"},{url:"img/pixiv/30837811_90929970_p0_ヒトこもる_無題.jpg",revision:"96dd36e3a643b5a05b563dc9f4df4492"},{url:"img/pixiv/30837811_94573417_p0_ヒトこもる_祭花.jpg",revision:"3d8ceac4d1e6db41f3a5fecbd67d42bb"},{url:"img/pixiv/30837811_94748376_p0_ヒトこもる_舞獅.jpg",revision:"94f8f525ffb8d8baf9ea5ed79bb38401"},{url:"img/pixiv/30837811_96145490_p0_ヒトこもる_暁旦.jpg",revision:"69bd63c5903c2763fa5196da7a84e43e"},{url:"img/pixiv/30837811_97608845_p0_ヒトこもる_落花.png",revision:"d3f6ffafe4a962977a0eb2299e829b47"},{url:"img/pixiv/30837811_99057205_p1_ヒトこもる_🍊.png",revision:"ac804dec090dbdf2af669dc6a9daf73b"},{url:"index.html",revision:"f7a083191a284b9d8f45fb6c317ac364"},{url:"js/main.js",revision:"92e6abc1f6e39859b521c47a729218ed"},{url:"js/search/algolia.js",revision:"6a7489f53c0444a2ebc1e72d01e5a228"},{url:"js/search/local-search.js",revision:"20fc305dc6ddd13c6ae0c28836fce877"},{url:"js/tw_cn.js",revision:"a603233b64d8f839af4f53cc1ef5706a"},{url:"js/utils.js",revision:"4ac6ab73b303661bc180cc769d0caca4"},{url:"link/index.html",revision:"c653a03660b5e917c452c7e8d146ffa1"},{url:"page/2/index.html",revision:"515cf00eb2861a7f4867c7ae00335b84"},{url:"page/3/index.html",revision:"25a924b1503e2fcb5935e61f1febb019"},{url:"tags/ADB/index.html",revision:"9ee17f90f08ef4074d4dc597f87f1685"},{url:"tags/Alas/index.html",revision:"ee5317e209ac3b5d6b8053308731d139"},{url:"tags/Arch/index.html",revision:"af69c41d1bbd2aaeaf874f6132124068"},{url:"tags/Azur-Lane/index.html",revision:"5b7e13e8aa26eebbb32adf18e4bcd419"},{url:"tags/Blog/index.html",revision:"9d98f93cc2a0cfb610628f16cd31e46b"},{url:"tags/Clash/index.html",revision:"6285e279eb541e0f31bf0acc4e1a26b7"},{url:"tags/DevBox/index.html",revision:"bc0b17441fd34ab501ef96a3965941dd"},{url:"tags/DevContainers/index.html",revision:"1cef0d665aafe33f45701bc54fffc923"},{url:"tags/DNS/index.html",revision:"17ab617081dfb0f4b53cd123584c5d50"},{url:"tags/docker/index.html",revision:"030d4df77d0852896bdd7cf22b82f1df"},{url:"tags/Docker/index.html",revision:"c4f31525de3eca50f2774ff6c2e362cc"},{url:"tags/Domain/index.html",revision:"9bda7ee5b33b91f9cb26d229a97c1cc1"},{url:"tags/Emoji/index.html",revision:"d07d1eae56598200c4b8728a963ec6b5"},{url:"tags/Fcitx5/index.html",revision:"2a559d4b3303a9027d5386dafcf53fb5"},{url:"tags/fdisk/index.html",revision:"764d8b80b921970430515b882e9b9e28"},{url:"tags/Gitalk/index.html",revision:"730f2e9ba4fdc495b5c80c505fe699e7"},{url:"tags/Github-Action/index.html",revision:"579ef5ad2565db80ae8b0f0a7376a248"},{url:"tags/Github/index.html",revision:"02d71a5489424555c1fd62c6fcd0bf85"},{url:"tags/Hexo/index.html",revision:"f88153f23b4758081b12df38a0158393"},{url:"tags/index.html",revision:"a8e6299d30c7bc020e79040b9622834b"},{url:"tags/IPv6/index.html",revision:"75fb56e5cccd9bc42febcc7e152f07dc"},{url:"tags/K8S/index.html",revision:"c33d927e5bbcb1ab7b61c20deff2914a"},{url:"tags/KDE-Plugins/index.html",revision:"3658b1f899b2db9049fc710e38ee6a25"},{url:"tags/KDE/index.html",revision:"fd2b2e2f6c99164c880976e83f4beb49"},{url:"tags/Latte-Dock/index.html",revision:"b2bcb58dfe69972e0ac5b180b6de0822"},{url:"tags/LeetCode/index.html",revision:"89c58c1d29a14c67ab3d7eea28a354c3"},{url:"tags/Linux/index.html",revision:"77a8ea5679f53f5957535f540402346e"},{url:"tags/Manjaro/index.html",revision:"c74c9cefddbd39cfb2b82b92c4eb5c42"},{url:"tags/Markdown/index.html",revision:"b4e23ebdebcdccf71eb4d9e0c042baef"},{url:"tags/Nix/index.html",revision:"890cb201e3bb99eaddce396651c6b0db"},{url:"tags/NixOS/index.html",revision:"c0d5732c9e8ad082d4d4268865615806"},{url:"tags/Nodejs/index.html",revision:"838ae4c69f6025bebe94810969ae8e17"},{url:"tags/NodeJs/index.html",revision:"704e43f2379d4525718c39931cca438b"},{url:"tags/OBS/index.html",revision:"578f8735b2c6e04658a38552fbd0d6f7"},{url:"tags/Openwrt/index.html",revision:"4f9bfa8e19b870b352b5042d6ed2fb81"},{url:"tags/parted/index.html",revision:"6ecac0468a62eba2f20b7cf22d2a7610"},{url:"tags/Plasma/index.html",revision:"2830e6ec51dbec0d1c1c5769c111a4a8"},{url:"tags/Portainer/index.html",revision:"d1293749b2ba74537031fd69d7ebf617"},{url:"tags/Proxmox/index.html",revision:"6e079690c9570f0fa5545e859a9ce196"},{url:"tags/Public-DNS/index.html",revision:"f937812795f738ed1f3898ae07959706"},{url:"tags/Python/index.html",revision:"4d27060b268fc9190e5c4a6989f0ac07"},{url:"tags/Redroid/index.html",revision:"b3784d97a6149c72a12a55105b17c176"},{url:"tags/Samba/index.html",revision:"b7c5064942a946cdc0a8fb37100718a7"},{url:"tags/Scoop/index.html",revision:"c34e7a65059fb4373ae96011805e77e0"},{url:"tags/Scrcpy/index.html",revision:"082d9749272d2e1f549f43c3bee5c0ab"},{url:"tags/Sitemap/index.html",revision:"45a026cc7edcc547610b8549a3c2bf2d"},{url:"tags/SmartDNS/index.html",revision:"62c62ad90807f4f36f1aed6bb7a450bb"},{url:"tags/SquashFS/index.html",revision:"cb1992639a967cff20659591836fa17c"},{url:"tags/Swap/index.html",revision:"c9196717d668188e242151a73c3c679a"},{url:"tags/TrueNAS-SCALE/index.html",revision:"3e57931e33ee8fcf57cbf4c27c8b6c79"},{url:"tags/TrueNas/index.html",revision:"ddc45cd82050c140fdc5b44e66458cea"},{url:"tags/TrueNAS/index.html",revision:"f108f2050d627b8caf684d8314464c08"},{url:"tags/VSCode/index.html",revision:"ed531cbda6141933e69c6661a353e6ca"},{url:"tags/Wayland/index.html",revision:"6f477a232e9ad56ea4508091a782621e"},{url:"tags/Wemeet/index.html",revision:"707fa6fe5190a3280b24caea7cccac31"},{url:"tags/Windows/index.html",revision:"2a092fe5aa7f3f908dd1bebf4dde29f2"},{url:"tags/XML/index.html",revision:"01782cb24b053c9d6c081ec0ba145797"},{url:"tags/ZeroTier/index.html",revision:"e4ef580eefdb97b5709bfac0b443130a"}],{}),e.registerRoute(/^https:\/\/cdn\.jsdelivr\.net\/.*/,new e.CacheFirst,"GET")}));
//# sourceMappingURL=service-worker.js.map
