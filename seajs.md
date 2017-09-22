# 如何换成基于 seajs 3.x 的方案

* `seajs-css` 和 `seajs-text` 插件需要以 `<script>` 标签的形式在页面中引入, 或者先引入 `seajs-preload` 插件在 `preload` 配置项中配置
* 启动入口模块的方式为: `seajs.use(['./index/index.js']);`
* 引入 css 模块的方式为: `require('./component1.css');`
* 异步引入 css 依赖或者其他依赖, 不阻塞模块执行的方式为: `require.async(['normalize.css', '../lib/app/app.css', './index.css']);`
* [引入 text 模块](https://github.com/seajs/seajs-text/issues/1)的方式仍旧可以是: `var tpl = require('text!./index-tpl.html');`
* 由于很多第三方模块不支持 CMD 模块规范, 因此需要额外注意, 例如 `var $ = require('zepto.js');` 是无法获得模块导出的
* 配置项不一样
  * `baseUrl` -> `base`
  * `map` -> `alias`