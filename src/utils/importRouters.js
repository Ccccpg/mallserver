const fs = require('fs')
const path = require('path')
let _app
// 获取路由中间件里的所有请求url
function getAllApiByRouter(prepath, router, num) {
  let patharr = []
  router.stack.forEach(item => {
    patharr.push(
      item.route.stack[0].method.toUpperCase() +
        '\t' +
        prepath +
        item.route.path
    )
  })
  patharr.forEach(item => {
    console.log('\t\x1b[2m%s\x1b[0m', item)
  })
  return patharr.length
}
function importRouters(app) {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, '../router'), (err, data) => {
      if (err) {
        throw err
      } else {
        let apiNum = 0
        data.forEach((file, fileindex) => {
          fs.readdir(path.join(__dirname, `../router/${file}`), (err, res) => {
            if (err) {
              throw err
            } else {
              res.forEach((item, resindex) => {
                let routerUrl = path.join(
                  __dirname,
                  `../router/${file}/${item}`
                )
                let authORnoauth = item.split('.')[0]
                const router = require(routerUrl)
                const prepath = authORnoauth == 'auth' ? '/auth' : '/api'
                if (app && !_app) {
                  _app = app
                } //防止app为空值
                _app.use(prepath, router)
                apiNum += getAllApiByRouter(prepath, router)
                if (
                  fileindex == data.length - 1 &&
                  resindex == res.length - 1
                ) {
                  setTimeout(() => {
                    resolve(apiNum)
                  })
                }
              })
            }
          })
        })
      }
    })
  })
}
module.exports = importRouters
