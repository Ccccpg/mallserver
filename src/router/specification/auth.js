const express = require('express')
const RANDOM = require('../../../conf/random.json')
const RES = require('../../../conf/rescode.json')
const db = require('../../../db')
let router = express.Router()
let { printApiStatus } = require('../../utils/printApiStatus')
let getRandom = require('../../utils/getRandom')
let { handleTransaction } = require('../../utils/handleTransaction')
let {
  getInsertedPart,
  getReservedPart,
  formatStrToArr,
} = require('../../utils/array')
//获取规格
router.get('/getspecification', (req, res) => {
  let sqlstr_select = `select
                        s.id ,
                        s.name,
                        JSON_ARRAYAGG(a.name)as attribute ,
                        s.create_time
                      from
                        specification s
                      left join attribute a on
                        s.id = a.specification_id
                      group by
                        s.id`
  let fun = function (resolve) {
    db.query(sqlstr_select, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      } else {
        res.send({
          result: formatStrToArr(result, 'attribute'),
        })
        resolve()
      }
    })
  }
  printApiStatus(fun, router, res, 0)
})
//修改规格名
router.post('/modifyspecification', (req, res) => {
  let { id, name, attributeArr } = req.body
  attributeArr = JSON.parse(attributeArr)
  let modifyData = {
    name,
  }
  let sqlstr_select = `select JSON_ARRAYAGG(a.name)as attrArr 
                    from specification s 
                    left join attribute a on a.specification_id =s.id
                    group by s.id 
                    having s.id=${id}`
  let sqlstr_modify = `update specification set ? where id=${id}`
  let sqlstr_delete = `delete from attribute where specification_id=${id}`

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
            let { attrArr = [] } = result[0]
            attrArr = JSON.parse(attrArr)
            let reserve = getReservedPart(attrArr, attributeArr)
            let insert = getInsertedPart(attrArr, attributeArr)
            reserve.forEach(r => {
              sqlstr_delete = sqlstr_delete + ` and name!='${r}'`
            })
            connection.query(sqlstr_delete, err => {
              if (err) {
                return connection.rollback(() => {
                  if (err.message == 'jwt expired') {
                    throw err
                  }
                  console.log(err)
                })
              }
              let sqlstr_add = `insert into attribute(name,specification_id) value(?,${id})`
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
  printApiStatus(fun, router, res, 1)
})
//添加数据接口
router.post('/addspecification', (req, res) => {
  let sqlstr_add = 'insert into specification(id,name) value(?,?)'
  let { name } = req.body
  let id = getRandom(RANDOM.id, '115', undefined, 10)
  let fun = function (resolve) {
    db.query(sqlstr_add, [id, name], (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      } else {
        res.send({
          id,
          code: RES.add_ok,
          message: '规格添加成功!',
        })
        resolve()
      }
    })
  }
  printApiStatus(fun, router, res, 2)
})
//删除数据接口
let sqlstr_delete = 'delete from specification where id=?'
router.post('/deletespecification', (req, res) => {
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
          code: RES.d,
          message: '规格删除成功!',
        })
        resolve()
      }
    })
  }
  printApiStatus(fun, router, res, 3)
})
//查询属性id-name键值对成功
router.get('/getattribute_entries', (req, res) => {
  let sqlstr_select = `select JSON_ARRAYAGG(JSON_OBJECT('id',id,'name',name))as attribute_entries from attribute  `
  let fun = function (resolve) {
    db.query(sqlstr_select, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }
      res.send({
        result,
        message: '查询属性id-name键值对成功',
      })
      resolve()
    })
  }
  printApiStatus(fun, router, res, 4)
})
module.exports = router
