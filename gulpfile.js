// 引入 gulp
// 俺就是任性就是不写注释
let gulp = require('gulp');
let _ = require('lodash');
let fp = require('lodash/fp');
let paths = require('path');
let glob = require('glob');
let connect = require('gulp-connect');
const log = require('fancy-log');
const c = require('ansi-colors');
let webpack = require('webpack');

// let md5File = require('md5-file');
let fs = require('fs');

let { sep } = paths;
// 引入配置
let userConfig = require('./gulp-config');

let webpackConfig = require(userConfig.webpackConfig);
const { getPackPlugins, getPackPluginsBuild } = webpackConfig;
// 配置目录
let web = ({ path, name, build, all }) => {
  console.log(`启动项目${path}`);
  // 判断使用配置数据
  let _webpackConfig = [];
  if (all) {
    _webpackConfig = [
      {
        conf: getPackPlugins({ path, userConfig }),
        build: false
      },
      {
        conf: getPackPluginsBuild({ path, userConfig }),
        build: true
      }
    ];
  } else if (build) {
    _webpackConfig = [
      {
        conf: getPackPluginsBuild({ path, userConfig }),
        build: true
      }
    ];
  } else {
    _webpackConfig = [
      {
        conf: getPackPlugins({ path, userConfig }),
        build: false
      }
    ];
  }
  // let _webpackConfig = build ? getPackPluginsBuild({ path, entry: _entry }) : getPackPlugins({ path, entry: _entry });
  // 项目配置
  _.forEach(userConfig.src.packconf, item => {
    let ItemConfigName = paths.resolve(path, item);
    if (fs.existsSync(ItemConfigName)) {
      let ItemConfig = require(ItemConfigName);
      delete require.cache[require.resolve(ItemConfigName)];
      _webpackConfig = _.map(_webpackConfig, item =>
        _.assign(
          ItemConfig({
            data: item.conf,
            build: item.build,
            path,
            userConfig,
            packPath: paths.resolve()
          })
        )
      );
      return false;
    }
  });
  // console.log(_webpackConfig)
  // webpack(_webpackConfig);
  // appExpress.use(webpackDevMiddleware(webpack(_webpackConfig), {
  //     publicPath: '/'
  // }));
  // console.log(_webpackConfig)
  // webpackStream(_webpackConfig, webpack)

  return new Promise((resolve, reject) => {
    const _resolve = fp.debounce(500, () => {
      gulp.src('/').pipe(connect.reload());
    });
    webpack(_webpackConfig[0], function(err, stats) {
      if (err) throw new Error(err);
      let rendering = c.green;
      if (stats.hasErrors()) {
        rendering = c.red;
      } else if (stats.hasWarnings()) {
        rendering = c.yellow;
      }
      log(`-----webpack:(${path})\n`, stats.toString({ colors: true }));
      log(rendering(`[${path}]--项目编译完成`));

      _resolve();
    });
  });
};

// 系统文件变化事件
const timeoutList = new Map(); // 防止多次保持按键和git更新时
const _change = ({ path, build = false, all = false }) => {
  let [_path, _name] = paths
    .resolve(path)
    .split(sep + userConfig.src.path + sep);
  const key = `${build}${_path}`;
  _path += sep + userConfig.src.path;

  _name = _name.split(sep);
  _name = _name[_name.length - 1];
  if (!timeoutList.has(key)) {
    timeoutList.set(key, true);
    web({
      path: _path,
      name: _name,
      build,
      all
    }).catch(() => {
      timeoutList.delete(key);
    });
  }
};
// 本地服务
gulp.task('connect', done => {
  connect.server({
    middleware: function(connect, options, next) {
      return [
        function(req, res, next) {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader(
            'Access-Control-Allow-Methods',
            'GET,PUT,POST,DELETE,OPTIONS'
          );
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          return next();
        }
      ];
    },
    ...userConfig.connect
  });
  done();
});
// 开始监听
gulp.task('go', done => {
  const matches = glob.sync(
    `${userConfig.path}/**/{!node_modules,${userConfig.src.path}/${
      userConfig.src.js
    }/**/*.*}`
  );
  let _watch = gulp.watch(matches);
  // let _watch = gulp.watch(`${userConfig.path}/**/${userConfig.src.path}/${userConfig.src.js}/**/*.*`);
  _watch.on('change', path => {
    // _change({ event });
    _change({ path });
  });
  done();
});
// 开始监听（压缩
gulp.task('build', done => {
  const matches = glob.sync(
    `${userConfig.path}/**/{!node_modules,${userConfig.src.path}/${
      userConfig.src.js
    }/**/*.*}`
  );
  let _watch = gulp.watch(matches);
  // let _watch = gulp.watch(`${userConfig.path}/**/${userConfig.src.path}/${userConfig.src.js}/**/*.*`);

  _watch.on('change', path => {
    _change({ path, build: true });
  });
  done();
});

// 开始监听 (压缩和非压缩)
gulp.task('all', gulp.parallel('connect', 'go', 'build', done => done()));

// 监听文件变化
gulp.task('default', gulp.parallel('connect', 'go', done => done()));
