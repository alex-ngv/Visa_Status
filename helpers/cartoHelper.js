var request   = require('request');
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
  },

  passportinfo: function(orgin,dest,cb) {
    request("https://www.timaticweb.com/cgi-bin/tim_website_client.cgi?SpecData=1&VISA=&page=visa&NA=" + origin + "&PASSTYPES=PASS&DE="+ dest +"&user=KLMB2C&subuser=KLMB2C",
    function(error,response,body){
      if(error) {
        console.error(error)
      }
      cb(body);
    });
  },

}
