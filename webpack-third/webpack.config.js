const htmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const webpack = require('webpack');
const path = require('path')
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build']

//测量各个插件和loader所花费的时间
const smp = new SpeedMeasureWebpackPlugin();

const webpackConfig = {
  mode: isDev ? 'development' : 'production',
  devtool: config.devtool,
  entry:{ //多文件入口
    index:'./src/index.js',
    login:'./src/login.js',
  },
  output:{
    path: path.resolve(__dirname,'dist'),
    filename:'[name].[hash:6].js',
    publicPath:'/',
  },
  module: {
    noParse: /lodash/, //如果一些第三方模块没有AMD/CommonJS规范版本，可以使用 noParse 来标识这个模块，这样 Webpack 会引入这些模块，但是不进行转化和解析，从而提升 Webpack 的构建性能
    rules: [
      {
        test: /\.jsx?$/,
        use: ['cache-loader','babel-loader'], //在一些性能开销较大的 loader 之前添加 cache-loader，将结果缓存中磁盘中,效果明显
        // exclude: /node_modules/,
        include: path.resolve(__dirname,'src') //exclude 的优先级高于 include，在 include 和 exclude 中使用绝对路径数组，尽量避免 exclude，更倾向于使用 include
      },
      {
        test: /.(sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [require('autoprefixer')()]
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
            limit:10*1024,
            esModule: false,
            name: '[name]_[hash:6].[ext]',
            outputPath:'assets',
          }
        }
      },
    ]
  },
  resolve:{
    modules:['./src/components', 'node_modules'],
    alias:{
      'react-native': '@my/react-native-web'
    },
    extensions:['.js','web.js'], //另外，resolve 的 extensions 配置，默认是 ['.js', '.json']，如果你要对它进行配置，记住将频率最高的后缀放在第一位，并且控制列表的长度，以减少尝试次数
    enforceExtension:false,
    mainFields:['browser', 'main'],
  },
  externals:{ //我们希望在使用时，仍然可以通过 import 的方式去引用(如 import $ from 'jquery')，并且希望 webpack 不会对其进行打包
    //jquery通过script引入之后，全局中即有了 jQuery 变量
    'jquery': 'jQuery'
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns:['**/*','!lib','!lib/*']
    }),
    new CopyWebpackPlugin([
      {
        from:'./public/lib/*.js',
        to: path.resolve(__dirname,'dist','lib'),
        flatten: true,
        // ignore: ['other.js']
      }
    ]),
    new MiniCssExtractPlugin({
      filename:'css/[name].css'
    }),
    new htmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      config,
      chunks: ['index']
    }),
    new htmlWebpackPlugin({
      template: './public/login.html',
      filename: 'login.html',
      config,
      chunks: ['login']
    }),
    new webpack.ProvidePlugin({
      _:'lodash'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({ 
      STRING:'string',
      DEV: JSON.stringify('dev'),
      FLAG: 'true',
      MY:{a:1}
    }),
    //忽略 moment 下的 ./locale 目录
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  devServer: {
    hot:true, //热更新
    port: 8080,
    quiet: false,
    inline: true,
    stats: "errors-only",
    overlay: false, 
    clientLogLevel: "silent",
    // proxy:{
    //   "/api":"http://localhost:3000"
    // }
    proxy:{
      '/api':{
        target:'http://localhost:3000',
        pathRewrite:{
          '/api':''
        }
      }
    },
    before(app){
      app.get('/user',(req,res) => {
        res.json({'name':'xm'})
      })
    }
  }
}

module.exports = smp.wrap(webpackConfig)