/**
 * 为html中生成 systemJSConfig 字段内容
 */
const _ = require('lodash');

const cssTemplate = _.template(
  '<link type="text/css" rel="stylesheet" href="<%= url %>" />'
);
const jsTemplate = _.template('<script src="<%= url %>" ></script>');

module.exports = class {
  apply(compiler) {
    compiler.plugin('compilation', function(compilation) {
      compilation.plugin(
        'html-webpack-plugin-before-html-generation',
        (htmlPluginData, callback) => {
          const firstData = _.get(
            htmlPluginData,
            ['assets', 'chunks', _.keys(htmlPluginData.assets.chunks)[0]],
            {}
          );
          // htmlPluginData.plugin.options.addJs = `${firstData.entry}?${firstData.hash}`;
          // { main:
          //     { size: 65965,
          //       entry: './main.js',
          //       hash: 'a33198e9b03567ac6ba4',
          //       css: [ './main.css' ]
          //     }
          // }

          const list = [];
          _.forEach(htmlPluginData.assets.chunks, item => {
            _.forEach(item.css, val => {
              list.push(cssTemplate({ url: `${val}?${item.hash}` }));
            });
            list.push(jsTemplate({ url: `${item.entry}?${item.hash}` }));
          });
          htmlPluginData.plugin.options.addChunk = list.join('');
          if (_.isFunction(callback)) callback(null, htmlPluginData);
          return htmlPluginData;
        }
      );
    });
  }
};
