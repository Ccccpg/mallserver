const express = require('express')
let db = require('../../../db')
let { printApiStatus } = require('../../utils/printApiStatus')
let router = express.Router()
router.get('/getstatistic', (req, res) => {
  let sqlstr_select = `select
                        admin_num,(select count(a.id) from admin a)as alladmin_num,
                        goods_num,(select count(g.id) from goods g)as allgoods_num,
                        coupon_num,(select count(c.id) from coupon c)as allcoupon_num,
                        orders_num,(select count(o.id) from orders o)as allorders_num,
                        register_num,(select count(r.id) from register r)as allregister_num,
                        today_order_num,yes_order_num
                      from
                        (
                        select
                          count(id)as admin_num
                        from
                          admin
                        where admin.status=1)a,
                        (
                        select
                          count(id)as goods_num
                        from
                          goods
                        where goods.status=1)g,
                        (
                        select
                          count(id)as coupon_num
                        from
                          coupon co
                        where co.status=1)c2,
                        (
                        select
                          count(id)as orders_num
                        from
                          orders os
                        where os.status='已完成')o,
                        (select count(id)as register_num from register r2 where r2.status!=-1)r,
                        (select count(id)as today_order_num
                        from orders 
                        where create_time like concat(DATE_FORMAT(NOW(),'%Y-%m-%d'),'%'))o2,
                        (select count(id)as yes_order_num
                        from orders 
                        where create_time like concat(DATE_FORMAT(DATE_SUB(now(),interval 1 day),'%Y-%m-%d'),'%'))o3`
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
        message: '查询统计数据成功',
      })
      resolve()
    })
  }
  printApiStatus(fun, router, res, 0)
})
//查询热销前五的商品类别
router.get('/gettop5category', (req, res) => {
  sqlstr_select = `select c.name ,sum(o.num)as sale
                    from orders o 
                    left join category c  
                    on o.category_id = c.id 
                    group by o.category_id
                    order by sale desc 
                    limit 5  `
  let fun = function (resolve) {
    db.query(sqlstr_select, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }
      result = result ? result : []
      res.send({
        code: res.select_ok,
        result,
      })
      resolve()
    })
  }
  printApiStatus(fun, router, res, 1)
})
//查询销量前5的商品
router.get('/gettop5goods', (req, res) => {
  let sqlstr_select = `select g.name,sum(o.num)as sale 
                        from 
                        orders o 
                        left join goods_version gv on gv.id =o.goods_version_id 
                        left join goods g on g.id =gv.goods_id 
                        group by g.id 
                        order by sale desc 
                        limit 5`
  let fun = function (resolve) {
    db.query(sqlstr_select, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }
      result = result ? result : []
      res.send({
        code: res.select_ok,
        result,
      })
      resolve()
    })
  }
  printApiStatus(fun, router, res, 2)
})
module.exports = router
