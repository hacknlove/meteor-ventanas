import { onPageLoad } from 'meteor/server-render'
import { readUrl, limpiarUrl, createUrl } from './common.js'
import UrlPaterrn from 'url-pattern'

const urls = []

export const ventanas = {
  use (url, callback) {
    urls.push([
      new UrlPaterrn(url),
      callback
    ])
  },
  createUrl,
  limpiarUrl,
  options: {
    query: 'v',
    timeout: 350,
    debounce: 500,
    jwt: {
      algorithm: 'none',
      key: undefined
    }
  }
}

onPageLoad(sink => {
  var match
  var callback
  urls.some(function (url) {
    match = url[0].match(sink.request.url.path)
    if (!match) {
      return
    }
    callback = url[1]
    return true
  })
  if (!match) {
    return
  }
  callback(sink, match, readUrl(sink.request.url.path, ventanas))
})
