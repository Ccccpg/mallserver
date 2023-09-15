const clients = require('../store/ws')
const { WebSocketServer } = require('ws')
const wss = new WebSocketServer({ port: 81 })
const msgpack = require('msgpack-lite')

let { sendToClient, createWsMessage, reflushWsToken } = require('../utils/ws')
wss.on('connection', function connection(ws, req) {
  let myurl = new URL(req.url, 'http://localhost:81')
  let token = myurl.searchParams.get('token')
  let clientId = myurl.searchParams.get('clientId')
  if (token == 'null') {
    clients.set(clientId, ws)
  } else {
    clients.set(token, ws)
  } //为每个ws连接做映射
  ws.on('error', console.error)
  ws.on('message', function message(msg, isBinary) {
    let msgObj = msgpack.decode(msg)
    sendToClient(msgObj, wss, ws)
  })
  ws.on('close', () => {
    clients.delete(token) || clients.delete(clientId)
  })
  sendToClient(wss, ws, token)
})
