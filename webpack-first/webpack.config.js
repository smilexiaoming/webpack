const htmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const path = require('path')
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build']


module.exports = {
  mode: isDev ? 'development' : 'production', //告知 webpack 使用相应模式的内置优化
  devtool: config.devtool, //可以帮助我们将编译后的代码映射回原始源代码
  entry:'./src/index.js', //entry 的值可以是一个字符串，一个数组或是一个对象。
  output:{
    path: path.resolve(__dirname,'dist'), //webpack的默认配置 必须是绝对路径
    filename:'bundle.[hash].js', //考虑到CDN缓存的问题，我们一般会给文件名加上 hash
    publicPath:'/', //通常为CDN地址（用于项目中使用/引用时）例如，你最终编译出来的代码部署在 CDN 上，资源的地址为: 'https://AAA/BBB/YourProject/XXX'，那么可以将生产的 publicPath 配置为: //AAA/BBB/。
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'], //我们可以在 .babelrc 中编写 babel 的配置，也可以在 webpack.config.js 中进行配置。
        exclude: /node_modules/, //排除 node_modules 目录 有效提升编译效率
      },
      {
        test: /.(sc|c)ss$/,
        use: ['style-loader', 'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [require('autoprefixer')({
                  "overrideBrowserslist": [
                    ">0.25%",
                    "not dead"
                  ]
                })]
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test:/\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use:{
          loader:'url-loader',
          options:{
            limit:10*1024, //即资源大小小于 10K 时，将资源转换为 base64，超过 10K，将图片拷贝到 dist 目录
            esModule: false,
            name: '[name]_[hash:6].[ext]', //打包文件名称修改
            outputPath:'assets', //当本地资源较多时，我们有时会希望它们能打包在一个文件夹下
          }
        }
      },
      // {
      //   test:/.html$/,
      //   // 有了这个配置，无法使用<% %>语法，鱼和熊掌不可兼得
      //   use:['html-withimg-loader']
      // }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',  //打包后的文件名
      config,
      minify: {
        removeAttributeQuotes: false, //是否删除属性的双引号
        collapseWhitespace: false, //是否折叠空白
      },
      // hash:true //是否加上hash，默认是 false
    }),
    //每次打包前清空dist目录,不需要传参数喔，它可以找到 outputPath
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns:['**/*','!dll','!dll/*'] //希望dist目录下 dll 文件夹不被清空
    }),
  ],
  devServer: {
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