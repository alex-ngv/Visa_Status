$(document).ready(function(){


$('#nav-countries-selection').click(function(){
  loadVisaData();

  $('ul.nav li').removeClass('active');
  $(this).parent().addClass('active');

});


$('#nav-advisory-selection').click(function(){
  loadTravelAdvisoryData();


  $('ul.nav li').removeClass('active');
  $(this).parent().addClass('active');

});

$('#nav-warning-selection').click(function(){
  loadTravelWarningData();


  $('ul.nav li').removeClass('active');
  $(this).parent().addClass('active');

});
});
