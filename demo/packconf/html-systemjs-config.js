/**
 * 为html中生成 systemJSConfig 字段内容
 */
const _ = require('lodash');

module.exports = class {
    apply(compiler) {
        compiler.plugin('compilation', function(compilation) {
            compilation.plugin('html-webpack-plugin-before-html-generation', (htmlPluginData, callback) => {
                const systemJSConfig = {
                    map: {},
                    meta: {
                        '*': {
                            format: 'global'
                        }
                    }
                };
                _.forEach(htmlPluginData.assets.chunks, (item, key) => {
                    const _key = `_${key}`;
                    systemJSConfig.map[_key] = `${item.entry}?${item.hash}`;
                    systemJSConfig.meta[_key] = {};
                    systemJSConfig.meta[_key].depsCss = _.map(item.css, cssItem => `${cssItem}?${htmlPluginData.plugin.childCompilerHash}`);
                });
                htmlPluginData.plugin.options.systemJSConfig = systemJSConfig;
                if (_.isFunction(callback)) callback(null, htmlPluginData);
                return htmlPluginData;
            });
        });
    }
};
// MyPlugin.prototype.apply = function (compiler) {
//     compiler.plugin('compilation', (compilation) => {
//       console.log('The compiler is starting a new compilation...');
  
//       compilation.plugin(
//         'html-webpack-plugin-before-html-processing',
//         (data, cb) => {
//           data.html += 'The Magic Footer'
  
//           cb(null, data)
//         }
//       )
//     })
//   }