const express = require('express')
const RANDOM = require('../../../conf/random.json')
const RES = require('../../../conf/rescode.json')
const moment = require('moment')
let db = require('../../../db')
let router = express.Router()
let { printApiStatus } = require('../../utils/printApiStatus')
let getRandom = require('../../utils/getRandom')
let { formatStrToArr } = require('../../utils/array')
//查询所有商品
router.get('/getgoods', (req, res) => {
  let sqlstr_select = `select
                      g.id ,
                      g.name,
                      c.name as category ,
                      c.id as category_id,
                      g.create_time ,
                      JSON_ARRAYAGG(i.url)as images,
                      g.freemail ,
                      g.description ,
                      g.status,
                      gv2.versions
                    from
                      goods g
                    left join category c on
                      g.category_id = c.id
                    left join goods_version gv on
                      gv.goods_id = g.id
                    left join image i on
                      i.goods_version_id = gv.id
                    left join 
                                            (
                      select
                        gv.goods_id ,
                        JSON_ARRAYAGG(JSON_OBJECT('id',
                        gv.id,
                        'version',
                        gv.name))as versions
                      from
                        goods_version gv
                      group by
                        gv.goods_id )gv2 
                    on
                      gv2.goods_id = g.id
                    group by
                      g.id`
  let fun = function (resolve) {
    db.query(sqlstr_select, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      } else {
        res.send({
          result: formatStrToArr(result, 'images', 'versions'),
          message: '商品查询成功',
        })
        resolve()
      }
    })
  }
  printApiStatus(fun, router, res, 0)
})
//新增商品
router.post('/addgoods', (req, res) => {
  let sqlstr_add = `insert into goods(id,name,description,freemail,category_id,status) 
                    value(?,?,?,?,?,?)`
  let sqlstr_select = `select JSON_ARRAYAGG(id)as idArr from goods `
  let { name, description, freemail, category_id, status, specification_list } =
    req.body
  freemail = freemail == 'false' ? 0 : 1
  status = status == 'false' ? 0 : 1
  category_id = Number(category_id)
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
          idArr = JSON.parse(idArr)
          let id = getRandom(RANDOM.id, 109, idArr)
          connection.query(
            sqlstr_add,
            [id, name, description, freemail, category_id, status],
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
                  code: RES.add_ok,
                  result: {
                    id,
                    create_time: moment(new Date()).format(
                      'YYYY-MM-DD HH:mm:ss'
                    ),
                  },
                  message: '商品添加成功',
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
//修改商品信息
router.post('/modifygoods', (req, res) => {
  let { id, name, description, freemail, status, category_id } = req.body
  let sqlstr_modify = `update goods set ? where id=${id}`
  let fun = function (resolve) {
    let modifyData = {
      name,
      description,
      freemail: freemail == 'true' ? 1 : 0,
      status: status == 'true' ? 1 : 0,
      category_id: Number(category_id),
    }
    db.query(sqlstr_modify, modifyData, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      } else {
        if (result.affectedRows >= 1) {
          res.send({
            code: RES.modify_ok,
            message: '商品修改成功',
          })
          resolve()
        }
      }
    })
  }
  printApiStatus(fun, router, res, 2)
})
//删除商品
router.post('/deletegoods', (req, res) => {
  let sqlstr_delete = `delete from goods where id=?`
  let { id } = req.body
  let fun = function (resolve) {
    db.query(sqlstr_delete, id, err => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }
      res.send({
        code: RES.delete_ok,
        message: '商品删除成功',
      })
      resolve()
    })
  }
  printApiStatus(fun, router, res, 3)
})
//查询该商品的所有版本
// router.get('/getgoodversion', (req, res) => {
//   let sqlstr_select = `select gv.id as id ,g.name as good,g.id as goods_id,g.category_id ,JSON_ARRAYAGG(a.name)as version,gvi.images ,gv.stock ,gv.price ,gv.current_price
//                         from
//                         goods_version gv
//                         left join goods_version_attribute gva
//                         on gva.goods_version_id=gv.id
//                         left join goods g
//                         on g.id  =gv.goods_id
//                         left join attribute a
//                         on a.id =gva.attribute_id
//                         left join
//                         (select gv.id,JSON_ARRAYAGG(i.url)as images from goods_version gv
//                         left join image i on gv.id =i.goods_version_id
//                         group by gv.id )gvi
//                         on gvi.id=gv.id
//                         left join specification s
//                         on s.id =a.specification_id
//                         group by gv.id
//                         having goods_id =?`
//   let fun = function (resolve) {
//     let { id } = req.query
//     db.query(sqlstr_select, id, (err, result) => {
//       if (err) {
//         console.log(err)
//       }
//       res.send({
//         result,
//         num: result.length,
//         message: '查询商品的所有版本成功',
//       })
//       resolve()
//     })
//   }
//   printApiStatus(fun, router, res, 4)
// })
router.get('/getgoodversion', (req, res) => {
  let { id } = req.query
  let sqlstr_select = `select g.id ,g.name ,gvi.versions
                      from goods g 
                      left join 
                      (select gv.goods_id ,JSON_ARRAYAGG(JSON_OBJECT('id',gv.id,'name',gv.name,'price',gv.price,'currentPrice',gv.current_price,'stock',gv.stock,'imageUrl',i.imageArr)) as versions
                      from goods_version gv 
                      left join 
                      (select i2.goods_version_id ,JSON_ARRAYAGG(i2.url)as imageArr 
                        from image i2 
                        group by i2.goods_version_id )i
                        on i.goods_version_id=gv.id
                      group by gv.goods_id)gvi
                      on gvi.goods_id=g.id 
                      where g.id=${id}`
  let fun = function (resolve) {
    db.query(sqlstr_select, id, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }
      let rr = formatStrToArr(result, 'versions')
      res.send({
        result: rr,
        num: result.length,
        message: '查询商品的所有版本成功',
      })
      resolve()
    })
  }
  printApiStatus(fun, router, res, 4)
})

