const webpack = require('webpack');
const _ = require('lodash');
const glob = require('glob');
const paths = require('path');
const fs = require('fs');
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// const userConfig = require('./gulp-config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const md5File = require('md5-file');
// const AppCachePlugin = require('appcache-webpack-plugin');
const { sep } = paths;
/**
 * 这里的配置去看webpack的文档吧~
 */
class WebpackGe {
    constructor(props) {
        const { path, userConfig, watch = true } = props;
        const entryArr = glob.sync(`${path}/${userConfig.src.js}/**/*.js`);
        const _entry = {};
        for (const item of entryArr) {
            const _name = item.match(/entry[\/\\](.+).js/)[1];
            _entry[_name] = item;
        }
        this.entry = _entry;
        this.output = {
            // path: `${__dirname}/${userConfig.dist.build}`
            publicPath: './',
            // filename: 'bundle.js',
            // filename: '[name].js',
            // path: paths.resolve(__dirname, 'dist')
            path: userConfig.dist.path
        };
        this.externals = {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react-router': 'ReactRouter',
            zepto: '$',
            jquery: '$',
            systemjs: 'SystemJS',
            antd: 'antd',
            mobx: 'mobx',
            'mobx-react': 'mobxReact',
            'mobx-react-devtools': 'mobxDevtools',
            mock: 'Mock',
            'fed-const': 'fedConst',
            'react-router-dom': 'ReactRouterDOM',
            'debug-tool': 'debugTool'
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
            })
            // require('precss'),
            // autoprefixer({ browsers: ['> 1%', 'last 5 versions'] })
        ];
        // this.stats = 'normal';
        if (watch) {
            this.watch = true;
            this.watchOptions = {
                aggregateTimeout: 300,
                poll: 1000,
                ignored: /node_modules/
            };
        }
        // this.devServer = {
        //     // contentBase: paths.resolve(devServerPath, './dist'),
        //     // compress: true,
        //     port: 9000
        // };
    }
}
const jsRules = ({ userConfig }) => ({
    test: /\.(js|jsx)$/i,
    exclude: /node_modules/,
    use: {
        loader: 'babel-loader',
        options: {
            presets: [
                // 'es2017',
                [
                    '@babel/env',
                    {
                        targets: {
                            ie: 10,
                            browsers: userConfig.browsers
                        }
                    }
                ],
                '@babel/react'
            ],
            plugins: [
                //Stage0
                '@babel/plugin-proposal-function-bind',
                //Stage1
                '@babel/plugin-proposal-export-default-from',
                '@babel/plugin-proposal-logical-assignment-operators',
                ['@babel/plugin-proposal-optional-chaining', { loose: false }],
                ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
                [
                    '@babel/plugin-proposal-nullish-coalescing-operator',
                    { loose: false }
                ],
                '@babel/plugin-proposal-do-expressions',
                //Stage2
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                '@babel/plugin-proposal-function-sent',
                '@babel/plugin-proposal-export-namespace-from',
                '@babel/plugin-proposal-numeric-separator',
                '@babel/plugin-proposal-throw-expressions',
                //Stage3
                '@babel/plugin-syntax-dynamic-import',
                '@babel/plugin-syntax-import-meta',
                ['@babel/plugin-proposal-class-properties', { loose: true }],
                '@babel/plugin-proposal-json-strings',
                '@babel/plugin-transform-runtime',
                'lodash'
            ]
        }
    }
});
const lessRules = ({ path, userConfig, projectOtherConfig }) => {
    const autoprefixer = require('autoprefixer')({
        browsers: userConfig.browsers
    });
    return {
        test: /\.(less|css)$/,
        // exclude: /node_modules/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader?sourceMap',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                    plugins: [autoprefixer]
                }
            },
            'less-loader?sourceMap'
        ]
    };
};
/**
 * 打包配置
 */
