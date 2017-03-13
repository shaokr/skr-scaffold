// /**
//  * systemjs加载配置
//  */

import Systemjs from 'systemjs';
import cdnHost from 'conf/cdn-host';
import _ from 'lodash';

let mapListObj = { // 自定义map和依赖关系,可覆盖cdn中的配置(注释的是例子
    map: {
        // 'React': `${cdnHost}js/react/15.4.0/react-with-addons.min.js`,
        // 'ReactDom': `${cdnHost}js/react/15.4.0/react-dom.min.js`,
    },
    meta: { // map的依赖关系
        // 'ReactDom': {
        //     deps: ['React']
        // }
    }
};

let mainListObj = { // 载入文件的配置
    './build/main.js': { // 入口文件
        ToLoad: true, // 是否马上加载
         // 依赖库
        deps: ['React', 'ReactRouter', 'mobx', 'mobxReact']
    }
};

Systemjs.import(`${cdnHost}config.js`).then((res) => {
    // res中的map查看cdn目录下config.js文件
    Systemjs.config(res(cdnHost));
    Systemjs.config(mapListObj);
    Systemjs.config({
        meta: mainListObj
    });

    _.forEach(mainListObj, (item, key) => {
        if (item.ToLoad) {
            Systemjs.import(key);
        }
    });
});
