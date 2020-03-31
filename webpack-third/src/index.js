import './index.scss'
import $ from 'jquery'

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
  import('./handle').then(res => {
    res.btn()
  })
})

document.body.appendChild(btnEle)

// if(module && module.hot) {
//   module.hot.accept()
// }

//环境变量
console.log({DEV,MY,FLAG});

console.log($('body'))
