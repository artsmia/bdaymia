fs = require('fs')

window.art = JSON.parse(fs.readFileSync('art.json', 'utf8'))

window.loadImage = function(id, callback) {
  var image = new Image()
  image.src = 'images/logo/'+id+'-2000.jpg'
  image.onload = function() {
    var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image,0,0)
    callback(null, canvas.toDataURL())
  }
}

hello.init({
  facebook : 283514835175411,
  twitter: 'vJyAEOhA6UfAizVYCoLc0hbye'
}, {
  redirect_uri: 'authed.html',
  oauth_proxy : 'https://glacial-waters-7413.herokuapp.com/proxy',
  scope: 'photos,publish_files'
})

function loadSharing(domNode) {
  domNode.addEventListener('click', function(event) {
    var src = event.target.src
    var match = src && src.match(/images\/crop\/(\d+)/)
    var id = match && match[1]
    if(event.target.nodeName == 'IMG' && id) {
      spotlight(id)
    }

    if(event.target.nodeName == 'BUTTON') {
      var id = $spotlight.getAttribute('data-id')
      switch(event.target.id) {
        case "facebook": facebook(id); break
        case "twitter": twitter(id); break
      }
    }
  })

  var $spotlight = document.querySelector('#spotlight')
  function spotlight(id) {
    $spotlight.setAttribute('data-id', id)
    $spotlight.querySelector('img').src = url(id, 1000)
  }

  function url(img, width) {
    return 'http://cdn.dx.artsmia.org/miabday/images/logo/'+img+'-'+width+'.jpg'
  }

  function facebook(img) {
    var _art = art[img]
    if(!_art) return
    var credit = _art.title
    if(_art.artist && _art.artist != 'Unknown') credit += " by "+_art.artist

    var message = "Happy (almost) 100th birthday to the MIA! I’m celebrating with "+credit+".\n\nWant to join the party? Visit artsmia.org/100 to give the gift of art to your online community."
    hello('facebook').login().then(function(auth) {
      hello('facebook').api('me/photos', 'POST', {
        message: message, url: url(img, 3000)
      }).then(function(success) { console.log('facebook', success) }, function(err) { console.log(err) })
    })
  }
  function twitter(img) {
    var message = "Happy (almost) 100th #BDAYMIA! Celebrate with a gift of art to your community—visit artsmia.org/100 & share."
    loadImage(img, function(err, dataUrl) {
      hello('twitter').login().then(function(auth) {
        window.bench = new Date
        hello('twitter').api('me/media', 'POST', {
          message: message, file: dataUrl, filename: 'artsmia-bday-gift-'+img+'.jpg'
        }).then(function(success) { console.log('twitter', success, 'took ', (new Date - bench)/1000, 'seconds') }, function(err) { console.log(err) })
      }, function(error) {
        console.log('no twitter! ', error)
      })
    })
  }
}

loadSharing(document)
