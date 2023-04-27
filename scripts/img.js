hexo.extend.filter.register(
  'before_post_render',
  (data) => {
    const categoryPerImg = hexo.theme.config.category_per_img
    if (data.layout === 'post') {
      hexo.log.info(`Generated imgs of ${data.title}`)
      data.cover = categoryPerImg[data.categories.data[0].name]
      data.top_img = categoryPerImg[data.categories.data[0].name]
    }
  },
  0,
)
