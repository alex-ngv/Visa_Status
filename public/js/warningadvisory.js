
$(document).ready( function(){


warnings = [];
var warningChartRows =[['Country','Warning']]
$.ajax({
  url:'/warning/'
}).done(function(data){
  $(data).find('channel item').each( function(){
      var newItem = {
        country: $(this).find('title').text().replace(/ Travel Warning/g, ""),
        title: $(this).find('title').text(),
        description: $(this).find('description').html(),
        link: $(this).find('link').html(),
        date: new Date($(this).find('pubDate').text())
      };
      warningChartRows.push([newItem.country,1])
      warnings.push(newItem);
});
$.each(warnings, function(i, item){
  var c = $('<li><a row = '+i+' href="#">'+ item.country +'</a></li>').click(function(e){
    var cname = $(this).find('a').text();
    // $("#nav-warning-selection").text('Warning for ' +cname);
    });
    $("#nav-warning").append(c);
  });


console.log(warnings,warningChartRows);
});



loadTravelWarningData = function(){
  addWarningData(warningChartRows);
}
});
