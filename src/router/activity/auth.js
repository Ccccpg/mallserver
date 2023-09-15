const express = require('express')
const db = require('../../../db')
const RANDOM = require('../../../conf/random.json')
const RES = require('../../../conf/rescode.json')
let router = express.Router()
let { getReservedPart, getInsertedPart } = require('../../utils/array')
let { handleTransaction } = require('../../utils/handleTransaction')
let getRandom = require('../../utils/getRandom')
let { printApiStatus } = require('../../utils/printApiStatus')
//查询所有活动
router.get('/getactivity', (req, res) => {
  let sqlstr_select = `select a.id,a.name ,a.discount,JSON_ARRAYAGG(c.name) as category ,a.starttime ,a.deadline ,a.status   
                        from activity a 
                        left join category_activity ca on ca.activity_id =a.id 
                        left join category c  on ca.category_id =c.id 
                        group by a.id   `
  const fun = resolve => {
    db.query(sqlstr_select, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }
      res.send({
        result,
        message: '查询活动数据成功',
      })
      resolve()
    })
  }
  printApiStatus(fun, router, res, 0)
})
//新增活动
router.post('/addactivity', (req, res) => {
  let sqlstr_select = `select JSON_ARRAYAGG(id)as idarr from activity a `
  let { categoryArr, name, discount, status, starttime, deadline } = req.body
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
          let { idarr } = result[0]
          idarr = idarr ? JSON.parse(idarr) : []
          let id = getRandom(RANDOM.id, '101', idarr, 10)
          let sqlstr_add = `insert into activity(id,name,discount,starttime,deadline,status) value(${id},?,?,?,?,?)`
          connection.query(
            sqlstr_add,
            [
              name,
              discount,
              starttime,
              deadline,
              (status = status == 'true' ? 1 : 0),
            ],
            err => {
              if (err) {
                return connection.rollback(() => {
                  if (err.message == 'jwt expired') {
                    throw err
                  }
                  console.log(err)
                })
              }
              categoryArr =
                Object.keys(JSON.parse(categoryArr)).length != 0
                  ? JSON.parse(categoryArr)
                  : []
              let sqlstr_add = `insert into category_activity(category_id,activity_id) value(?,${id})`
              handleTransaction(
                categoryArr,
                connection,
                sqlstr_add,
                res,
                RES.add_ok,
                resolve,
                id
              )
            }
          )
        })
      })
    })
  }
  printApiStatus(fun, router, res, 1)
})
//删除活动
router.post('/deleteactivity', (req, res) => {
  let { id } = req.body
  let sqlstr_delete = `delete from activity where id=${Number(id)}`
  let fun = function (resolve) {
    db.query(sqlstr_delete, err => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }
      res.send({
        code: RES.delete_ok,
        message: '活动删除成功',
      })
      resolve()
    })
  }
  printApiStatus(fun, router, res, 2)
})
//修改活动
router.post('/modifyactivity', (req, res) => {
  let { categoryArr, id, name, discount, starttime, deadline, status } =
    req.body
  let sqlstr_select = `select
                        JSON_ARRAYAGG(ca.category_id)as preCategoryArr
                      from
                        category_activity ca
                      group by
                        ca.activity_id
                      having
                        ca.activity_id =${id} `
  let sqlstr_modify = `update activity set ? where id=${Number(id)}`
  let sqlstr_delete = `delete from category_activity where activity_id=${Number(
    id
  )}`
  let reserve = []
  let insert = []
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
        let modifyData = {
          name,
          discount: Number(discount),
          starttime,
          deadline,
          status: status == 'true' ? 1 : 0,
        }
        connection.query(sqlstr_modify, modifyData, err => {
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
            result[0] = result[0] ? result[0] : []
            let { preCategoryArr } = result[0]
            preCategoryArr = preCategoryArr ? JSON.parse(preCategoryArr) : []
            categoryArr =
              Object.keys(JSON.parse(categoryArr)).length != 0
                ? JSON.parse(categoryArr)
                : []
            reserve = getReservedPart(preCategoryArr, categoryArr)
            insert = getInsertedPart(preCategoryArr, categoryArr)
            reserve.length != 0
              ? reserve.forEach(r => {
                  sqlstr_delete =
                    sqlstr_delete + ` and category_id!=${Number(r)}`
                })
              : (sqlstr_delete = sqlstr_delete + ' and 0')

            connection.query(sqlstr_delete, err => {
              if (err) {
                return connection.rollback(() => {
                  if (err.message == 'jwt expired') {
                    throw err
                  }
                  console.log(err)
                })
              }
              let sqlstr_add = `insert into category_activity(category_id,activity_id) value(?,${Number(
                id
              )})`
              handleTransaction(
                insert,
                connection,
                sqlstr_add,
                res,
                RES.modify_ok,
                resolve
              )
            })
          })
        })
      })
    })
  }
  printApiStatus(fun, router, res, 3)
})
module.exports = router
