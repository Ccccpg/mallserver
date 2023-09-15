const { customAlphabet } = require('nanoid')
const RANDOM = require('../../conf/random.json')
function getRandom(type, first = '', arr = [], num = 10) {
  switch (type) {
    case RANDOM.code:
      let code = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXWZ', num)()
      if (arr.length == 0) {
        return code
      }
      while (arr.includes(code)) {
        code = customAlphabet('1234567890ABCDEFGHIJKLMNOPQRSTUVWXWZ', num)()
      }
      return code
    case RANDOM.id:
      let realnum = num - first.toString().length
      let id = first + customAlphabet('1234567890', realnum)()
      if (!arr || arr.length == 0) {
        return Number(id)
      }
      while (arr.includes(id)) {
        id = Number(first + customAlphabet('1234567890', realnum)())
      }
      return id
  }
}
module.exports = getRandom
