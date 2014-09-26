fs = require('fs')
base64 = function(img) {
  'data:image/png;base64,'
}
window.images = {
  5788: 'data:image/png;base64,'+fs.readFileSync('./5788.jpg', 'base64')
}
