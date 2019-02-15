import { WebApp } from 'meteor/webapp'
import { readUrl, limpiarUrl, createUrl } from './common.js'

const compartir = `<html>
<head>
  <meta charset="utf-8">
  <title><%= title %></title>
  <meta property="og:type" content="website"/>
  <meta property="og:title" content="{{title}}"/>
  <meta property="og:description" content="{{description}}"/>
  <meta property="og:image" content="{{image}}"/>
  <meta name="description" content="{{description}}">
</head>
<body>
  <script>
    window.location.href = "{{href}}"
  </script>
</body>
</html>`

export const ventanas = {
  use (url, callback) {
    WebApp.connectHandlers.use(url, function (req, res, next) {
      const ventanas = readUrl(req.originalUrl)
      const data = callback(req.originalUrl, ventanas)
      if (!data) {
        return next()
      }

      data.href = data.href || `${process.env.ROOT_URL}/${limpiarUrl(req.originalUrl)}`

      res.setHeader('content-type', 'text/html; charset=utf-8')
      res.writeHead(200)
      res.end(
        compartir
          .replace(/{{title}}/g, data.title)
          .replace(/{{description}}/g, data.description)
          .replace(/{{image}}/g, data.image)
          .replace(/{{href}}/g, data.href)
      )
    })
  },
  createUrl,
  limpiarUrl
}
