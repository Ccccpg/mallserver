const MESSAGETYPE = require('../../conf/messageType.json')
const clients = require('../web/wsServer')
//推送消息给客户端
function sendToClient(wss, ws, token) {
  //无登录状态情况下
  if (token == 'null') {
    ws.send(createWsMessage(MESSAGETYPE.default, '请先登录后进行操作'))
  } else {
    //已具备登录状态
    // console.log(token)
    ws.send(createWsMessage(MESSAGETYPE.default, '欢迎使用商城后台管理系统'))
  }
}
//创建消息
function createWsMessage(type, content) {
  return JSON.stringify({
    type,
    content,
  })
}
module.exports = {
  sendToClient,
  createWsMessage,
  // reflushWsToken,
}
