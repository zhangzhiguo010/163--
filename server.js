var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]
var qiniu = require('qiniu')


if(!port){
  console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
  process.exit(1)
}

var server = http.createServer(function(request, response){
var parsedUrl = url.parse(request.url, true)
var pathWithQuery = request.url 
var queryString = ''
if(pathWithQuery.indexOf('?') >= 0){ queryString = pathWithQuery.substring(pathWithQuery.indexOf('?')) }
var path = parsedUrl.pathname
var query = parsedUrl.query
var method = request.method

/******** 从这里开始看，上面不要看 ************/


if(path === '/token'){
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', "*")

    // 下面的工作都是为了得到uptoken，需要三个参数；accessKey、secretKey、篮子名称（数据库名）
    // accessKey和secretKey放到本地.gitignore中，需要时读取即可
    // 篮子名称（数据库名）直接从“七牛云”官网复制粘贴即可
    let config = fs.readFileSync('./qiniu-key.json')
    config = JSON.parse(config)
    let {accessKey, secretKey} = config
    let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    let options = {scope: "163-music"};
    let putPolicy = new qiniu.rs.PutPolicy(options);
    let uploadToken = putPolicy.uploadToken(mac);

    response.write(`${uploadToken}`)
    response.end()
}else{
    response.statusCode = 404
    response.setHeader('Content-Type', 'text/html;charset=utf-8')
    response.end()
}


/******** 代码结束，下面不要看 ************/
})

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)