# 共用组件项目示例

[基于 RequireJS 的跨项目共用前端组件(模块)方案](https://github.com/ufologist/requirejs-component/blob/gh-pages/principle.md)

最终该项目需要发布到 CDN, 以便其他项目引用, 达到跨项目共用的目的.

## 目录说明

```
共用组件项目/
├── component1/            -- 一个共用组件
|   |── component1.css
|   |── component1.js
|   └── res/               -- 该模块用到的所有静态资源(图片, 音乐等等)
|
├── .../                   -- 其他共用组件
|
└── require-base-config.js -- 共用组件配置
```

最重要的其实是**共用组件配置**, 所以没有一定要求所有的共用组件到放在这个项目中来开发, 各个共用组件是可以作为独立的项目来开发的, 只要最终将共用组件映射好即可.

例如:
```javascript
require.config({
    map: {
        '*': {
            'component1.js': '//cdn-a.com/component/component1/component1.js',
            'component2.js': '//cdn-b.com/component2.js'
        }
    }
});
```

所以其实**我们可以在这种机制的基础上, 做出一个共用组件(发布)系统, 来动态的生成共用组件配置**

## 如何新增(注册)共用组件/模块

* 在该项目中新增一个组件的文件夹
* 在该文件夹下实现该组件
* 发布组件到 CDN
* 修改 `require-base-config.js` 共用组件配置, 添加组件的映射(即注册组件)
* 发布修改后的 `require-base-config.js` 到 CDN
* 例如

  ```
  共用组件项目/
  ├── new-component/        -- 新增的共用组件
  |   |── new-component.css
  |   |── new-component.js
  |   └── res/
  ```

  ```javascript
  // require-base-config.js
  map: {
      '*': {
          // 新增的组件/模块
          'new-component.js': window.componentBaseUrl + '/new-component/new-component.js'
      }
  }
  ```

## 注意事项

项目示例中配置的共用组件映射的 [BootCDN](http://www.bootcdn.cn/) 上的文件, 建议还是使用自己的 CDN 服务