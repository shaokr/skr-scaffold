# 前端打包构建工具

## 功能 

安装cnpm: ```npm run cnpm```

安装eslint的相关内容: ```npm run eslint```

安装依赖 : ```cnpm i```

开启服务 : ```npm run g```

开启压缩服务 : ```npm run gb```

## 设置 

在```gulp-config.js```文件里进行目录的设置
在每个项目中的```packconf/config.js```里也可以进行单项目设置


# demo代码说明(前端构建基本框架)

## 目录说明
> release: 上线目录

> trunk: 源代码

>> doc: 项目相关文件(比如ui，流程图

>> src: 生产环境

>> dist: 产出代码

## src 生产环境目录说明

> img:图片

> js:

>> component: 项目react组件

>> config: 配置目录(语言等

>> entry: 入口(在此目录的文件会产出到产出环境

>> util: 其他代码库

> less: 样式

> pages:模板页面

> static:模板静态页面
