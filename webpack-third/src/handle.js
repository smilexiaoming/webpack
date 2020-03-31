export function btn() {
    console.log('这是个美女');
    fetch('/api/index?aa=2')
    .then(res => res.json())
    .then(res => {
        console.log('success',res);
    },(error) => {
        console.log('error',error);
        
    })

    fetch('/user')
    .then(res => res.json())
    .then(res => {
        console.log('success',res);
    },(error) => {
        console.log('error',error);
        
    })
}