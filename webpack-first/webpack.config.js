const htmlWebpackPlugin = require('html-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build']


module.exports = {
  mode:isDev ? 'development' : 'production', //告知 webpack 使用相应模式的内置优化
  devtool:config.devtool, //可以帮助我们将编译后的代码映射回原始源代码
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'], //我们可以在 .babelrc 中编写 babel 的配置，也可以在 webpack.config.js 中进行配置。
        exclude: /node_modules/, //排除 node_modules 目录 有效提升编译效率
      },
      {
        test: /.(sc|c)ss$/,
        use:['style-loader','css-loader',
        {
          loader:'postcss-loader',
          plugins:['autoprefixer']
        },
        'sass-loader'
      ]

      }
    ]
  },
  plugins:[
    new htmlWebpackPlugin({
      template:'./public/index.html',
      filename:'index.html',  //打包后的文件名
      config,
      minify:{
        removeAttributeQuotes: false, //是否删除属性的双引号
        collapseWhitespace: false, //是否折叠空白
      },
      // hash:true //是否加上hash，默认是 false
    })
  ],
  devServer:{
    port: 8080, //端口号
    quiet: false, //开启后，看不到打印台日志
    inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
    stats: "errors-only", //终端仅打印 error （当启用了 quiet 或者是 noInfo 时，此属性不起作用）
    overlay: false, //当编译出错时，会在浏览器窗口全屏输出错误，默认是关闭的。
    clientLogLevel: "silent", //日志等级 （在重新加载之前，在一个错误之前，或者模块热替换启用时。如果你不喜欢看这些信息，可以将其设置为 silent (none 即将被移除)。）
  }
}

// webpack.config.js 中进行配置babel
// rules: [
//   {
//     test: /\.jsx?$/,
//     use: {
//       loader: 'babel-loader',
//       options: {
//         presets: ["@babel/preset-env"],
//         plugins: [
//           [
//             "@babel/plugin-transform-runtime",
//             {
//               "corejs": 3
//             }
//           ]
//         ]
//       }
//     },
//     exclude: /node_modules/
//   }
// ]