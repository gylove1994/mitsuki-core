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
          { text: '开始之前', link: '/beforeStart' },
          { text: '介绍', link: '/introduction' },
          { text: '快速上手', link: '/handsOn' },
          { text: '理解Mitsuki-Core', link: '/understand' },
          { text: '开发指南', link: '/language/japanese/' },
        ],
      },
      { text: '视频教程', link: 'https://google.com' },
    ],
    sidebar: [
      ['/','首页'],
      '/beforeStart',
      '/introduction',
      '/handsOn'
    ],
    displayAllHeaders: true,
    lastUpdated: 'Last Updated', // string | boolean
    smoothScroll: true,
  },
  base: '/mitsuki-core/',
}