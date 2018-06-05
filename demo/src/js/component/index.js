/**
 * 主要输出js
 */
import 'less/pages/index.less';
import { Component } from 'react';
import { observer } from 'mobx-react';
import storeData from 'mobx-data';

import AppA from './a'; // 列表

// 头部
const Header = ({ title }) => (
    <div className="main">
        <header className="header">
            <div className="header-left">
                <i className="icon-chevron-thin-left" />
            </div>
            <h1>{title}</h1>
        </header>
    </div>
);
// 主
@observer
export default class NoticeMain extends Component {
    constructor(props) {
        super(props);

        this.onToggleLang = this.onToggleLang.bind(this);
    }
    onToggleLang() {
        const { action } = storeData;
        action.title.add();
    }
    render() {
        const { store, computed } = storeData;
        const { title, tab } = store;
        return (
            <div onClick={this.onToggleLang}>
                <Header title={`${title.name}---${computed.title.total}`} />

                <AppA data={tab.list} />

            </div>
        );
    }

}
