const express = require('express')
const RES = require('../../../conf/rescode.json')
let db = require('../../../db')
let router = express.Router()
let { printApiStatus } = require('../../utils/printApiStatus')
//根据员工id查询员工
router.get('/checkemployee', (req, res) => {
  let sqlstr_select = `select * from employee where id=?`
  let { id } = req.query
  let fun = function (resolve) {
    db.query(sqlstr_select, id, (err, result) => {
      if (err) {
        if (err.message == 'jwt expired') {
          throw err
        }
        console.log(err)
      }
      if (result.length >= 1) {
        res.send({
          result,
          code: RES.select_ok,
          message: '查询成功',
        })
      } else {
        res.send({
          result,
          code: RES.select_error,
          message: '查询成功',
        })
      }
      resolve()
    })
  }
  printApiStatus(fun, router, res, 0)
})
module.exports = router
