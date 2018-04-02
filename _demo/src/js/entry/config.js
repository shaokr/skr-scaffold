/* eslint guard-for-in: "off", quote-props: "off", dot-notation: "off" */
/**
* systemjs加载配置
*/

import Systemjs from 'systemjs';
import cdnHost from 'config/cdn-host';

const { SystemJSConfig, fedBuildDate } = window;

const mapListObj = { // 自定义map和依赖关系,可覆盖cdn中的配置(注释的是例子
    map: {
        // 'debug-tool': 'http://192.168.1.114:8080/debug-tool/dist/index.js'
    },
    meta: { // map的依赖关系
        // 'ReactDom': {
        //     deps: ['React']
        // }
    }
};


const mainListObj = { // 载入文件的配置
    '_main': { // 入口文件 签名
        ToLoad: true, // 是否马上加载
         // 依赖库
        deps: ['react', 'react-router-dom', 'mobx', 'mobx-react', 'flexible']
    }
};

for (const key in SystemJSConfig.meta) {
    const itme = SystemJSConfig.meta[key];
    const _key = key;
    if (!mainListObj[_key]) {
        mainListObj[_key] = {
            deps: []
        };
    }
    if (!mainListObj[_key].deps) {
        mainListObj[_key].deps = [];
    }
    if (itme.depsCss) {
        mainListObj[_key].deps = mainListObj[_key].deps.concat(itme.depsCss);
    }
}
Systemjs.import(`${cdnHost}/config/2.2.0/config.js?${fedBuildDate}`).then((res) => {
    // res中的map查看cdn目录下config.js文件
    Systemjs.config(res(cdnHost));
    Systemjs.config(mapListObj);
    Systemjs.config({
        meta: mainListObj
    });

    for (const key in mainListObj) {
        const item = mainListObj[key];
        if (item.ToLoad) {
            Systemjs.import(key);
        }
    }
});
