const http = require('http')
const url = require('url')

http.createServer(function (reject,res) {
    console.log(url.parse(reject.url));
    const urlParse = url.parse(reject.url)
    if(urlParse.pathname === '/api/index'){
        res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});
        res.end(JSON.stringify({result:0,a:33}))
    }else if(urlParse.pathname === '/index'){
        res.writeHead(200,{'Content-Type':'application/json; charset=utf-8'});
        res.end(JSON.stringify({result:0,a:666}))
    }else{
        res.writeHead(404,{'Content-Type':'application/json; charset=utf-8'});
        res.end(JSON.stringify({result:-1}))
    }
    
}).listen(3000)