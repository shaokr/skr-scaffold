// 引入 gulp
// 俺就是任性就是不写注释
let gulp = require('gulp');
let _ = require('lodash');
let paths = require('path');
let glob = require('glob');
let connect = require('gulp-connect');

let webpackStream = require('webpack-stream');
let webpack = require('webpack');

// let md5File = require('md5-file');

let fs = require('fs');
let {sep} = paths;
// 引入配置
let userConfig = require('./gulp-config');
let {getPackPlugins, getPackPluginsBuild} = require(userConfig.webpackConfig);

// 配置目录
let web = ({path, name, build = false}) => {
    console.log(`开始编项目${path}`);
    glob(path + '/' + userConfig.src.js + '/*.*', function (er, files) {
        let _entry = {};
        for (let item of files) {
            let _name = item.split(userConfig.src.js + '/')[1].split('.')[0];
            _entry[_name] = item;
        }

        // 判断使用配置数据
        let plugins = build ? getPackPluginsBuild({ path }) : getPackPlugins({ path });
        let _webpackConfig = _.assign(_.cloneDeep(plugins), { entry: _entry });
        // 项目配置
        let ItemConfigName = `${path}/${userConfig.src.packconf}`;
        if (fs.existsSync(ItemConfigName)) {
            let ItemConfig = require(ItemConfigName);
            delete require.cache[require.resolve(ItemConfigName)];
            _webpackConfig = ItemConfig({
                data: _webpackConfig,
                build,
                path,
                userConfig
            });
        }
        
        gulp.src(path)
            .pipe(webpackStream(_webpackConfig, webpack))
            .pipe(gulp.dest(`${path}/../${userConfig.dist.path}${build?'/min':''}`))
            .pipe(connect.reload());
    });
};
// 本地服务
gulp.task('connect', () => {
    connect.server({
        root: userConfig.path,
        livereload: true,
        middleware: function(connect, options, next) {
            return [
                function(req, res, next) {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
                    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                    return next();
                }
            ];
        }
    });
});

// 系统文件变化事件
let timeoutList = {}; // 防止多次保持按键和git更新时
let _change = ({event, build = false}) => {
    let [_path, _name] = paths.resolve(event.path).split(sep + userConfig.src.path + sep);
    _path += sep + userConfig.src.path;

    clearTimeout(timeoutList[_path]);
    timeoutList[_path] = setTimeout(() => {
        _name = _name.split(sep);
        _name = _name[_name.length - 1];
        web({
            path: _path,
            name: _name,
            build
        });
    }, 500);
};
// 开始监听
gulp.task('go', ['connect'], () => {
    let _watch = gulp.watch(`${userConfig.path}/**/${userConfig.src.path}/**/*.*`);
    _watch.on('change', (event) => {
        _change({ event });
    });
});
// 开始监听（压缩
gulp.task('build', ['connect'], () => {
    let _watch = gulp.watch(`${userConfig.path}/**/${userConfig.src.path}/**/*.*`);

    _watch.on('change', (event) => {
        _change({ event, build: true });
    });
});
// 监听文件变化
gulp.task('default', ['go']);

