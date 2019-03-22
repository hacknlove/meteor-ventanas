import jwt from 'jsonwebtoken'
const qs = require('qs')

export function readUrl (url, ventanas) {
  url = qs.parse(url)

  if (!url[ventanas.options.query]) {
    return []
  }
  try {
    url = jwt.verify(url[ventanas.options.query], ventanas.options.jwt.key).v

    return Object.keys(url).map(function (_id) {
      url[_id]._id = _id
      return url[_id]
    })
  } catch (e) {
    return []
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
