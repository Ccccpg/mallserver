const express = require('express')
const BCRYPT = require('bcryptjs')
const JWT = require('jsonwebtoken')
const TOKEN = require('../../../conf/token.json')
const RANDOM = require('../../../conf/random.json')
const RES = require('../../../conf/rescode.json')
let db = require('../../../db')
let router = express.Router()
let salt = BCRYPT.genSaltSync(10)
let { printApiStatus } = require('../../utils/printApiStatus')
let getRandom = require('../../utils/getRandom')

//管理员登录
router.post('/adminlogin', (req, res) => {
  let body = req.body
  let sqlstr_select = `select
                          a.id,
                          a.account,
                          a.password,
                          a.level,
                          a.selfcode ,
                          a.create_time,
                          i.url
                        from
                          admin a
                        left join 
                        image i 
                        on
                          i.admin_id = a.id
                        where
                          account = ? and status=1`
  let fun = function (resolve) {
    db.query(sqlstr_select, body.account, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      } else {
        try {
          let { id, account, password, level, selfcode, create_time, url } =
            result[0]
          if (
            result.length == 1 &&
            BCRYPT.compareSync(body.password, password)
          ) {
            res.send({
              code: RES.login_ok,
              access_token: JWT.sign(
                {
                  account,
                  id,
                  todo: 'access',
                  selfcode,
                  level,
                },
                TOKEN.secretKey,
                { expiresIn: TOKEN.access_expiresIn }
              ),
              reflush_token: JWT.sign(
                {
                  reflush_account: account,
                  id,
                  todo: 'reflush',
                  selfcode,
                  level,
                },
                TOKEN.secretKey,
                { expiresIn: TOKEN.reflush_expiresIn }
              ),
              id,
              level,
              selfcode,
              create_time,
              url,
              account,
              message: '登录成功!',
            })
            resolve()
          } else {
            res.send({
              code: RES.login_error,
              message: '登录失败',
            })
            resolve()
          }
        } catch (err) {
          res.send({
            code: RES.login_error,
            message: '登录失败',
          })
          resolve()
        }
      }
    })
  }
  printApiStatus(fun, router, res, 0)
})
//管理员注册
router.post('/adminregister', (req, res) => {
  let { type, account, password, licenseCode } = req.body
  let hash = BCRYPT.hashSync(password, salt)
  let sqlstr_add = `insert into register(account,password,license_code) value(?,?,?)`
  let sqlstr_add2 = `insert
                      into
                      admin(id,
                      account,
                      password,
                      level,
                      status,
                      selfcode) value(?,
                      ?,
                      ?,
                      ?,
                      ?,
                      ?)`
  let fun = function (resolve) {
    if (type == 'superAdmin') {
      let id = getRandom(RANDOM.id, '102', undefined, 10)
      let code = getRandom(RANDOM.code, undefined, undefined, 6)
      db.query(sqlstr_add2, [id, account, hash, 10, 1, code], (err, result) => {
        if (err) {
          if (err.message == 'jwt expired') {
            throw err
          }
          console.log(err)
        }
        res.send({
          code: RES.add_ok,
          message: '超级管理员账号注册成功',
        })
        resolve()
      })
    } else {
      db.query(sqlstr_add, [account, hash, licenseCode], (err, result) => {
        if (err) {
          if (err.message == 'jwt expired') {
            throw err
          }
          console.log(err)
        }
        if (result.affectedRows === 1) {
          res.send({
            code: RES.register_pending,
            message: '管理员账号申请待验证通过!',
          })
          resolve()
        }
      })
    }
  }
  printApiStatus(fun, router, res, 1)
})
//验证管理员的推荐码
router.get('/checkcode', (req, res) => {
  let sqlstr_code = 'select * from admin where status=1 and selfcode =?'
  let query = req.query
  let fun = function (resolve) {
    db.query(sqlstr_code, query.licenseCode, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      } else {
        if (result.length >= 1) {
          res.send({
            code: RES.select_ok,
            message: '该推荐码存在!',
          })
          resolve()
        } else {
          res.send({
            message: '该推荐码不存在!',
          })
          resolve()
        }
      }
    })
  }
  printApiStatus(fun, router, res, 2)
})
//获取当前管理员数量
router.get('/getadminnum', (req, res) => {
  let sqlstr_select = `select count(id) as num from admin group by id`
  let fun = function (resolve) {
    db.query(sqlstr_select, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }
      res.send({
        num: result[0],
        code: RES.select_ok,
      })
      resolve()
    })
  }
  printApiStatus(fun, router, res, 3)
})
module.exports = router
