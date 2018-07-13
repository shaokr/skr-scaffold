/**
 * 数据,操作,计算 整合文件
 */
import './configure';
// 数据
import { Title, Tab } from './store';
// 操作
import { AppAction } from './action';
// 计算
import { AppComputed } from './computed';

export default new class {
  store = {
    title: new Title(),
    tab: new Tab()
  };

  action = {
    title: new AppAction(this)
  };

  computed = {
    title: new AppComputed(this)
  };
}();
