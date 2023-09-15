const express = require('express')
const RES = require('../../../conf/rescode.json')
const fs = require('fs')
const db = require('../../../db')
let { printApiStatus } = require('../../utils/printApiStatus')
let router = express.Router()

//上传图片
router.post('/uploadimage', (req, res) => {
  let files = req.files
  let newurl = files[0].filename + '.jpg'
  let fun = function (resolve) {
    fs.rename(req.files[0].path, 'public\\images\\' + newurl, err => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      } else {
        res.send({
          code: RES.add_ok,
          newurl,
          message: '上传图片成功!',
        })
        resolve()
      }
    })
  }
  printApiStatus(fun, router, res, 0)
})
//更新图片绑定
router.post('/updateavatar', (req, res) => {
  let sqlstr_delete = `delete from image where commodity_id=? or employee_id=?`
  let sqlstr_add = `insert into image(url,commodity_id,employee_id) value(?,?,?)`
  let { url, employee_id, commodity_id } = req.body
  let fun = function (resolve) {
    db.getConnection((err, connection) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }
      connection.beginTransaction(err => {
        if (err) {
          if (err.message == 'jwt expired') {
            throw err
          }
          console.log(err)
        }
        connection.query(
          sqlstr_delete,
          [commodity_id, employee_id],
          (err, result) => {
            if (err) {
              return connection.rollback(() => {
                if (err.message == 'jwt expired') {
                  throw err
                }
                console.log(err)
              })
            }
            connection.query(
              sqlstr_add,
              [url, commodity_id, employee_id],
              (err, result) => {
                if (err) {
                  return connection.rollback(() => {
                    if (err.message == 'jwt expired') {
                      throw err
                    }
                    console.log(err)
                  })
                }
                connection.commit(err => {
                  if (err) {
                    return connection.rollback(() => {
                      if (err.message == 'jwt expired') {
                        throw err
                      }
                      console.log(err)
                    })
                  }
                  res.send({
                    code: RES.modify_ok,
                    message: '图片更新成功',
                  })
                  resolve()
                })
              }
            )
          }
        )
      })
    })
  }
  printApiStatus(fun, router, res, 1)
})
module.exports = router
