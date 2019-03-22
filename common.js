import jwt from 'jsonwebtoken'

export const limpiarUrl = function (url) {
  url = url.match(/[?&]client=[^&]*/)
  if (!url) {
    return false
  }
  return url.replace(/.*?([^/]+)$/, '$1')
}

export function readUrl (url, ventanas) {
  url = limpiarUrl(url)
  if (!url) {
    return []
  }
  try {
    return jwt.verify(url, ventanas.options.jwt.key)
  } catch (e) {
    return []
  }
}

export function createUrl (array, ventanas) {
  return jwt.sign(array, ventanas.options.jwt.key, { algorithm: ventanas.options.jwt.algorithm })
}
