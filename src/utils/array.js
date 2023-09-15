//获取保留部分
function getReservedPart(previous, current) {
  let arr = []
  previous.forEach(p => {
    if (current.includes(p)) {
      arr.push(p)
    }
  })
  return arr
}
//获取插入部分
function getInsertedPart(previous, current) {
  let arr = []
  current.forEach(p => {
    if (!previous.includes(p)) {
      arr.push(p)
    }
  })
  return arr
}
//判断是否是元素相同的数组
function isTheSameArrays(arr1, arr2) {
  if (arr1.length == arr2.length) {
    return arr1.every(a1 => arr2.includes(a1))
  }
  return false
}
//将json字符串转为数组
function formatStrToArr(data, ...strs) {
  const first = strs.shift()
  function getNotHasNullArr(_temp) {
    return _temp.filter(t => t)
  }

  data = data.map(d => {
    if (Object.keys(d).includes(first)) {
      let temp = JSON.parse(d[first])
      if (temp instanceof Array) {
        d[first] = getNotHasNullArr(temp)
      } else if (temp instanceof Object) {
        let arr = []
        for (let key in temp) {
          arr.push(temp[key])
        }
        d[first] = arr
      } else {
        d[first] = []
      }
    }
    return d
  })
  while (strs.length == 0) {
    return data
  }
  return formatStrToArr(data, ...strs)
}
module.exports = {
  getInsertedPart,
  getReservedPart,
  isTheSameArrays,
  formatStrToArr,
}
