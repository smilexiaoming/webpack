**基础配置**

# 1.webpack 是什么？
webpack 是一个现代 JavaScript 应用程序的静态模块打包器，当 webpack 处理应用程序时，会递归构建一个依赖关系图，其中包含应用程序需要的每个模块，然后将这些模块打包成一个或多个 bundle。

# 2.webpack 的核心概念
entry: 入口
output: 输出
loader: 模块转换器，用于把模块原内容按照需求转换成新内容
插件(plugins): 扩展插件，在webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要做的事情

# 3.初始化项目
新建一个文件夹，如: webpack-first (当然，你可以使用任意一个你喜欢的项目名)。推荐大家参考本文一步一步进行配置，不要总是在网上找什么最佳配置，你掌握了webpack之后，根据自己的需求配置出来的，就是最佳配置。  

本篇文章对应的项目地址(编写本文时使用):[webpack](https://github.com/smilexiaoming/webpack.git)  

使用 npm init -y 进行初始化(也可以使用 yarn)。  

要使用 webpack，那么必然需要安装 webpack、webpack-cli:
```shell
npm install webpack webpack-cli -D
```
鉴于前端技术变更迅速，祭出本篇文章基于 webpack 的版本号:  
> "webpack": "^4.42.1"
> "webpack-cli": "^3.3.11"