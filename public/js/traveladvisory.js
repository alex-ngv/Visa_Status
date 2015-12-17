
$(document).ready( function(){


advisory = [];
var chartRows =[['Country','Advisory']]
$.ajax({
  url:'/advisory/'
}).done(function(data){
  $(data).find('channel item').each( function(){
      var newItem = {
        country: $(this).find('title').text().replace(/ Travel Alert/g, ""),
        title: $(this).find('title').text(),
        description: $(this).find('description').html(),
        link: $(this).find('link').html(),
        date: new Date($(this).find('pubDate').text())
      };
      chartRows.push([newItem.country,1])
      advisory.push(newItem);
});
$.each(advisory, function(i, item){
  var c = $('<li><a row = '+i+' href="#">'+ item.country +'</a></li>').click(function(e){
    var cname = $(this).find('a').text();
    // $("#nav-advisory-selection").text('Alert for ' +cname);
    });
    $("#nav-advisory").append(c);
  });


console.log(advisory,chartRows);
});



loadTravelAdvisoryData = function(){
  addTravelData(chartRows);
}
});
