module.exports = {
    path: __dirname + '/kook-fed', // 项目目录
    src: {
        path: 'src', // 目录地址(与src同级
        js: 'js/entry', // 需要编译的js目录
        css: 'less/pages', // 需要编译的样式目录
        html: 'pages' // 需要编译的html目录
    },    // 源码目录名
    dist: { // 产出配置
        path: 'dist', // 目录地址(与src同级
        build: 'build', // js和css目录
        html: '..',
        img: 'img' // 相对于 build 目录
    }
}