//删除商品版本
router.post('/deletegoodsversion', (req, res) => {
  let sqlstr_delete = `delete from goods_version where id =?`
  let { id } = req.body
  // specification_list = JSON.parse(specification_list)
  let fun = function (resolve) {
    db.query(sqlstr_delete, Number(id), (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      } else {
        res.send({
          code: RES.delete_ok,
          message: '商品版本删除成功',
        })
        resolve()
      }
    })
  }
  printApiStatus(fun, router, res, 5)
})
//新增商品版本
router.post('/addgoodsversion', (req, res) => {
  let { id, stock, price, currentPrice, imageUrl, name } = req.body
  console.log(id, stock, price, currentPrice, imageUrl, name)
  let sqlstr_add = `insert into goods_version(goods_id,stock,price,current_price,name) value(${id},${stock},${price},${currentPrice},'${name}')`
  let sqlstr_select = `select max(id)as maxid from goods_version`
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
        connection.query(sqlstr_add, err => {
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
            let { maxid = -1 } = result[0]
            let sqlstr_delete = `delete from image where goods_version_id=${maxid}`
            connection.query(sqlstr_delete, err => {
              if (err) {
                return connection.rollback(() => {
                  if (err.message == 'jwt expired') {
                    throw err
                  }
                  console.log(err)
                })
              }
              let sqlstr_add2 = `insert into image(url,goods_version_id) value('${imageUrl}',${maxid})`
              connection.query(sqlstr_add2, err => {
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
                    code: RES.add_ok,
                    message: '商品版本添加成功',
                  })
                  resolve()
                })
              })
            })
          })
        })
      })
    })
  }
  printApiStatus(fun, router, res, 6)
})
//修改商品版本
router.post('/modifygoodsversion', (req, res) => {
  let { id, stock, price, currentPrice, imageUrl, name } = req.body
  let sqlstr_modify = `update goods_version set ? where id=${id}`
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
          id,
          stock,
          price,
          current_price: currentPrice,
          name,
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
          let sqlstr_delete = `delete from image where goods_version_id=${id}`
          connection.query(sqlstr_delete, err => {
            if (err) {
              return connection.rollback(() => {
                if (err.message == 'jwt expired') {
                  throw err
                }
                console.log(err)
              })
            }
            let sqlstr_add = `insert into image(url,goods_version_id) value('${imageUrl}',${id})`
            connection.query(sqlstr_add, err => {
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
                  message: '商品版本修改成功',
                })
              })
            })
          })
        })
      })
    })
  }
  printApiStatus(fun, router, res, 6)
})
module.exports = router
