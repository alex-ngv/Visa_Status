var request = require('request')
module.exports = {

  advisory: function (cb) {
    request('http://travel.state.gov/_res/rss/TAs.xml', function(error, response, body) {
      if(error) {
        console.error(error)
      }
      cb(body);
    });
  },

  warning: function (cb) {
    request('http://travel.state.gov/_res/rss/TWs.xml', function(error, response, body) {
      if(error) {
        console.error(error)
      }
      cb(body);
    });
  }


}
