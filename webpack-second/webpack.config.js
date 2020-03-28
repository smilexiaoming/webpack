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
      filename: 'index.[hash:6].html',
      config,
      chunks: ['index'] //HtmlWebpackPlugin 提供了一个 chunks 的参数，可以接受一个数组，配置此参数仅会将数组中指定的js引入到html文件中,此外，如果你需要引入多个JS文件，仅有少数不想引入，还可以指定 excludeChunks 参数，它接受一个数组。
    }),
    new htmlWebpackPlugin({
      template: './public/login.html',
      filename: 'login.[hash:6].html',
      config,
      chunks: ['login']
    }),
    new webpack.ProvidePlugin({  //配置全局库 默认寻找路径是当前文件夹 ./** 和 node_modules
      _:'lodash'
    }),
    new webpack.HotModuleReplacementPlugin(), //热更新插件
  ],
  devServer: {
    hot:true, //热更新
    port: 8080,
    quiet: false,
    inline: true,
    stats: "errors-only",
    overlay: false, 
    clientLogLevel: "silent"
  }
}