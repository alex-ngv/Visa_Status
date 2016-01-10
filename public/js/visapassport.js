


var externalPassortInfo = function( origin, dest){
  path = '/passportinfo?origin=' + origin + '&dest=' + dest;
  this.loadHtml = function(callback){
    $.ajax({
      url: path
    }).done(function(data){
      var elements = $(data).find('pre');
      var pass_info = (elements[0].innerHTML).replace(/<img[^>]*>/g,"")
      .replace(/(<a href="java[^>]*>For details, click here<\/a>)/g,"")
      .replace(/(CHECK.*)/g,"")
      .replace(/DE([^>]*)/g,"");
      callback(pass_info);
    });
  };
};
