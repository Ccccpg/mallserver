const express = require('express')
const RANDOM = require('../../../conf/random.json')
const RES = require('../../../conf/rescode.json')
let db = require('../../../db')
let router = express.Router()
let { printApiStatus } = require('../../utils/printApiStatus')
let getRandom = require('../../utils/getRandom')
//获取数据接口
router.get('/getregister', (req, res) => {
  let sqlstr_select = `select id,account,password,license_code,create_time ,status  
                       from register r  where r.license_code=?`
  let { selfcode } = req.auth
  let fun = function (resolve) {
    db.query(sqlstr_select, selfcode, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      } else {
        res.send({
          code: RES.select_ok,
          result,
          message: '数据查询成功!',
        })
        resolve()
      }
    })
  }
  printApiStatus(fun, router, res, 0)
})
//通过申请
router.post('/passregister', (req, res) => {
  let { id, account, password, license_code } = req.body
  let sqlstr_select = `select  JSON_ARRAYAGG(id)as idArr,JSON_ARRAYAGG(selfcode)as selfcodeArr from admin a `
  let sqlstr_modify = `update register set status=1 where id=${id}`
  let fun = function (resolve) {
    db.getConnection((err, connection) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }
      connection.query(sqlstr_modify, err => {
        if (err) {
          return connection.rollback(() => {
            if (err.message == 'jwt expired') {
              throw err
            }
            console.log(err)
          })
        }

        connection.query(sqlstr_select, (err, result) => {
          if (err) {
            return connection.rollback(() => {
              if (err.message == 'jwt expired') {
                throw err
              }
              console.log(err)
            })
          }
          let { idArr = [], selfcodeArr = [] } = result[0]
          let aid = getRandom(RANDOM.id, '102', idArr, 10)
          let selfcode = getRandom(RANDOM.code, undefined, selfcodeArr, 6)
          let sqlstr_add = `insert into admin(id,account,password,license_code,selfcode) value(${aid},?,?,?,?)`

          connection.query(
            sqlstr_add,
            [account, password, license_code, selfcode],
            err => {
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
                  message: '申请通过成功',
                })
                resolve()
              })
            }
          )
        })
      })
    })
  }
  printApiStatus(fun, router, res, 1)
})
//拒绝申请
router.post('/rejectregister', (req, res) => {
  let { id } = req.body
  let sqlstr_modify = `update register set status=0 where id=${id}`
  let fun = function (resolve) {
    db.query(sqlstr_modify, err => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }
      res.send({
        code: RES.modify_ok,
        message: '成功拒绝申请',
      })
      resolve()
    })
  }
  printApiStatus(fun, router, res, 2)
})
module.exports = router
