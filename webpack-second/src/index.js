import './index.scss'

class Animal{
  constructor(name){
    this.name = name
  }

  getName(){
    return this.name
  }
}

var cat = new Animal('ming')

console.log(11111)

_.each([1,2,3],item => {
  console.log(item);
})

var btnEle = document.createElement('button');
btnEle.innerText = '点击我3424'
btnEle.addEventListener('click',function () {
  //按需加载
  // import() 语法，需要 @babel/plugin-syntax-dynamic-import 的插件支持，但是因为当前 @babel/preset-env 预设中已经包含了 @babel/plugin-syntax-dynamic-import，因此我们不需要再单独安装和配置。
  // webpack 遇到 import(****) 这样的语法的时候，会这样处理：
  // 以**** 为入口新生成一个 Chunk
  // 当代码执行到 import 所在的语句时，才会加载该 Chunk 所对应的文件（如这里的1.bundle.2481a247ae90677345fc.js）
  import('./handle').then(res => {
    res.btn()
  })
})

document.body.appendChild(btnEle)

//我们配置了 HotModuleReplacementPlugin 之后，会发现，此时我们修改代码，仍然是整个页面都会刷新。不希望整个页面都刷新，还需要修改入口文件：
if(module && module.hot) {
  module.hot.accept()
}

//环境变量
console.log({DEV,MY,FLAG});
