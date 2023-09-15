const express = require('express')
const RANDOM = require('../../../conf/random.json')
const RES = require('../../../conf/rescode.json')
let db = require('../../../db')
let router = express.Router()
let { printApiStatus } = require('../../utils/printApiStatus')
let getRandom = require('../../utils/getRandom')
let { handleTransaction } = require('../../utils/handleTransaction')
let {
  getReservedPart,
  getInsertedPart,
  formatStrToArr,
} = require('../../utils/array')
//获取商品类别
router.get('/getcategory', (req, res) => {
  let sqlstr_select = `select
                        c.id ,
                        c.name ,
                        JSON_ARRAYAGG(a.name) as activity,
                        specification
                      from
                        category c
                      left join category_activity ca on
                        c.id = ca.category_id
                      left join activity a on
                        ca.activity_id = a.id
                      left join                                     
                      (select
                          cs.category_id as id,
                          JSON_ARRAYAGG(JSON_OBJECT('id',s.id,'name',s.name,'attributes',sa.attributes ))as specification
                        from
                          category_specification cs
                        left join specification s on
                          cs.specification_id = s.id
                        left join (select s.id,JSON_ARRAYAGG(a.name)as attributes 
                                    from specification s 
                                    left join attribute a on a.specification_id =s.id 
                                    group by s.id )sa
                        on sa.id=s.id 
                        group by
                          cs.category_id)css 
                        on
                        css.id = c.id
                        group by c.id`
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
            code: RES.select_ok,
            result: formatStrToArr(result, 'specification', 'activity'),
            message: '数据查询成功!',
          })
          resolve()
        }
      }
    })
  }
  printApiStatus(fun, router, res, 0)
})
//添加数据接口
router.post('/addcategory', async (req, res) => {
  let sqlstr_add = 'insert into category(id,name) value(?,?)'
  let sqlstr_select = 'select JSON_ARRAYAGG(id)as cids from category'
  let { name } = req.body
  let id = getRandom(RANDOM.id, 104)

  let fun = function (resolve) {
    db.query(sqlstr_select, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }
      let { cids } = result[0]
      cids = JSON.parse(cids)
      while (cids.includes(id)) {
        id = getRandom(RANDOMTYPE.id, 104)
      }
      db.query(sqlstr_add, [id, name], (err, result) => {
        if (err) {
          if (err.message == 'jwt expired') {
            throw err
          }
          console.log(err)
        }
        if (result.affectedRows == 1) {
          res.send({
            code: RES.add_ok,
            id,
            message: '数据添加成功!',
          })
          resolve()
        }
      })
    })
  }
  printApiStatus(fun, router, res, 1)
})
//修改数据接口
router.post('/modifycategory', (req, res) => {
  let { id, name, specification = [] } = req.body
  specification = JSON.parse(specification)
  let sqlstr_modify = `update category set ? where id=${id}`
  let sqlstr_select = `select
                        cs.category_id ,
                        JSON_ARRAYAGG(cs.specification_id)as allspecification
                      from
                        category_specification cs
                      group by
                        cs.category_id
                      having category_id =?`
  let sqlstr_delete = `delete  from category_specification cs where cs.category_id =${id}`

  let modifyData = {
    name,
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
          connection.query(sqlstr_select, id, (err, result) => {
            if (err) {
              return connection.rollback(() => {
                if (err.message == 'jwt expired') {
                  throw err
                }
                console.log(err)
              })
            }
            let { allspecification = [] } = result
            let reserve = getReservedPart(allspecification, specification)
            let insert = getInsertedPart(allspecification, specification)
            reserve.forEach(r => {
              sqlstr_delete = sqlstr_delete + ` and specification_id!=${r}`
            })
            let sqlstr_add = `insert into category_specification(category_id,specification_id) value(${id},?)`
            connection.query(sqlstr_delete, err => {
              if (err) {
                return connection.rollback(() => {
                  if (err.message == 'jwt expired') {
                    throw err
                  }
                  console.log(err)
                })
              }
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
  printApiStatus(fun, router, res, 2)
})
//删除数据接口
let sqlstr_delete = 'delete from category where id=?'
router.post('/deletecategory', (req, res) => {
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
//查询该商品类别的所有参数
router.get('/getcategoryallparams', (req, res) => {
  let sqlstr_select = `select c.id as category_id ,c.name as categoryName ,JSON_ARRAYAGG(JSON_OBJECT('specification',s.name ,'attributeArr',spa.attributeArr))as allparameterArr
                        from 
                        category c 
                        left join category_specification cs 
                        on c.id =cs.category_id 
                        left join
                        specification s 
                        on cs.specification_id =s.id
                        left join
                        (select specification_id,JSON_ARRAYAGG(JSON_OBJECT('id',id,'attribute',name))as attributeArr
                        from attribute a 
                        group by specification_id 
                        )spa 
                        on spa.specification_id=s.id 
                        group by c.id 
                        having c.id=?`
  let fun = function (resolve) {
    let { id } = req.query
    db.query(sqlstr_select, id, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }
      res.send({
        result,
        message: '查询商品类别的所有参数成功',
      })
      resolve()
    })
  }
  printApiStatus(fun, router, res, 4)
})
//查询商品类别的所有商品包括商品版本
router.get('/getallgoodsbycategory', (req, res) => {
  let sqlstr_select = `select c.name as category ,g.name as goods ,gv.versions as goods_version
                        from category c  
                        left join goods g on g.category_id =c.id 
                        left join 
                        (select gv.goods_id ,JSON_ARRAYAGG(JSON_OBJECT('id',gv.id,'version',gv.name))as versions
                        from goods_version gv 
                        group by gv.goods_id )gv 
                        on gv.goods_id=g.id `
  let fun = function (resolve) {
    db.query(sqlstr_select, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }
      res.send({
        result: formatStrToArr(result, 'goods_version'),
        message: '查询商品类别的所有商品和商品版本成功',
      })
      resolve()
    })
  }
  printApiStatus(fun, router, res, 5)
})
module.exports = router
