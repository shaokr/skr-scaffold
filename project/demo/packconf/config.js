const _ = require('lodash');
const fs = require('fs');
const paths = require('path');
const HtmlAddChunkConfig = require('./html-add-chunk-config');

const itemWebConfig = {
  go: paths.resolve(__dirname, 'webpackConfig.js'),
  build: paths.resolve(__dirname, 'webpackConfig-build.js')
};

const CopyWebpackPlugin = require('copy-webpack-plugin');
/**
 * 拷贝的目录
 */
function Copy(path, build) {
  const _data = [];

  _data.push({
    context: `${path}/js/config/lang/data`,
    from: '**',
    to: 'lang'
  });

  return new CopyWebpackPlugin(_data);
}

/**
 * 最后配置
 */
function Last({ data, build, path, userConfig, packPath }) {
  // 判断是否存在当前项目配置
  if (!build && fs.existsSync(itemWebConfig.go)) {
    return require(itemWebConfig.go);
  } else if (fs.existsSync(itemWebConfig.build)) {
    return require(itemWebConfig.build);
  }

  data.resolve.modules.unshift(paths.resolve(__dirname, '../node_modules'));
  // data.resolve.modules.push(...userConfig.modules)
  /**
   * ------------------------------------------------
   * */

  // data.externals[] = '';
  // 添加目录拷贝
  const _copyList = Copy(path, build);
  if (_copyList) {
    data.plugins.push(_copyList);
  }

  data.plugins.push(new HtmlAddChunkConfig());
  // data.output.library = '[name]'; // 输出到全局的名称
  // data.output.libraryTarget = 'umd'; // 输出方式
  return data;
}

module.exports = Last;
