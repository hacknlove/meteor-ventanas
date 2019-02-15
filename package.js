/* global Package Npm */

Package.describe({
  name: 'hacknlove:ventanas',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
})
Npm.depends({
  bencode: '2.0.1'
})

Package.onUse(function (api) {
  api.versionsFrom('1.8.0.2')
  api.use('ecmascript')
  api.use('mongo', 'client')
  api.use('templating', 'client')
  api.addFiles('./common.js', 'client', 'server')
  api.addFiles('./ventanas.html', 'client')
  api.mainModule('client.js', 'client')
  api.mainModule('server.js', 'server')
})

Package.onTest(function (api) {
  api.use('ecmascript')
  api.use('tinytest')
  api.use('ventanas')
  api.mainModule('ventanas-tests.js')
})
