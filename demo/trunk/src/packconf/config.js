let fs = require('fs');
let paths = require('path');
let _ = require('lodash');

let itemWebConfig = {
    go: paths.resolve(__dirname, 'webpackConfig.js'),
    build: paths.resolve(__dirname, 'webpackConfig-build.js')
};
/**
 * 最后配置
 */
function Last({data, build, path}) {
    // 判断是否存在当前项目配置
    if (!build && fs.existsSync(itemWebConfig.go)) {
        return require(itemWebConfig.go);
    } else if (fs.existsSync(itemWebConfig.build)) {
        return require(itemWebConfig.build);
    }
    /**
     * 多项目情况-----------------------------------------
     * */
    // let entry = [
    //     'main',
    // ];
    // _.map(entry,(item) => {
    //     return {
    //         [item]: data.entry[item]
    //     }
    // });
    // data.entry = {...entry};

    // data.resolve.modules.push(...userConfig.modules)
    /**
     * ------------------------------------------------
     * */
    // 添加目录拷贝
    let _copyList = Copy(path, build);
    if (_copyList) {
        data.plugins.push(_copyList);
    }

    // data.output.library = 'kookUi'; // 输出到全局的名称
    // data.output.libraryTarget = 'umd'; // 输出方式

    return data;
}

let CopyWebpackPlugin = require('copy-webpack-plugin');
/**
 * 拷贝的目录
 */
function Copy(path, build) {
    let _data = [];
    let _pa = paths.resolve(path + `/../dist${build ? '/min': ''}/systemjs`);
    if (!fs.existsSync(_pa)) {
        _data.push({ context: 'node_modules/systemjs/dist', from: '*', to: 'systemjs' });
    }
    _data.push({ context: `${path}/js/config/lang`, from: '**', to: 'lang' });

    return new CopyWebpackPlugin(_data);
}

module.exports = Last;
