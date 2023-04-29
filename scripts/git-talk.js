hexo.extend.filter.register(
  'before_generate',
  () => {
    hexo.theme.config.gitalk.client_id = process.env.gitalk_id
    hexo.theme.config.gitalk.client_secret = process.env.gitalk_secret
  },
  0,
)
