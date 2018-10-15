/**
 * 入口文件
 */
import { log } from 'util/debug-tool';

import ReactDOM from 'react-dom';

import AppMain from 'component';

import store from 'mobx-data';
import lang from 'config/lang';
import createUrlParams from '../util/create-url-params';

import { HashRouter as Router } from 'react-router-dom';

console.log(createUrlParams({ a: 1 }));
ReactDOM.render(
  <Router>
    <AppMain {...store} lang={lang} />
  </Router>,
  document.getElementById('app-main')
);
