/* global Package Npm */

Package.describe({
  name: 'hacknlove:ventanas',
  version: '0.0.1',
  summary: 'dynamic rendering system backed with mongo, with url persistence',
  git: 'https://github.com/hacknlove/meteor-ventanas',
  documentation: 'README.md'
})
Npm.depends({
  bencode: '2.0.1',
  'js-base64': '2.5.1'
})
Package.onUse(function (api) {
  api.versionsFrom('1.8.0.2')
  api.use('ecmascript')
  api.use('mongo', 'client')
  api.use('blaze-html-templates@1.1.2', 'client')
  api.use('underscore', 'client')
  api.use('meteor', 'client')

  api.use('webapp', 'server')
  api.addFiles('./common.js', 'client', 'server')
  api.addFiles('./ventanas.html', 'client')
  api.mainModule('client.js', 'client')
  api.mainModule('server.js', 'server')
})
