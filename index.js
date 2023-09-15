const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const multer = require('multer')
const objMulter = multer({ dest: 'public/images' }) //设置上传的的图片保存目录
const RES = require('./conf/rescode.json')
const MESSAGETYPE = require('./conf/messageType.json')
const { expressjwt: ejwt } = require('express-jwt')
const clients = require('./src/store/ws')
require('./src/web/wsServer')
require('./src/web/www')
let importRouters = require('./src/utils/importRouters')
let { createWsMessage } = require('./src/utils/ws')
let app = express()

app.use(express.static('public')) //进行静态资源公开
app.use(cors()) //解决跨域
app.use(objMulter.any())
app.use(express.urlencoded({ extended: false })) //解析application/x-www-form-urlencoded格式的数据
app.use(
  ejwt({ secret: 'cpg123', algorithms: ['HS256'] }).unless({
    path: [/^\/api\//],
  })
)
//全局错误捕获中间件
app.use((err, req, res, next) => {
  let token = req.headers.authorization
    ? req.headers.authorization.slice(7)
    : undefined
  let errMessage = err.message
  let ws = clients.get(token)
  //根据err的错误消息类型进行消息发送
  switch (errMessage) {
    case 'jwt malformed':
      ws.send(createWsMessage(MESSAGETYPE.loginExpired, '登录状态异常'))
      break
    case 'jwt expired':
      const decoded = jwt.decode(token, { complete: true })
      if (decoded.payload.todo === 'access') {
        res.send({
          code: RES.access_token_expired,
          message: 'access_token过期了',
        })
      }
      if (decoded.payload.todo === 'reflush') {
        ws.send(createWsMessage(MESSAGETYPE.loginExpired, '登录状态失效'))
      }
  }
})
app.listen(80, () => {
  importRouters().then(num => {
    console.log(
      '\t\x1b[1;37m%s\x1b[0m',
      `商城服务器成功运行：http://127.0.0.1:80，共${num}个api`
    )
  })
})

importRouters(app) //导入所有路由
