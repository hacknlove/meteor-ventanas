import { Base64 } from 'js-base64'
import bencode from 'bencode'

export const limpiarUrl = function (url) {
  return url.replace(/.*?([^/]+)$/, '$1')
}

export function readUrl (url) {
  try {
    return bencode.decode(Base64.decode(limpiarUrl(url)), 'utf-8') || []
  } catch (e) {
    return []
  }
}

export function createUrl (array) {
  return Base64.encodeURI(bencode.encode(array))
}
