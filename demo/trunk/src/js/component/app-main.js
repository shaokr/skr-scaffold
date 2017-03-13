/**
 * 电子公告主要框
 */
import React, {Component} from 'react';

import {observer} from "mobx-react";

import lang from 'mobx/lang';
// import {todoListStore} from 'mobx/todo-list';

import AppA from './app-a'; // 列表

import DevTools from 'util/devtools'; // 详情

// 头部
const Header = ({title}) =>{
	return (
		<div className="main">
			<header className="header">
				<div className="header-left">
					<i className="icon-chevron-thin-left"></i>
				</div>
				<h1>{title}</h1>
			</header>
		</div>
	)
}
// 主
@observer
export default class NoticeMain extends Component{
	constructor(props){
		super(props);
		// this.mobxData =  todoListStore;
		// this.lang = lang;
		// this.mobxData.data2 = '12412'
	}

	render(){
		const {store,lang,computed,action} = this.props;
		const {title,tab} = store
		return (
			<div onClick={()=>{
				lang.setLang(lang.Language == 'en'? 'cn':'en')
				action.title.add()
			}}>

				<Header title ={title.name +'---'+ computed.title.total} />

				当前语言:{lang.Language}------{lang.data['hi']}
				
				<AppA data = {tab.list} />
				
				{DevTools && <DevTools/>}
			</div>
		)
	}
}