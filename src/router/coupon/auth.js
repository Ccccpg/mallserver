const express = require('express')
const RANDOM = require('../../../conf/random.json')
const RES = require('../../../conf/rescode.json')
const db = require('../../../db')
let router = express.Router()
let getRandom = require('../../utils/getRandom')
let { printApiStatus } = require('../../utils/printApiStatus')
let { handleTransaction } = require('../../utils/handleTransaction')
let {
  getReservedPart,
  getInsertedPart,
  formatStrToArr,
} = require('../../utils/array')
//查询所有优惠券信息
router.get('/getcoupon', (req, res) => {
  let sqlstr_select = `select
                            c.id,
                            c.description ,
                            c.status ,
                            c.min ,
                            c.max ,
                            c.stock,
                            JSON_ARRAYAGG(c2.name)as category ,
                            c.starttime ,
                            c.deadline
                        from
                            coupon c
                        left join category_coupon cc on
                            c.id = cc.coupon_id
                        left join category c2 on
                            cc.category_id = c2.id
                        group by
                            c.id`
  let fun = function (resolve) {
    db.query(sqlstr_select, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }

      res.send({
        result: formatStrToArr(result, 'category'),
        message: '查询优惠券数据成功',
      })
      resolve()
    })
  }
  printApiStatus(fun, router, res, 0)
})
//添加优惠券
router.post('/addcoupon', (req, res) => {
  let sqlstr_add = `insert into coupon(id,description,min,max,stock,starttime,deadline,status) value(?,?,?,?,?,?,?,?)`
  let sqlstr_select = `select JSON_ARRAYAGG(id)as idArr from coupon`
  let {
    categoryArr,
    description,
    min,
    max,
    stock,
    starttime,
    deadline,
    status,
  } = req.body
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
          let id = getRandom(RANDOM.id, '108', idArr, 10)
          connection.query(
            sqlstr_add,
            [
              id,
              description,
              Number(min),
              Number(max),
              Number(stock),
              starttime,
              deadline,
              status == 'true' ? 1 : 0,
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
              let sqlstr_add2 = `insert into category_coupon(category_id,coupon_id) value(?,${id})`
              categoryArr =
                Object.keys(JSON.parse(categoryArr)).length != 0
                  ? JSON.parse(categoryArr)
                  : []
              handleTransaction(
                categoryArr,
                connection,
                sqlstr_add2,
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
//删除优惠券
router.post('/deletecoupon', (req, res) => {
  let sqlstr_delete = `delete from coupon where id=?`
  let { id } = req.body
  let fun = function (resolve) {
    db.query(sqlstr_delete, id, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }

      res.send({
        result,
        message: '删除优惠券数据成功',
      })
      resolve()
    })
  }
  printApiStatus(fun, router, res, 2)
})
//修改优惠券
router.post('/modifycoupon', (req, res) => {
  let {
    id,
    description,
    min,
    max,
    starttime,
    deadline,
    status,
    stock,
    categoryArr,
  } = req.body
  let sqlstr_modify = `update coupon set ? where id=${id}`
  let sqlstr_delete = `delete from category_coupon where coupon_id=${id}`
  let sqlstr_select = `select
                      JSON_ARRAYAGG(cc.category_id)as idArr
                    from
                      category_coupon cc
                    group by
                      cc.coupon_id
                    having
                      cc.coupon_id = ${id}`
  let modifyData = {
    description,
    min,
    max,
    starttime,
    deadline,
    status: status == 'true' ? 1 : 0,
    stock,
  }
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
            let { idArr } = result[0]
            idArr = idArr ? JSON.parse(idArr) : []
            categoryArr =
              Object.keys(JSON.parse(categoryArr)).length != 0
                ? JSON.parse(categoryArr)
                : []
            let reserve = getReservedPart(idArr, categoryArr)
            let insert = getInsertedPart(idArr, categoryArr)
            reserve.length != 0
              ? reserve.forEach(r => {
                  sqlstr_delete = sqlstr_delete + ` and category_id!=${r}`
                })
              : (sqlstr_delete = sqlstr_delete + ` and 0`)
            connection.query(sqlstr_delete, err => {
              if (err) {
                return connection.rollback(() => {
                  if (err.message == 'jwt expired') {
                    throw err
                  }
                  console.log(err)
                })
              }
              let sqlstr_add = `insert into category_coupon(category_id,coupon_id) value(?,${id})`
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
