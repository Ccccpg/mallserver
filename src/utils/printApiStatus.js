function printApiStatus(dbQuery, router, res, index) {
  let promise = new Promise(reslove => {
    dbQuery(reslove)
  })
  promise.then(() => {
    console.log(
      `${router.stack[index].route.stack[0].method.toUpperCase()} ${
        router.stack[index].route.path
      } \x1b[32m%s\x1b[0m`,
      res.statusMessage + ' ' + res.statusCode
    )
  })
}
module.exports = {
  printApiStatus,
}
