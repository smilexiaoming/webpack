const htmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack');
const path = require('path')
const isDev = process.env.NODE_ENV === 'development';
const config = require('./public/config')[isDev ? 'dev' : 'build']


module.exports = {
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
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'], 
        exclude: /node_modules/,
      },
      {
        test: /.(sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader, //css分离时，替换 style-loader
          // 'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [require('autoprefixer')()] //.browserlistrc可以设置浏览器兼容配置，多个loader都可以共享配置
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
  resolve:{  //resolve 配置 webpack 如何寻找模块所对应的文件。webpack 内置 JavaScript 模块化语法解析功能，默认会采用模块化标准里约定好的规则去寻找，但你可以根据自己的需要修改默认的规则。
    modules:['./src/components', 'node_modules'], //从左到右依次查找 这样配置之后，我们 import Dialog from 'dialog'，会去寻找 ./src/components/dialog，不再需要使用相对路径导入。如果在 ./src/components 下找不到的话，就会到 node_modules 下寻找。
    alias:{ //配置项通过别名把原导入路径映射成一个新的导入路径
      'react-native': '@my/react-native-web'
    },
    extensions:['web.js', '.js'], //适配多端的项目中，可能会出现 .web.js, .wx.js，例如在转web的项目中，我们希望首先找 .web.js，如果没有，再找 .js
    enforceExtension:false, //如果配置了true，那么导入语句不能缺省文件后缀。
    //有一些第三方模块会提供多份代码，例如 bootstrap，可以查看 bootstrap 的 package.json 文件：
    // {
    //   "style": "dist/css/bootstrap.css",
    //   "sass": "scss/bootstrap.scss",
    //   "main": "dist/js/bootstrap",
    // }
    // 假设我们希望，import 'bootsrap' 默认去找 css 文件的话，可以配置 resolve.mainFields 为
    // mainFields: ['style', 'main'] 
    mainFields:['browser', 'main'],  //默认
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns:['**/*','!lib','!lib/*']
    }),
    new CopyWebpackPlugin([
      {
        from:'./public/lib/*.js',
        to: path.resolve(__dirname,'dist','lib'),
        flatten: true, //设置为 true，那么它只会拷贝文件，而不会把文件夹路径都拷贝上
        // ignore: ['other.js']
      }
    ]),
    new MiniCssExtractPlugin({ //抽离CSS 将CSS文件单独打包，这可能是因为打包成一个JS文件太大，影响加载速度，也有可能是为了缓存(例如，只有JS部分有改动)。
      filename:'css/[name].css'
    }),
    new htmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      config,
      chunks: ['index'] //HtmlWebpackPlugin 提供了一个 chunks 的参数，可以接受一个数组，配置此参数仅会将数组中指定的js引入到html文件中,此外，如果你需要引入多个JS文件，仅有少数不想引入，还可以指定 excludeChunks 参数，它接受一个数组。
    }),
    new htmlWebpackPlugin({
      template: './public/login.html',
      filename: 'login.html',
      config,
      chunks: ['login']
    }),
    new webpack.ProvidePlugin({  //配置全局库 默认寻找路径是当前文件夹 ./** 和 node_modules
      _:'lodash'
    }),
    new webpack.HotModuleReplacementPlugin(), //热更新插件
    new webpack.DefinePlugin({ //定义环境变量
      STRING:'string', //是一个字符串，会被当做 code 片段
      DEV: JSON.stringify('dev'), //字符串
      FLAG: 'true', //FLAG 是个布尔类型
      MY:{a:1} //是一个对象，正常对象定义即可
    })
  ],
  devServer: {
    hot:true, //热更新
    port: 8080,
    quiet: false,
    inline: true,
    stats: "errors-only",
    overlay: false, 
    clientLogLevel: "silent",
    // proxy:{    //跨域设置
    //   "/api":"http://localhost:3000"
    // }
    proxy:{
      '/api':{
        target:'http://localhost:3000',
        pathRewrite:{  //替换接口连接中的文字
          '/api':''
        }
      }
    },
    before(app){ //在启动服务的时候，模拟请求接口数据
      //利用mocker-api包，可以在前端方便模拟数据  apiMocker(app, path.resolve('./mock/mocker.js'))
      app.get('/user',(req,res) => {
        res.json({'name':'xm'})
      })
    }
  }
}

// 利用webpack-merge合并新建webpack.config.dev.js、webpack.config.pro.js、webpack.config.base.js，配置"dev":"cross-env NODE_ENV=development webpack-dev-server --config=webpack.config.dev.js"