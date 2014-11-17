var _ = require('lodash-node')
  , Duplex = require('stream').Duplex
  , livedb = require('livedb')
  , sharejs = require('share')
  , backend = livedb.client(livedb.memory())
  , share = sharejs.server.createClient({ backend: backend })

  , getUID = function () { return _.uniqueId('user-') }

  , Documents = require('../documents')
  , User = module.exports = function (options) {
      var self = this

      this._connection = options.connection // стоит сложить в переменную
      this._stream = new Duplex({ objectMode: true }) // тоже в переменную

      this.id = getUID()
      this.document = null
      this.props = { title: 'Anonymous' }

      this._stream._write = function (chunk, encoding, callback) {
        self._connection.send(JSON.stringify(chunk))

        return callback()
      }

      this._stream._read = function () {}

      this._stream.headers = this._connection.upgradeReq.headers
      this._stream.remoteAddress =
        this._connection.upgradeReq.connection.remoteAddress

      this._connection
        .on('message', _.bind(this.onMessage, this))
        .on('close', function (reason) {
          self._stream.push(null)
          self._stream.emit('close')
          self.destroy()
          return self._connection.close(reason)
        })

      this._stream
        .on('error', function (msg) {
          console.log('error', msg)
          return self._connection.close(msg)
        })
        .on('end', function () { // можно делать чейнинг в вызовах on
          return self._connection.close()
        })

      share.listen(this._stream)
    }
  , proto = User.prototype // переменная не нужна, если использовать _.extend

proto.onMessage = function (data) {
  data = JSON.parse(data)

  if (data.a === 'open') {
    this.onOpenEvent(data)
    return
  }

  return this._stream.push(data)
}
/**
 * Fire event on client
 * @param data
 * @returns {User}
 */
proto.emit = function (data) {
  this._connection.send(JSON.stringify(data))
  return this
}

/**
 * Simple export
 * @returns {{id: *}}
 */
proto.exportOnlyId = function () {
  return { id: this.id }
}

/**
 * Public data for other users
 * @returns {Object|*}
 */
proto.exportPublicData = function () {
  return _.extend(this.exportOnlyId(), { title: this.props.title })
}

/**
 * Private data for owner
 * @returns {Object|*}
 */
proto.exportPrivateData = function () {
  return _.extend(this.exportPublicData(), {})
}
/**
 * Open document
 * @param document {Document}
 */
proto.openDocument = function (document) {
  this.document = Documents.factory(document).addCollaborator(this)
  return this.emit({ a: 'open'
            , user: this.exportPrivateData()
            , document: this.document.exportPublicData()
            })
}
/**
 * Close last opened document
 */
proto.closeDocument = function () {
  if (this.document !== null) this.document.removeCollaborator(this)
  return this
}
/**
 * Update user data/props
 * @param data
 * @returns {User}
 */
proto.updateData = function (data) {
  delete data.id

  _.extend( this.props
          , data
          , function (a, b) { return b ? b : a }
          )

  return this
}
/**
 * Helper for our API
 * @param data
 * @returns {User}
 * @private
 */
proto.onOpenEvent = function (data) {
  if (data.user) this.updateData(data.user)
  return this.openDocument(data.document)
}
/**
 * Destroy info about user
 */
proto.destroy = function () {
  return this.closeDocument()
}
