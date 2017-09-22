# 基于 RequireJS 的跨项目共用前端组件(模块)方案

另外也可以[换成基于 seajs 3.x 的方案](https://github.com/ufologist/requirejs-component/blob/master/seajs.md)

## 背景

前端项目较多, 有跨项目共用组件的需求

* 希望有一套可以在各个项目中使用的公共组件(模块), 统一实现避免重复造轮子
* 公共组件统一维护

### 统一引用

于是我们可以选择将公共组件从各个项目中抽离出来, 形成一个公共组件库的项目来服务各个业务项目.
为了便于各个项目使用, 我们会将公共组件发布到 CDN, 这样各个项目就只需要按照如下方式引用即可.

```html
<!-- 项目需要哪个公共组件就引用哪个公共组件 -->
<link rel="stylesheet" href="//cdn.com/component/component1/component1.css">
<link rel="stylesheet" href="//cdn.com/component/component2/component2.css">

<script src="//cdn.com/component/component1/component1.js"></script>
<script src="//cdn.com/component/component2/component2.js"></script>
```

如你所知, 这种方式的组件方案, 在前端的圈子里由来已久, 特别是 `jQuery` 的生态圈, 比比皆是. 例如我们熟知的 `Bootstrap`

```html
<!-- Bootstrap CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css">

<!-- Optional JavaScript -->
<!-- jQuery first, then Popper.js, then Bootstrap JS -->
<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js"></script>
```

在过去很长的一段时间内, 前端都是在这种原始的方式中摸索着, 至今还有很多项目是这样做的.

这种方式**最大的弊端就是需要人为地来处理依赖关系**, 包括组件本身的依赖, 以及组件之间的依赖关系. 当组件较多时, 就很容易出现因为组件引用不当而产生的问题. 例如:

* 组件怎么没有样式? 某个组件是有 CSS 文件的, 但引用的时候忘记了

  ```html
  <!-- 忘记引用 component1 的 css 文件了 -->
  <script src="//cdn.com/component/component1/component1.js"></script>
  ```

* 组件怎么跑不起来? 某个组件依赖了另外的组件, 但没有被引用进来

  ```html
  <!-- 忘记引用 component1 依赖的 component-common 了 -->
  <script src="//cdn.com/component/component1/component1.js"></script>
  ```

* 组件还是跑不起来? 依赖的组件是被引用进来的, 但引用的顺序不对

  ```html
  <!-- component-common 的引用顺序不对, 应该要放在 component1 上面, 先于 component1 执行 -->
  <script src="//cdn.com/component/component1/component1.js"></script>
  <script src="//cdn.com/component/component-common/component-common.js"></script>
  ```

### 模块化自动处理依赖

使用组件的人需要自己处理组件的依赖关系, 这种方式是逆天的.

是不是可以用一种简单的模块化手段来管理项目中的前端资源呢?

于是我们可以选择一种统一的前端模块化方案(例如 AMD/CMD), 统一的定义模块使用模块, 自动加载依赖.

这样我们就达成了
* 统一的前端模块化方案, 促成统一的写代码的风格, 并避免了全局变量和冲突的问题
* 统一的模块调用方式, 使用起来更简单, 使用者无需考虑依赖的问题

## 确定方案

* 使用 RequireJS 的 AMD 模块化方案
* 使用 RequireJS 的 CSS 插件, 以便将组件的样式也作为一种依赖
* 将共用模块(组件)发布到 CDN
* **将共用模块(组件)统一配置起来, 配置文件发布到 CDN**
* **项目引用 CDN 上的共用模块配置文件, 通过模块名来使用共用模块(组件), 即达到跨项目共用组件的目标**
* [遵循模块规范](#模块化规范)
* 不使用前端构建工具来打包模块, 模块建议以 [SRP](https://baike.baidu.com/item/%E5%8D%95%E4%B8%80%E8%81%8C%E8%B4%A3%E5%8E%9F%E5%88%99) 的原则开发和使用

## 适用项目(场景)

比较适合的项目: 项目没有前后端分离, 需要前后端人员一起开发的企业级后台项目(一般是 PC 端), 例如内部的管理系统

或者是这种项目
* 没有前后端分离
* 对前端代码有模块化的需求, 但希望尽可能简单, 这样前后端人员的接受程度都会比较高
* 可以容忍前端的一些性能指标, 特别是模块较多时的请求数量, 所以可能更适合 PC 端
* 为了减少复杂度, 不加入构建流程来打包模块, 这样也可以更方便地调试线上的代码

## 实现方案

将模块分为两种
* 本地模块, 即项目的内部模块
* 远程模块, 即共用的外部模块

### 模块化规范

* 使用 [Simplified CommonJS Wrapper](http://requirejs.org/docs/api.html#cjsmodule) 方式来定义模块
  * 将所有 `require` 语句都放在模块的最前面, 建议采用以下顺序
    * 样式
    * 共用组件模块
    * 项目公共模块
    * 页面模块
  * 但一定要注意, 这只是为了提升写代码的体验, 底层的原理还是遵循 AMD 并行加载依赖的方式
  * 例如

    ```javascript
    define(function(require, exports, module) {
        // 采用了这样的写法来加载依赖, 并不意味着 a 模块一定先于 b 模块执行
        var a = require('./a.js');
        var b = require('./b.js');
    });

    // 其原理上还是会转换成 AMD 本身的模块加载方式
    define(['./a.js', './b.js'], function(a, b) {});
    ```
* 配置 `baseUrl` 以及 `css` 和 `text` 这两个插件

  例如
  ```javascript
  require.config({
      baseUrl: './',
      map: {
          '*': {
              'css': '//cdn.bootcss.com/require-css/0.1.10/css.min.js',
              'text': '//cdn.bootcss.com/require-text/2.0.12/text.min.js'
          }
      }
  });

  // 这样所有项目就都可以使用插件了
  require('css!./index.css');
  var tpl = require('text!./index-tpl.html');
  ```
* **使用模块时带上文件的后缀名**
  * 避免 `paths` 配置与模块的(目录)路径冲突
* **使用相对路径来引用本地模块**
  * 避免 `map` 配置与模块的(目录)路径冲突
  * 例如

    ```javascript
    var mod = require('./mod.js');
    ```
* **使用模块名来引用远程模块**, 是通过 `map` 配置来统一维护映射的模块名与模块 URL
  * 例如

    ```javascript
    // 配置公共模块
    map: {
        '*': {
            // 注意 JS 模块映射的模块ID 和 URL 都要带上 .js 后缀
            'component1.js': '//cdn.com/component/component1/1.0.0/component1.js',
            'component2.js': '//cdn.com/component/component2/1.1.0/component2.js',
            'component3.js': '//cdn.com/component/component3/1.2.0/component3.js',
            // 注意 CSS 模块的配置有点特殊: 模块ID 和 URL 都不要添加 .css 后缀名
            'style': '//cdn.com/component/style/1.0.0/style'
            // ...
        }
    }

    // 使用公共模块
    require('css!style.css');
    var component1 = require('component1.js');
    ```
  * 避免在公共模块中使用 `text` 插件, 因为 `text` 插件是以 `XHR` 来加载内容的, 此时会有跨域问题, 除非你配置好了 `CORS`
* 如果项目的静态资源最终要上传到 CDN, 那么也需要避免使用 `text` 插件, 原因就是会有跨域问题

  例如
  ```javascript
  // 引用 CDN 上的模块配置文件
  require(['//cdn.com/component/require-base-config.js'], function() {
      // 开发环境
      // require(['./index/index.js']);
      // 正式环境
      require(['//cdn.com/project1/index/index.js']);
  });
  ```

## 项目示例

* [共用组件项目示例](https://github.com/ufologist/requirejs-component)
* [使用共用组件的项目示例](https://github.com/ufologist/requirejs-example) [预览效果](https://ufologist.github.io/requirejs-example/index.html)

## 使用方法

将[共用组件项目示例](https://github.com/ufologist/requirejs-component/archive/gh-pages.zip)和[使用共用组件的项目示例](https://github.com/ufologist/requirejs-example/archive/gh-pages.zip)分别下载下来, 作为项目的模版来使用即可