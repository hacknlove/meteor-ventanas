import jwt from 'jsonwebtoken'
const qs = require('qs')

export function readUrl (url, ventanas) {
  url = qs.parse(url)
  var array = []
  array.query = url
  if (!url[ventanas.options.query]) {
    return array
  }
  try {
    url = jwt.verify(url[ventanas.options.query], ventanas.options.jwt.key).v

    array = Object.keys(url).map(function (_id) {
      url[_id]._id = _id
      return url[_id]
    })
    array.query = url
    return array
  } catch (e) {
    return array
  }
}

export function createUrl (array, ventanas) {
  const payload = {}
  array.forEach(function (v) {
    const _id = v._id
    delete v._id
    payload[_id] = v
  })
  return jwt.sign({
    v: payload
  }, ventanas.options.jwt.key, { algorithm: ventanas.options.jwt.algorithm })
}
