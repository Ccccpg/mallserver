//处理重复sql的事务
function handleTransaction(
  arr,
  connection,
  sql,
  res,
  code,
  resolve,
  id = undefined
) {
  if (arr.length == 0) {
    //提交事务
    return connection.commit(err => {
      if (err) {
        return connection.rollback(() => {
          throw err
        })
      }
      res.send({
        id,
        code,
        message: '事务执行成功',
      })
      resolve()
    })
  }
  let first = arr.shift()
  connection.query(sql, first, err => {
    if (err) {
      return connection.rollback(() => {
        throw err
      })
    }
    handleTransaction(arr, connection, sql, res, code, resolve, id)
  })
}
module.exports = {
  handleTransaction,
}
