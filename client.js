/**
 * @file The main module, for clientside
 */

import { _ } from 'meteor/underscore'
import { $ } from 'meteor/jquery'
import { Template } from 'meteor/templating'
import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { readUrl, createUrl } from './common.js'

export const ventanas = new Mongo.Collection(null)

/**
 * @function ventanas.updateUrl
 * it updates the url with a base64 bencoded array that contains all the ventanas' documents except of those with noUrl
 * @return {undefined}
 */
ventanas.updateUrl = _.debounce(function () {
  const url = createUrl(ventanas.find({
    nourl: {
      $exists: 0
    }
  }).fetch())
  if (url === 'bGU') {
    global.history.pushState({}, '', '/')
  } else {
    global.history.pushState({}, '', `/_/${url}`)
  }
}, 1000)

/**
 * @function ventanas.close
 * It marks an instance for its destruction, waits 350ms to remove its document from the ventanas Collection, and then call a callback
 *
 * @param  {object or string}   template @see getId
 * @param  {Function}           callback
 * @return {undefined}
 */
ventanas.close = function (template, callback) {
  const _id = getId(template)
  ventanas.update({
    _id
  }, {
    $set: {
      close: 1
    }
  })
  setTimeout(function () {
    ventanas.remove({
      _id
    })
    callback && typeof callback !== 'number' && callback()
  }, 350)
}

/**
 * @function ventanas.wait
 * It set an ventanas' document in waiting state
 * @param  {object or string}   template @see getId
 * @return {undefined}
 */
ventanas.wait = function (data) {
  ventanas.update({
    _id: getId(data)
  }, {
    $set: {
      waiting: 1
    }
  })
}
/**
 * @function ventanas.wait
 * It unset the waiting state of a ventanas' document
 * @param  {object or string}   template @see getId
 * @return {undefined}
 */
ventanas.unwait = function (data, ya) {
  if (ya) {
    ventanas.update({
      _id: getId(data)
    }, {
      $unset: {
        waiting: 1
      }
    })
  }
  return setTimeout(function () {
    ventanas.unwait(data, true)
  }, 1000)
}

Meteor.startup(function () {
  ventanas.updateUrl()
})

const initUrl = function () {
  try {
    readUrl(global.location.pathname).forEach(function (ventana) {
      if (ventana.wait) {
        ventana.waiting = 1
      }
      ventanas.insert(ventana)
    })
  } catch (e) {
    console.log(e)
  }
}

const getId = function getId (data) {
  if (data.data && data.data._id) {
    return data.data._id
  }
  if (data._id) {
    return data._id
  }
  if (typeof data === 'string') {
    return data
  }
  return Template.currentDate()._id
}

initUrl()

Template._ventanas.onCreated(function () {
  $('body').on('click', '.openWindow', function (event) {
    const ventana = {}
    Object.keys(event.currentTarget.dataset).forEach(function (key) {
      ventana[key] = event.currentTarget.dataset[key]
    })
    ventana.updateUrl = true
    console.log(ventana)
    if (ventana._id && ventanas.findOne({
      _id: ventana._id
    })) {
      ventanas.remove({
        _id: ventana._id
      })
      if (ventana.template) {
        ventanas.insert(ventana)
      }
    } else {
      ventanas.insert(ventana)
    }
    ventanas.updateUrl()
  })
})

Template._ventanas.helpers({
  ventanas () {
    return ventanas.find({
      _id: {
        $ne: 'c'
      }
    })
  }
})

Template._ventana.helpers({
  template () {
    return this.template || this._id
  }
})

Template._ventana.onCreated(function () {
  if (this.data.updateUrl) {
    ventanas.update({
      _id: this.data._id
    }, {
      $unset: {
        updateUrl: 1
      }
    })
    ventanas.updateUrl()
  }
})
Template._ventana.onDestroyed(function () {
  if (this.data.close) {
    ventanas.updateUrl()
  }
})

Template._ventana.onRendered(function () {
  const that = this
  const modal = this.$('.fade')
  if (modal.length) {
    modal.addClass('invisible')
    setTimeout(function () {
      modal.addClass('visible')
    }, 50)
  }

  if (this.data.waiting) {
    ventanas.wait(this)
  }

  this.autorun(function () {
    if (ventanas.findOne({
      _id: that.data._id,
      close: 1
    })) {
      if (modal.length) {
        that.$('.fade').removeClass('visible')
      } else {
        ventanas.remove({
          _id: that.data._id
        })
      }
    }
  })

  this.autorun(function () {
    if (ventanas.findOne({
      _id: that.data._id,
      waiting: 1
    })) {
      that.$('form').addClass('waiting')
    } else {
      that.$('form').removeClass('waiting')
    }
  })
})

Template._ventana.events({
  'click .close' (event, template) {
    ventanas.close(template)
  },
  'click .atras' (event, template) {
    window.history.back()
  }
})

ventanas.error = function (e) {
  ventanas.insert({
    template: 'alerta',
    clase: 'error',
    titulo: 'Error:',
    contenido: e.reason || e.message
  })
}

export const lang = function lang () {
  return (ventanas.findOne({
    _id: 'c'
  }) || {
    lang: 'es'
  }).lang
}

Template.registerHelper('c', function (k) {
  return (ventanas.findOne({
    _id: 'c'
  }) || {})[k]
})
ventanas.conf = function (a, b) {
  if (b === undefined) {
    return (ventanas.findOne({
      _id: 'c'
    }) || {})[a]
  }
  ventanas.upsert({
    _id: 'c'
  }, {
    $set: {
      [a]: b
    }
  })
}
if (Meteor.isDevelopment) {
  global.ventanas = ventanas
}

window.onpopstate = function (event) {
  const nuevasVentanas = readUrl(global.location.pathname)

  nuevasVentanas.forEach(function (ventana) {
    if (ventana.wait) {
      ventana.waiting = 1
    }
    ventana.onpopstate = 1
    const _id = ventana._id
    if (ventanas.find({
      _id
    }).count()) {
      delete ventana._id
      ventanas.update({
        _id
      }, ventana)
      ventana._id = _id
    } else {
      ventanas.insert(ventana)
    }
  })

  ventanas.remove({
    nourl: {
      $exists: 0
    },
    onpopstate: {
      $ne: 1
    }
  })
  ventanas.update({
    onpopstate: 1
  }, {
    $unset: {
      onpopstate: 1
    }
  }, {
    multi: 1
  })
}
