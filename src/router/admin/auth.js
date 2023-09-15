const express = require('express')
const BCRYPT = require('bcryptjs')
const TOKEN = require('../../../conf/token.json')
const JWT = require('jsonwebtoken')
const RANDOM = require('../../../conf/random.json')
const RES = require('../../../conf/rescode.json')
let db = require('../../../db')
let router = express.Router()
let salt = BCRYPT.genSaltSync(10)
let { printApiStatus } = require('../../utils/printApiStatus')
let getRandom = require('../../utils/getRandom')

//修改管理员密码
let sqlstr_modify = 'update admin set password=? where account=? and status=1'
router.post('/modifyadmin', (req, res) => {
  let { password } = req.body
  let { account } = req.auth
  let hash = BCRYPT.hashSync(password, salt)
  let fun = function (resolve) {
    db.query(sqlstr_modify, [hash, account], (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      } else {
        if (result.affectedRows === 1) {
          res.send({
            code: RES.modify_ok,
            message: '数据修改成功!',
          })
          resolve()
        }
      }
    })
  }
  printApiStatus(fun, router, res, 0)
})
//删除管理员
let sqlstr_delete = 'update admin set status=0 where id=?'
router.post('/deleteadmin', (req, res) => {
  let { id } = req.body
  let { level } = req.auth
  let fun = function (resolve) {
    if (level > 5) {
      db.query(sqlstr_delete, id, (err, result) => {
        if (err) {
          if (err.message == 'jwt expired') {
            throw err
          }
          console.log(err)
        } else {
          if (result.affectedRows === 1) {
            res.send({
              code: RES.delete_ok,
              message: '删除成功!',
            })
            resolve()
          }
        }
      })
    } else {
      res.status(400).send({
        message: '权限不够',
      })
    }
  }
  printApiStatus(fun, router, res, 1)
})
//刷新token
router.get('/reflushtoken', (req, res) => {
  let fun = function (resolve) {
    JWT.verify(req.headers.authorization.slice(7), 'cpg123', (err, decoded) => {
      if (err) {
        res.send({
          err: err.message,
          message: 'reflush_token已过期',
        })
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      } else {
        let { account, id, level, selfcode } = decoded
        res.send({
          access_token: JWT.sign(
            { account, id, todo: 'access', selfcode, level },
            TOKEN.secretKey,
            { expiresIn: TOKEN.access_expiresIn }
          ),
          reflush_token: JWT.sign(
            { reflush_account: account, id, todo: 'reflush', selfcode, level },
            TOKEN.secretKey,
            { expiresIn: TOKEN.reflush_expiresIn }
          ),
          message: 'token刷新成功',
        })
        resolve()
      }
    })
  }
  printApiStatus(fun, router, res, 2)
})
//验证注册申请
router.post('/handleregister', (req, res) => {
  let sqlstr_select = `select account,password,license_code from register where employee_id=?`
  let sqlstr_add = `insert into admin(id,account,password,employee_id,license_code,selfcode,status) 
                    value(?,?,?,?,?,?,?)`
  let sqlstr_modify = `update register set status=1 where employee_id=?`
  let ID = getRandom(6, RANDOM.id)
  let CODE = getRandom(6, RANDOM.code)
  let { employee_id } = req.body
  let fun = function (resolve) {
    //查询
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
        connection.query(sqlstr_select, employee_id, (err, result) => {
          if (err) {
            return connection.rollback(() => {
              if (err.message == 'jwt expired') {
                throw err
              }
              console.log(err)
            })
          }
          if (result.length == 1) {
            let { account, password, license_code } = result[0]
            //添加
            connection.query(
              sqlstr_add,
              [ID, account, password, employee_id, license_code, CODE, 1],
              (err, result) => {
                if (err) {
                  return connection.rollback(() => {
                    if (err.message == 'jwt expired') {
                      throw err
                    }
                    console.log(err)
                  })
                }
                if (result.affectedRows >= 1) {
                  //更新
                  connection.query(sqlstr_modify, employee_id, err => {
                    if (err) {
                      if (err.message == 'jwt expired') {
                        throw err
                      }
                      console.log(err)
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
                        code: RES.add_ok,
                        message: '验证通过',
                      })
                      resolve()
                    })
                  })
                }
              }
            )
          }
        })
      })
    })
  }
  printApiStatus(fun, router, res, 3)
})
//查看所有管理员
router.get('/getalladmin', (req, res) => {
  let { id, level } = req.auth
  let sqlstr_select = `select
                        id,
                        account ,
                        level ,
                        status ,
                        create_time ,
                        selfcode
                      from
                        admin a
                      where a.id!=?`
  let fun = function (resolve) {
    if (level == 10) {
      db.query(sqlstr_select, id, (err, result) => {
        if (err) {
          if (err.message == 'jwt expired') {
            throw err
          }
          console.log(err)
        }
        res.send({
          result,
          message: '查询所有管理员信息成功',
        })
        resolve()
      })
    } else {
      res.send({
        message: '权限不够',
      })
      resolve()
    }
  }
  printApiStatus(fun, router, res, 4)
})
//禁用管理员账号
router.post('/banadmin', (req, res) => {
  let { level } = req.auth
  let { id } = req.body
  let sqlstr_modify = `update admin set status=0 where id=${id}`
  let fun = function (resolve) {
    if (level > 5) {
      db.query(sqlstr_modify, (err, result) => {
        if (err) {
          if (err.message == 'jwt expired') {
            throw err
          }
          console.log(err)
        }
        res.send({
          message: '禁用账号成功',
          code: RES.modify_ok,
        })
        resolve()
      })
    } else {
      res.send({
        message: '权限不够',
      })
      resolve()
    }
  }
  printApiStatus(fun, router, res, 5)
})
//激活管理员账号
router.post('/activateadmin', (req, res) => {
  let { level } = req.auth
  let { id } = req.body
  let sqlstr_modify = `update admin set status=1 where id=${id}`
  let fun = function (resolve) {
    if (level > 5) {
      db.query(sqlstr_modify, (err, result) => {
        if (err) {
          if (err.message == 'jwt expired') {
            throw err
          }
          console.log(err)
        }
        res.send({
          message: '激活账号成功',
          code: RES.modify_ok,
        })
        resolve()
      })
    } else {
      res.send({
        message: '权限不够',
      })
      resolve()
    }
  }
  printApiStatus(fun, router, res, 6)
})
module.exports = router
