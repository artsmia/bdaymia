fs = require('fs')
base64 = function(img) {
  'data:image/png;base64,'
}
window.images = {
  5788: 'data:image/png;base64,'+fs.readFileSync('./5788.jpg', 'base64')
}

window.art = JSON.parse(fs.readFileSync('art.json', 'utf8'))

window.loadImage = function(id, callback) {
  var image = new Image()
  image.src = 'images/'+id+'-1000.jpg'
  image.onload = function() {
    var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d')
    canvas.width = image.width
    canvas.height = image.height
    ctx.drawImage(image,0,0)
    callback(null, canvas.toDataURL())
  }
}
