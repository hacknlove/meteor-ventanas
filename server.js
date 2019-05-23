import { onPageLoad } from 'meteor/server-render'
import { readUrl, limpiarUrl, createUrl } from './common.js'
import UrlPatern from 'url-pattern'

const urls = []

export const ventanas = {
  use (url, callback) {
    urls.push([
      new UrlPatern(url, ventanas.options.urlPaternOptions),
      callback
    ])
  },
  useRegex (regex, array, callback) {
    urls.push([
      new UrlPatern(regex, array, ventanas.options.urlPaternOptions),
      callback
    ])
  },
  createUrl (payload) {
    return createUrl(payload, ventanas)
  },
  limpiarUrl (payload) {
    return limpiarUrl(payload, ventanas)
  },
  readUrl (payload) {
    return readUrl(payload, ventanas)
  },
  options: {
    query: 'v',
    timeout: 350,
    debounce: 500,
    urlPaternOptions: {
      segmentValueCharset: 'a-zA-Z0-9-_~%.'
    },
    jwt: {
      algorithm: 'none',
      key: undefined
    }
  }
}

onPageLoad(sink => {
  var match
  var callback
  const path = sink.request.url.path.split('?')
  urls.some(function (url) {
    match = url[0].match(path[0])
    if (!match) {
      return
    }
    callback = url[1]
    return true
  })
  if (!match) {
    return
  }
  callback(sink, match, ventanas.readUrl(path[1]))
})
