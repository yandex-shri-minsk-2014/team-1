var http = require('http')
  , url = require('url')
  , fs = require('fs')
  , log = require('npmlog') // актуальна переменная logPrefix
  , isStarted = !1 // false

exports.start = function (config) {
  if (config && !isStarted) {
    try {
      http.createServer(function (request, response) {
        log.http(request.method + ' request', request.url)

        var urlParsed = url.parse(request.url, true)

        // urlParsed.query.name стоит вынести в переменную
        if (urlParsed.pathname == '/theme' && urlParsed.query.name) {
          var themePath = 'libs/codemirror/theme/' + urlParsed.query.name

          fs.readFile(themePath + '.css', 'utf8',  function (err, data) {
            if (err) throw err

            response.write(JSON.stringify(data))
            // http://nodejs.org/api/http.html#http_response_end_data_encoding
            response.end() // можно сделать response.end(JSON.stringify(data))
                           // тут и ниже
          })
        }
        else if (urlParsed.pathname == '/theme' && !urlParsed.query.name) {
          fs.readdir('libs/codemirror/theme/', function (err, files) {
            if (err) throw err

            response.write(JSON.stringify(files))
            response.end()
          })
        }
        else {
          //reading index file
          fs.readFile(config.index, function (err, page) {
            if (err) {
              log.error('HTTP server', err.message)
              response.writeHeader(500)
              response.end('Can\'t read ' + config.index +
                           ' file. (Try to create it: npm run make)')
              return
            }

            response.writeHeader(200, {'Content-Type': 'text/html'})
            response.write(page)
            response.end()
          })
        }
      }).listen(config.port)
      log.info('HTTP server', 'Server started at port ' + config.port)
      isStarted = !0 // true
    } catch (e) {
      log.error('HTTP server', 'Server can\'t start. ' + e)
    }
  }
}
