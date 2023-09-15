const express = require('express')
const BCRYPT = require('bcryptjs')
const RANDOM = require('../../../conf/random.json')
const RES = require('../../../conf/rescode.json')
let db = require('../../../db')
let router = express.Router()
let { printApiStatus } = require('../../utils/printApiStatus')
let getRandom = require('../../utils/getRandom')
let { formatStrToArr, isTheSameArrays } = require('../../utils/array')
//查询订单
router.get('/getorders', (req, res) => {
  let sqlstr_select = `select o.*,gv.name as goods_version ,i.images,g.name as goods,c.name as category from orders o
                      left join 
                      (select i.goods_version_id ,JSON_ARRAYAGG(i.url)as images 
                      from image i group by i.goods_version_id )i
                      on i.goods_version_id=o.goods_version_id 
                      left join goods_version gv on gv.id=i.goods_version_id 
                      left join goods g on g.id =gv.goods_id
                      left join category c on c.id =g.category_id `
  let fun = function (resolve) {
    db.query(sqlstr_select, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }
      res.send({
        result: formatStrToArr(result, 'images'),
        message: '查询订单成功',
      })
      resolve()
    })
  }
  printApiStatus(fun, router, res, 0)
})
//添加订单
router.post('/addorders', (req, res) => {
  let {
    num,
    goods_version_id,
    username,
    status,
    cause = '',
    address,
    _address,
    category_id,
  } = req.body

  let sqlstr_add = `insert into orders(id,num,goods_version_id,username,status,cause,address,_address,category_id) value(?,${num},${goods_version_id},'${username}',${Number(
    status
  )},'${cause}','${address}','${_address}',${category_id})`
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
        let sqlstr_select = `select JSON_ARRAYAGG(id)as idArr from orders`
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
          let id = getRandom(RANDOM.id, '113', idArr, 10)
          connection.query(sqlstr_add, id, err => {
            if (err) {
              return connection.rollback(() => {
                if (err.message == 'jwt expired') {
                  throw err
                }
                console.log(err)
              })
            }
            //根据订单id查询商品图片
            let sqlstr_select3 = `select current_price,c.name as category_name ,g.name as goods_name,url from orders o 
                                      left join image i on i.goods_version_id =o.goods_version_id
                                      left join goods_version gv on gv.id =o.goods_version_id 
                                      left join goods g on gv.goods_id =g.id 
                                      left join category c on c.id =g.category_id 
                                      where o.id=${id} `
            connection.query(sqlstr_select3, (err, result) => {
              if (err) {
                return connection.rollback(() => {
                  if (err.message == 'jwt expired') {
                    throw err
                  }
                  console.log(err)
                })
              }
              let { current_price, url, category_name, goods_name } = result[0]
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
                  id,
                  url,
                  current_price,
                  category_name,
                  goods_name,
                  code: RES.add_ok,
                  message: '订单添加成功',
                })
                resolve()
              })
            })
          })
        })
      })
    })
  }
  printApiStatus(fun, router, res, 1)
})
//修改订单
router.post('/modifyorders', (req, res) => {
  let {
    id,
    num,
    goods_version_id,
    username,
    status,
    cause,
    address,
    _address,
    category_id,
  } = req.body
  modifyData = {
    num: Number(num),
    goods_version_id,
    username,
    status: Number(status),
    cause,
    address,
    _address,
    category_id,
  }
  let sqlstr_modify = `update orders set ? where id=${id}`
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
          connection.commit(err => {
            if (err) {
              return connection.rollback(() => {
                if (err.message == 'jwt expired') {
                  throw err
                }
                console.log(err)
              })
            }
          })
          res.send({
            code: RES.modify_ok,
            message: '订单修改成功',
          })
          resolve()
        })
      })
    })
  }
  printApiStatus(fun, router, res, 2)
})
//删除订单
router.post('/deleteorders', (req, res) => {
  let { id } = req.body
  let sqlstr_select = `delete from orders where id=${id}`
  let fun = function (resolve) {
    db.query(sqlstr_select, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }
      res.send({
        code: RES.delete_ok,
        message: '删除订单成功',
      })
      resolve()
    })
  }
  printApiStatus(fun, router, res, 3)
})
module.exports = router
