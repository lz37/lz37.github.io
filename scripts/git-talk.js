hexo.extend.filter.register(
  'before_generate',
  () => {
    hexo.log.info('传入 Gitalk 私密参数')
    hexo.theme.config.gitalk.client_id = process.env.gitalk_id
    hexo.theme.config.gitalk.client_secret = process.env.gitalk_secret
  },
  0,
)
