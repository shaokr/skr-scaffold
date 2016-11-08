// 引入 gulp
// 俺就是任性就是不写注释
let gulp = require('gulp')
let _ = require('lodash')
let paths = require('path')
let glob = require('glob')
let connect = require('gulp-connect')

let webpack = require('gulp-webpack')
let {getPackPlugins, getPackPluginsBuild} = require('./webpack.production')

let md5File = require('md5-file')

// 引入配置
let userConfig = require('./gulp-config')

// 配置目录
let web = ({path, name, build = false}) => {
    console.log(`开始编项目${path}`)
    glob(path + '/' + userConfig.src.js + '/*.*', function (er, files) {
        let _entry = {}
        for (let item of files) {
            let _name = item.split(userConfig.src.js + '/')[1].split('.')[0]
            _entry[_name] = item
        }
        let plugins = build ? getPackPluginsBuild({ path }) : getPackPlugins({ path })
        gulp.src(path)
            .pipe(webpack(
                _.assign({}, plugins, { entry: _entry })
            ))
            .pipe(gulp.dest(`${path}/../${userConfig.dist.path}/${userConfig.dist.build}`))
            .pipe(connect.reload())
    })
}

gulp.task('connect', () => {
    connect.server({
        root: userConfig.path,
        livereload: true
    })
})
let _change = ({event, build = false}) => {
    let [_path, _name] = paths.resolve(event.path).split('\\' + userConfig.src.path + '\\')
    _path += '/' + userConfig.src.path

    _name = _name.split('\\')
    _name = _name[_name.length - 1]
    web({
        path: _path,
        name: _name,
        build
    })
}

gulp.task('go', ['connect'], () => {
    let _watch = gulp.watch(`${userConfig.path}/**/${userConfig.src.path}/**/*.*`)

    _watch.on('change', (event) => {
        _change({ event })
    })
})

gulp.task('build', ['connect'], () => {
    let _watch = gulp.watch(`${userConfig.path}/**/${userConfig.src.path}/**/*.*`)

    _watch.on('change', (event) => {
        _change({ event, build: true })
    })
})



// 监听文件变化
gulp.task('default', ['connect', 'go'])

