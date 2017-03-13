/**
 * 多语言包
 * 
 */

import {observable, action, runInAction, useStrict} from "mobx";
import Systemjs from 'systemjs';

useStrict(true);

class Language {
    @observable Language = localStorage.Language || 'cn' // 当前语言
    @observable data = {} // 当前语言数据

    constructor(){
        this.setLang();
    }

    @action('设置语言') setLang = async (name = this.Language) => {
        let data = await Systemjs.import(`./lang/${name}.js`);

        runInAction('语言成功设置为:'+name, () => {
            this.Language = localStorage.Language = name;
            this.data = data;
        });
    }
 
};

export default new Language();