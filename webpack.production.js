
let _ = require('lodash');
let glob = require('glob');
let paths = require('path');
let webpack = require('webpack');
let userConfig = require('./gulp-config');
let autoprefixer = require('autoprefixer')({ browsers: userConfig.browsers });

let ExtractTextPlugin = require('extract-text-webpack-plugin');

let HtmlWebpackPlugin = require('html-webpack-plugin');
let md5File = require('md5-file');

// let cssExtractor = new ExtractTextPlugin('[name].css');

// function MyPlugin(options) {
//   // Configure your plugin with options... 
// }
 
// MyPlugin.prototype.apply = function(compiler) {
//   // ... 
//   compiler.plugin('compilation', function(compilation) {
//     compilation.plugin('html-webpack-plugin-alter-asset-tags', function(htmlPluginData, callback) {
//         // console.log(htmlPluginData.plugin.assetJson)
//       // console.log(htmlPluginData.plugin.options.assetJson)
//       htmlPluginData.plugin.assetJson[0] = './';
//       callback(null, htmlPluginData);
//     });
//   });
 
// };

// var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin')
// var ImageminPlugin = require('imagemin-webpack-plugin').default

/**
 * 共用打包配置构造函数
 */
class WebpackGe {
    constructor ({path}) {
        this.entry = {};
        this.output = {
            filename: `[name].js`,
            // path: `${__dirname}/${userConfig.dist.build}`
            publicPath: `./`
        };
        this.externals = {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react-router': 'ReactRouter',
            'zepto': '$',
            'jquery': '$',
            'systemjs': 'SystemJS',
            'kook-ui': 'kookUi',
            'antd': 'antd',
            'mobx': 'mobx',
            'mobx-react': 'mobxReact',
            'mobx-react-devtools': 'mobxDevtools'
        };
        this.resolve = {
            modules: [
                paths.resolve(__dirname, 'node_modules'),
                path,
                ..._.map(userConfig.modules, item => paths.join(path, item))
            ]
        };
        this.plugins = [
            new webpack.DefinePlugin({
                __BUILD_PATH__: '"./"'
            }),
            // require('precss'),
            // autoprefixer({ browsers: ['> 1%', 'last 5 versions'] })
        ]
    }
}
/**
 * 打包配置
 */
let wkcf = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: [
                            // ['env',
                            //     {
                            //         "targets": {
                            //            "browsers": userConfig.browsers
                            //         }
                            //     }
                            // ],
                            'es2015',
                            'stage-0',
                            'react'
                        ],
                      plugins: [
                            // "react-hot-loader/babel",
                            'transform-runtime', 
                            'transform-es2015-typeof-symbol', 
                            'transform-decorators-legacy', 
                            'lodash'
                        ]
                    }
                }
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader?sourceMap',
                        {
                            loader:'postcss-loader',
                            options: {
                              plugins: [
                                autoprefixer
                              ]
                            }
                        },
                        'less-loader?sourceMap',
                        ],
                    allChunks: true
                })
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [`url-loader?limit=10000&name=${userConfig.dist.img}/[hash].[ext]`]
            }
        ]
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: true,
            __PRE__: false,
            __BUILD_EXT__: '""',
        }),
        new ExtractTextPlugin(`[name].css`)
        
    ]
};

/**
 * build打包配置
 */
let wkcfBuild = {
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: [
                            // ['env',
                            //     {
                            //         "targets": {
                            //            "browsers": userConfig.browsers
                            //         }
                            //     }
                            // ],
                            'es2015',
                            'stage-0',
                            'react'
                        ],
                      plugins: [
                            // "react-hot-loader/babel",
                            'transform-runtime', 
                            'transform-es2015-typeof-symbol', 
                            'transform-decorators-legacy', 
                            'lodash'
                        ]
                    }
                }
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader',
                        {
                            loader:'postcss-loader',
                            options: {
                                plugins: [
                                    autoprefixer
                                ]
                            }
                        },
                        'less-loader',
                        ],
                    allChunks: true
                })
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                    `url-loader?limit=10000&name=${userConfig.dist.img}/[hash].[ext]`,
                    'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=true'
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: false,
            __PRE__: true,
            __BUILD_EXT__: '".min"',
        }),
        new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                except: ['jQuery']
            }
        }),
        new ExtractTextPlugin(`[name].min.css`),
    ]
};
/**
 * 生成html
 */
let oldHtmlMd5 = {};
let generateHtml = (path, configJs) => {
    let lists = glob.sync(path + '/' + userConfig.src.html + '/*.html');
    // 过滤掉没有改变的html
    lists = _.filter(lists, (item) => {
        let htmlMd5 = md5File(item);
        if(oldHtmlMd5[item] != htmlMd5){
            oldHtmlMd5[item] = htmlMd5;
            return true;
        }
    })

    return lists.map((item) => {
        let name = item.split(userConfig.src.html)[1];
        return new HtmlWebpackPlugin({                        // 根据模板插入css/js等生成最终HTML
            filename: `.${name}`,    // 生成的html存放路径，相对于 path
            template: item,    // html模板路径
            inject: false,    // 允许插件修改哪些内容，包括head与body
            hash: false,    // 为静态资源生成hash值
            minify: {    // 压缩HTML文件
                removeComments: true,    // 移除HTML中的注释
                collapseWhitespace: false    // 删除空白符与换行符
            },
            excludeChunks: ['config'],
            configJs
        });
    });
};
/**
 * 递归整合对象
 */
let assignRecursion = (object, ...sources) => {
    for (let item of sources) {
        _.assignWith(object, item, (a, b) => {
            if (typeof b !== 'object') {
                return b;
            } else {
                return assignRecursion(a, b);
            }
        });
    }
    return object;
};
/**
 * 查询打包配置
 */
let getPackPlugins = ({path}) => {
    let _webpack = new WebpackGe({path});
    let configJs = `./config.js`;
    // console.log(path,paths.resolve(__dirname, 'node_modules'))
    _webpack = assignRecursion(_webpack, wkcf, {
        output: {
            path: paths.join(path, '/../dist')
        },
        plugins: [
            ...wkcf.plugins,
            ...generateHtml(path,configJs)
        ]

    });
    return _webpack;
};
/**
 * 查询build配置
 */
let getPackPluginsBuild = ({path}) => {
    let _webpack = new WebpackGe({path});
    let configJs = `./config.min.js`;
    _webpack = assignRecursion(_webpack, wkcfBuild, {
        output: {
            filename: `[name].min.js`
        },
        plugins: [
            ...wkcfBuild.plugins,
            ...generateHtml(path,configJs)
        ]
    });
    return _webpack;
};
module.exports = {
    getPackPlugins,
    getPackPluginsBuild
};
