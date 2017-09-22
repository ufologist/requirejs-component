// 共用组件配置
// ----------------------------
// require.js 的基础配置/公共配置
// * baseUrl 始终为默认值: ./
// * map 公共组件的 URL 映射统一维护
//   * 将全部的公共组件都在这里配置好, 这样一看便知有哪些公共组件, 而且其他项目也不需要逐一配置了
//
// 其他项目使用时, 先引入这个基础配置, 可以再根据需要添加或者覆盖一些配置
// 例如:
// require.config({
//     urlArgs: 'v=' +  Date.now()
// });
//
// 如果需要支持多环境配置, 可以在这里定义一个全局的基础路径, 然后映射模块时拼接这个基础路径即可.
// 需要覆盖这个基础路径的页面, 就在页面中先定义出基础路径即可控制使用不同的环境
// 例如:
// if (!window.componentBaseUrl) {
//     window.componentBaseUrl = 'http://cdn.com/';
// }
// 
// 在页面中我们先定义基础路径, 即可覆盖这个配置
// <script>window.componentBaseUrl = 'http://test.cdn.com/';</script>
require.config({
    // 如果使用了 data-main 则一定要记得设置 baseUrl, 因为使用了 data-main 会自动配置 baseUrl 为父级地址
    // 例如 data-main="index/index.js" 那么 baseUrl 就会被配置为 index/
    // 可以使用 require.toUrl 方法来判断加载一个模块时的 URL 是怎样的
    // 因为会影响到加载模块的地址, 特别是使用 css/text 等插件去加载非 js 的文件时,
    // 所以要记得配置为 baseUrl 的默认值: ./
    baseUrl: './',
    map: {
        '*': {
            // 通用模块
            'css': '//cdn.bootcss.com/require-css/0.1.10/css.min.js',
            // 当使用 map 来映射 text 插件时, 如果想给 text 插件添加配置,
            // 应该将模块ID 配置为 map 映射的地址
            //
            // 例如:
            // map: {
            //     '*':{
            //         'text': '//cdn.bootcss.com/require-text/2.0.12/text.min.js',
            //     }
            // }
            //
            // config: {
            //     '//cdn.bootcss.com/require-text/2.0.12/text.min.js': {
            //         useXhr: function() {return true;}
            //     }
            // }
            //
            // 当然也可以选择使用 paths 来配置 text 插件
            // 例如:
            // paths: {
            //     'text': '//cdn.bootcss.com/require-text/2.0.12/text.min'
            // }
            //
            // config: {
            //     'text': {
            //         useXhr: function() {return true;}
            //     }
            // }
            'text': '//cdn.bootcss.com/require-text/2.0.12/text.min.js',

            // 共用 JS 模块
            // 注意 JS 模块映射的模块ID 和 URL 都要带上 .js 后缀
            'zepto.js': '//cdn.bootcss.com/zepto/1.2.0/zepto.min.js',

            // 共用 CSS 模块
            // 注意 CSS 模块的映射, 模块ID 和 URL 都不要添加 .css 后缀名
            // 否则会报错: has not been loaded yet for context: _
            // 因为 requirejs 会以生成一个模块ID, 并保存在模块表里面说明哪些模块已经加载了,
            // 如果这里配置了后缀名, 就会导致模块ID与期望的不符, 因此提示模块还未加载
            // 但是在使用的时候, 还是建议添加上 .css 后缀名, 统一风格
            // 例如: require('css!normalize.css');
            // 但其实 require('css!normalize'); 也是可以的
            'normalize': '//cdn.bootcss.com/normalize/7.0.0/normalize.min',

            // 共用组件示例
            'component1.js': '//rawgit.com/ufologist/requirejs-component/master/component1/component1.js'
        }
    }
});