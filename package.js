/* global Package Npm */

Package.describe({
  name: 'hacknlove:ventanas',
  version: '1.3.0',
  summary: 'dynamic rendering system backed with mongo, with url persistence',
  git: 'https://github.com/hacknlove/meteor-ventanas',
  documentation: 'README.md'
})
Npm.depends({
  'jsonwebtoken': '8.5.1',
  'url-pattern': '1.0.3',
  'qs': '6.5.0'
})
Package.onUse(function (api) {
  api.versionsFrom('1.8.0.2')
  api.use('ecmascript')
  api.use('mongo', 'client')
  api.use('server-render')
  api.use('blaze-html-templates@1.1.2', 'client')
  api.use('underscore', 'client')
  api.use('meteor', 'client')

  api.use('webapp', 'server')
  api.addFiles('./common.js', 'client', 'server')
  api.addFiles('./ventanas.html', 'client')
  api.mainModule('client.js', 'client')
  api.mainModule('server.js', 'server')
})
