module.exports = {
  title: 'Mitsuki-Core官方文档',
  description: '在这里你可以了解到Mitsuki-core这个项目的一切。',
  themeConfig: {
    logo: '/assets/img/logo.jpg',
    nav: [
      { text: '主页', link: '/' },
      { 
        text: '教程',
        items: [
          { text: '关于Mitsuki-Core', link: '/about' },
          { text: '介绍', link: '/language/japanese/' },
          { text: '快速上手', link: '/language/japanese/' },
          { text: '理解Mitsuki-Core', link: '/language/japanese/' },
          { text: '开发指南', link: '/language/japanese/' },
        ],
      },
      { text: '视频教程', link: 'https://google.com' },
    ],
    sidebar: [
      ['/','首页'],
      '/page-a',
      // ['/page-b','特性']
    ],
    displayAllHeaders: true,
    lastUpdated: 'Last Updated', // string | boolean
    smoothScroll: true,
  }
}