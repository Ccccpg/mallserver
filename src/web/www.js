const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
app.use(express.static('public'))
app.use(cors())
app.use('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/dist/index.html'))
})

app.listen('82', () => {
  setTimeout(() => {
    console.log(
      '\t\x1b[1;37m%s\x1b[0m',
      '商品后台管理系统成功运行：http://127.0.0.1:82'
    )
  }, 100)
})
