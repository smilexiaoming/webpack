module.exports = {
  dev:{
    title:'这是开发环境',
    devtool:'cheap-module-eval-source-map'
  },
  build:{
    title:'这是线上环境',
    devtool:'source-map', //生产环境可以使用 none 或者是 source-map，使用 source-map 最终会单独打包出一个 .map 文件，我们可以根据报错信息和此 map 文件，进行错误解析，定位到源代码
  }
}