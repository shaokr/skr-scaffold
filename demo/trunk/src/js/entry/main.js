/**
 * 入口文件
 */

require('less/pages/index.less');

import ReactDOM from 'react-dom';

import AppMain from 'component/app-main';

import store from 'mobx/store';
import lang from 'mobx/lang';

ReactDOM.render(<AppMain {...store} lang={lang} />, document.getElementById('app-main'));
