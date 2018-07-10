/**
 * 多语言包
 */
import _ from 'lodash';
import { observable, action, runInAction } from 'mobx';
import { local } from 'util/storage';
import Systemjs from 'systemjs';

if (!String.langReplace) {
  String.prototype.langReplace = function(...arr) {
    let _str = this.toString();
    if (_str) {
      _.forEach(arr, (item, index) => {
        _str = _str.replace(new RegExp(`\\$${index}`, 'g'), item);
      });
    }
    return _str;
  };
}

const DefLang = navigator.language || 'zh';
const localKey = 'Language';
const EventKey = `${localKey}Change`;
class Language {
  @observable Language = local.get(localKey, true) || DefLang; // 当前语言
  @observable data = {}; // 当前语言数据
  path = '';
  constructor(props) {
    this.path = _.get(props, 'path', '');
    this.setLang();
    this.init();
  }
  triggerChange(value) {
    if (this.Language !== value) {
      let setItemEvent = new Event(EventKey);
      setItemEvent.newValue = value;
      window.dispatchEvent(setItemEvent);
    }
  }
  init() {
    window.addEventListener(EventKey, e => {
      const { newValue: value } = e;
      if (this.Language !== value) {
        this.setLang(e.newValue);
      }
    });
  }
  replace(data, ...arr) {
    return data.langReplace(...arr);
  }

  @action('设置语言')
  setLang = async function(name = this.Language, isReload = false) {
    const data = await Systemjs.import(
      `${__webpack_public_path__}/lang/${this.path}/${name}.js`
    ).catch(() => {
      console.warn(`语言包${name}不存在`);
      return false;
    });
    if (data) {
      local.set(localKey, name, true);
      this.triggerChange(name);
      if (isReload) {
        window.location.reload();
      } else {
        runInAction(`语言成功设置为:${name}`, () => {
          this.data = data;
          this.Language = name;
        });
      }
    } else if (name !== DefLang) {
      const _name = name.split(/[-_]/)[0];
      if (_name !== name) {
        this.setLang(_name);
        return;
      }
      if (name !== this.Language) {
        this.setLang();
      } else {
        this.setLang(DefLang);
      }
    }
  };
}

export default new Language();
