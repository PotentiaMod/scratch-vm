# readme 

如果你遇到 `regeneratorRuntime is not defined` 错误

原因：由于当前的开发环境未支持 ES6 语法 `async await`,  而插件使用了这些语法。

解决方案:

1. 安装 babel-polyfill
2. 在文件顶部添加: require("babel-polyfill")

感谢 @[qhy-001](https://github.com/qhy-001)
