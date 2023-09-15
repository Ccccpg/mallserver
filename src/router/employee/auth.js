const express = require('express')
const RANDOM = require('../../../conf/random.json')
const RES = require('../../../conf/rescode.json')
let db = require('../../../db')
let router = express.Router()
let { printApiStatus } = require('../../utils/printApiStatus')
let getRandom = require('../../utils/getRandom')
//获取所有员工
router.get('/getemployee', (req, res) => {
  let sqlstr_select = `select
                        e.id,
                        e.name ,
                        e.gender ,
                        e.age ,
                        e.job ,
                        e.address ,
                        e.create_time,
                        e.status
                      from
                        employee e`
  let fun = function (resolve) {
    db.query(sqlstr_select, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      } else {
        if (result.length >= 1) {
          res.send({
            result,
            message: '数据查询成功!',
          })
          resolve()
        }
      }
    })
  }
  printApiStatus(fun, router, res, 0)
})
//修改员工
router.post('/modifyemployee', (req, res) => {
  let sqlstr_modify = 'update employee set ? where id=?'
  let { id, name, age, gender, job, address } = req.body
  let newEmployee = { name, age, gender, job, address }
  let fun = function (resolve) {
    db.query(sqlstr_modify, [newEmployee, id], (err, result) => {
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
  printApiStatus(fun, router, res, 1)
})
//添加员工
router.post('/addemployee', (req, res) => {
  let sqlstr_add =
    'insert into employee(id,name,gender,age,address,job) value(?,?,?,?,?,?)'
  let sqlstr_select = `select JSON_ARRAYAGG(id) idArr from employee`
  let body = req.body

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
        connection.query(sqlstr_select, (err, result) => {
          if (err) {
            return connection.rollback(() => {
              if (err.message == 'jwt expired') {
                throw err
              }
              console.log(err)
            })
          }
          let { idArr = [] } = result[0]
          let id = getRandom(RANDOM.id, '109', idArr)
          connection.query(
            sqlstr_add,
            [
              id,
              body.name,
              body.gender,
              Number(body.age),
              body.address,
              body.job,
            ],
            (err, result) => {
              if (err) {
                return connection.rollback(() => {
                  if (err.message == 'jwt expired') {
                    throw err
                  }
                  console.log(err)
                })
              } else {
                connection.commit(err => {
                  if (err) {
                    if (err) {
                      return connection.rollback(() => {
                        if (err.message == 'jwt expired') {
                          throw err
                        }
                        console.log(err)
                      })
                    }
                  } else {
                    if (result.affectedRows >= 1) {
                      res.send({
                        code: RES.add_ok,
                        id,
                        message: '员工添加成功!',
                      })
                      resolve()
                    }
                  }
                })
              }
            }
          )
        })
      })
    })
  }
  printApiStatus(fun, router, res, 2)
})

//删除员工
router.post('/deleteemployee', (req, res) => {
  let sqlstr_delete = 'delete from employee where id=?'
  let body = req.body
  let fun = function (resolve) {
    db.query(sqlstr_delete, body.id, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      } else {
        res.send({
          code: RES.delete_ok,
          message: '数据删除成功!',
        })
        resolve()
      }
    })
  }
  printApiStatus(fun, router, res, 3)
})
module.exports = router
