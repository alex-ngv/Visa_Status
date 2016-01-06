


var externalPassortInfo = function( origin, dest){

  path = '/passportinfo?origin=' + origin + '&dest=' + dest;


  var html;



  this.loadHtml = function(callback)
  {

    $.ajax({
      url: path

    }).done(function(data){

      var result = data.match(/<pre class=\"normal\">([\s\S]*?)<\/pre>/);


      callback(result[0]);
    });







  }


}
