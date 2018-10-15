let path = require('path');
const _path = path.resolve(__dirname, 'project'); // 项目目录
// const _path = path.resolve(__dirname, '../kook-web-fed'); // 项目目录

module.exports = {
  path: _path,
  webpackConfig: path.resolve(__dirname, 'webpack.production.js'), // 共用webpack配置
  browsers: ['> 1%', 'last 5 versions'],
  modules: ['js', 'less', 'img'], // 查找资源的目录相对于 src中的path地址
  src: {
    path: 'src', // 目录地址(与src同级
    js: 'js/entry', // 需要编译的js目录
    css: 'less/pages', // 需要编译的样式目录
    html: 'pages', // 需要编译的html目录
    packconf: ['packconf/config.js', '../packconf/config.js'] // 项目独立webpack配置
  }, // 源码目录名
  dist: {
    // 产出配置
    path: 'dist', // 目录地址(与src同级
    // build: 'build', // htmljs和css目录
    // html: '.',
    img: 'img' // img目录
  },
  // 本地服务配置
  connect: {
    host: '0.0.0.0',
    root: _path,
    port: 8081,
    livereload: true
    // https: true
  }
};