class Wkcf extends WebpackGe {
    constructor(props) {
        super(props);
        const { path, userConfig, projectOtherConfig } = props;
        this.module = {
            rules: [
                jsRules(props),
                lessRules(props),
                {
                    test: /\.(jpe?g|png|gif|svg|ico)$/i,
                    use: [`url-loader?limit=1&name=${userConfig.dist.img}/[hash].[ext]`]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [`url-loader?name=font/[hash].[ext]`]
                }
            ]
        };
        // this.devtool = 'eval-source-map';
        this.mode = 'development';
        _.assign(this.output, {
            filename: '[name].js',
            path: paths.resolve(path, '../dist')
        });
        this.plugins = [
            ...this.plugins,
            // new webpack.HotModuleReplacementPlugin(),
            new webpack.DefinePlugin({
                __DEV__: true,
                __PRE__: false,
                __BUILD_EXT__: '""'
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css'
            }),
            // new ExtractTextPlugin('[name].css'),
            ...generateHtml({ path, userConfig }, {
                configJs: './config.js',
                projectOtherConfig,
                minName: ''
            })
        ];
    }
}
class WkcfBuild extends WebpackGe {
    constructor(props) {
        super(props);
        const { path, userConfig, projectOtherConfig } = props;
        this.module = {
            rules: [
                jsRules(props),
                lessRules(props),
                {
                    test: /\.(jpe?g|png|gif|svg|ico)$/i,
                    use: [
                        `url-loader?limit=10000&name=${userConfig.dist.img}/[hash].[ext]`,
                        'img-loader'
                    ]
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: [`url-loader?limit=500000&name=font/[hash].[ext]`]
                }
            ]
        };
        _.assign(this.output, {
            filename: '[name].min.js',
            path: paths.resolve(path, '../dist/min')
        });
        this.mode = 'production';
        this.plugins = [
            ...this.plugins,
            // new webpack.LoaderOptionsPlugin({
            //     minimize: true,
            //     debug: false
            // }),
            new webpack.DefinePlugin({
                __DEV__: false,
                __PRE__: true,
                __BUILD_EXT__: '".min"'
            }),
            new MiniCssExtractPlugin({
                filename: '[name].min.css'
            }),
            ...generateHtml({ path, userConfig }, {
                configJs: './config.min.js',
                projectOtherConfig,
                minName: '.min'
            }, true)
        ];
    }
}
/**
 * 生成html
 */
const oldHtmlMd5 = {};
const generateHtml = ({ path, userConfig }, data = {}, build) => {
    let lists = glob.sync(`${path}/${userConfig.src.js}/**/*.html`);
    if (build) {
        if (!lists.length) {
            lists = glob.sync(`${path}/${userConfig.src.html}/**/*.html`);
        }
    }
    else {
        lists = _.concat([], glob.sync(`${path}/${userConfig.src.html}/**/*.html`), lists);
    }
    return lists.map(item => {
        const itemData = paths.resolve(item);
        const jsPath = paths.resolve(path, userConfig.src.js);
        let name = itemData.split(jsPath)[1];
        if (!name) {
            const htmlPath = paths.resolve(path, userConfig.src.html);
            name = itemData.split(htmlPath)[1];
        }
        return new HtmlWebpackPlugin(_.assign({
            // 根据模板插入css/js等生成最终HTML
            filename: `.${name}`,
            template: item,
            inject: false,
            hash: false,
            minify: {
                // 压缩HTML文件
                removeComments: true,
                collapseWhitespace: false // 删除空白符与换行符
            }
            // excludeChunks: ['config'],
        }, data));
    });
};
/**
 * 递归整合对象
 */
const assignRecursion = (object, ...sources) => {
    for (const item of sources) {
        _.assignWith(object, item, (a, b) => {
            if (typeof b !== 'object') {
                return b;
            }
            return assignRecursion(a, b);
        });
    }
    return object;
};
function function_name(env) {
    const userConfig = require('./gulp-config');
    let { path = '', dev = false, projectOtherConfig = '{}' } = env;
    if (path) {
        if (!path.match(/src[\/\\]?$/)) {
            path = glob.sync(`${path}/**{!node_modules,/${userConfig.src.path}}`, {
                ignore: ['**/node_modules/**'],
                absolute: true
            })[0];
        }
        if (path) {
            const data = {
                path,
                userConfig,
                watch: false,
                projectOtherConfig
            };
            let ThisWebpack;
            if (dev === 'true') {
                ThisWebpack = Wkcf;
            }
            else {
                ThisWebpack = WkcfBuild;
            }
            let _webpackConfig;
            _.forEach(userConfig.src.packconf, item => {
                const ItemConfigName = `${path}/${item}`;
                if (fs.existsSync(ItemConfigName)) {
                    const ItemConfig = require(ItemConfigName);
                    delete require.cache[require.resolve(ItemConfigName)];
                    _webpackConfig = ItemConfig({
                        data: new ThisWebpack(data),
                        build: true,
                        path: data.path,
                        userConfig,
                        packPath: paths.resolve()
                    });
                    return false;
                }
            });
            return _webpackConfig || new ThisWebpack(data);
        }
    }
    console.log('编译地址错误');
}
/**
 * 查询打包配置
 */
function_name.getPackPlugins = data => new Wkcf(data);
/**
 * 查询build配置
 */
function_name.getPackPluginsBuild = data => new WkcfBuild(data);
module.exports = function_name;
