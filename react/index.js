/** @jsx React.DOM */
var React = require('react');
var pkg = require('./package.json');

var qs = require('querystring');
var request = require('request');

var imageList = React.createClass({
  getInitialState: function() {
    return {
      images: [1743, 10436, 12092, 10434, 60728, 529, 98653, 3520, 5788, 303, 10361, 794]
    }
  },

  render: function() {
    var images = [];
    var allImages = this.state.images;
    for (var key in allImages) {
      images.push(<Image key={key} image={allImages[key]} />);
    }

    return (
      <ul className="images">{images}</ul>
    )
  }
})

var Image = React.createClass({
  showShareInteraction: function(event) {
    console.log(event, this.props.image)
  },
  render: function() {
    return (
      <li>
        <img onClick={this.showShareInteraction} src={"//api.artsmia.org/images/"+this.props.image+"/400/medium.jpg"} />
        <ShareInteraction image={this.props.image} />
      </li>
    );
  }
})

var ShareInteraction = React.createClass({
  getInitialState: function() {
    window.fbAsyncInit = function() {
      FB.init({
        // appId      : '283494295177465',
        appId      : '283514835175411',
        xfbml      : true,
        version    : 'v2.0',
      });
    }
    return {}
  },
  render: function() {
    return (
      <p>
        <button onClick={this.facebook}>Facebook</button>
        <button onClick={this.twitter}>Twitter</button>
      </p>
    )
  },
  twitter: function() {
    var img = "http://api.artsmia.org/images/"+this.props.image+"/large.jpg"
    var oauth =
      { callback: 'http://mysite.com/callback/'
      , consumer_key: 'Uj9yDuvJXbDj3gYJl54FkFqv2'
      , consumer_secret: 'pmigs0HZkuyG2bdY1CqZap10QbZRiiwVTeIuuaPJzoTzTHdMZF'
      }
    , url = 'https://api.twitter.com/oauth/request_token'
    request.post({url:url, oauth:oauth}, function (e, r, body) {
      debugger
      var access_token = qs.parse(body)
    })
  },
  facebook: function() {
    var img = "http://api.artsmia.org/images/"+this.props.image+"/large.jpg"
    FB.login(function(){
      FB.api("/me/photos", "POST", {"url": img, "message": "One of Two Designs for Sword Scabbard Fittings, Germany, c. 1580"}, function (response) {
        console.log(response)
        if (response && !response.error) {
          /* handle the result */
        }
      });
    }, {scope: 'publish_actions'})
  }
})

React.renderComponent(
  <imageList></imageList>,
  document.body
);
