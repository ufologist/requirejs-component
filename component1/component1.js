define(function(require, exports, module) {
    require('css!./component1.css');
    var $ = require('zepto.js');

    function Component1(el) {
        $(el).html('<p class="component1"><span class="component1--icon"></span> 我是一个共用组件</p>');
    }

    module.exports = Component1;
});