var CONFIG= {
  visaStringValues : {
    'Visa required':0,
    'Tourist Card required':1,
    'Visa required !Tourist Card required':1,
    'Visa on arrival':2,
    'Access Permit required':2,
    "Visitor's permit on arrival":2,
    'Tourist Card on arrival':2,
    'Entry Permit on arrival':2,
    "Visa on arrival !Visitor's Permit on arrival":3,
    'Visa on arrival !Tourist Card on arrival':3,
    "Visa on arrival !Visitor's permit on arrival":3,
    'e-Tourist Visa':3,
    'eVisa':4,
    'e-Visa':4,
    'Online reciprocity fee':5,
    'Electronic Travel Authorization':6,
    'Electronic Travel Authority':7,
    'Visa not required':8,
    '':0
  },
  nameConversions: {
    'Australia and territories'   : 'Australia',
    'Denmark and territories'     : 'Denmark',
    'Netherlands and territories' : 'Netherlands',
    'United Kingdomexcluding some Overseas territories':'United Kingdom',
    'Sahrawi Arab Democratic Republic' : 'Western Sahara'
  }
};

var currentMapState = 1;
function setCurrentMapState(state)
{
  currentMapState = state;
}
var mapState = {
  visa: 1,
  advisory: 2,
  warning: 3
};

$(document).ready(function () {

  $('#country-info').hide()
  $('#animated').hide()
  var visaRows = [['Country', 'Visa Data',{role: 'tooltip', p:{html:true}}]];
  var allTheDataINeed;
  var myClickHandler = function(){};
  var myTravelClickHandler = function(){};

  function loadDataOnTheMap(){
    $.ajax({
      url:'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Visa_requirements_for_United_States_citizens&redirects&section=2',
      dataType: 'JSONP'
    }).done(function(data){
      allTheDataINeed = parseData(data.parse.text['*']);
      console.log(allTheDataINeed)
      allTheDataINeed = allTheDataINeed.filter(function(n){ return n.length != 0 });
      console.log(allTheDataINeed)
      $.each(allTheDataINeed, function(i, item){
        visaRows.push([item[0],item[4],item[1]])
        var c = $('<li><a row = '+i+' href="#">'+ item[0] +'</a></li>').click(function(e){
          var cname = $(this).find('a').text();
          $("#nav-countries-selection").text('Visa status for ' +cname);
          });
          $("#nav-countries").append(c);
        });
      // loadVisaData();
      })
    }

    $(".dropdown").on('click','#nav-countries li > a',function(e){
      countryInfo(allTheDataINeed[$(this).attr('row')])
      console.log(e)
    });

    $(".dropdown").on('click','#nav-advisory li > a',function(e){
      countryAdvisoryInfo(advisory[$(this).attr('row')])
      console.log(e)
    });

    $(".dropdown").on('click','#nav-warning li > a',function(e){
      countryAdvisoryInfo(warnings[$(this).attr('row')])
      console.log(e)
    });

  window.setTimeout( loadDataOnTheMap, 1);

  function parseData(data) {
  // converts visaData for each row (html:tr)
  // we're splitting the incoming data on tr(rows),
  // then map the row array by applying the supplied function

  return data.split( /<tr.*?>/ ).map( function(row){

    // split on columns (html:td),
    // reduce the
    var colArray = row.split( /<td.*?>/ ).reduce( function( colCollector, col,j){

      // each column is a piece of data that we need, but there's lots of garbage we must clean out
      // run this regex over the data to sanitize.
      // we have to do two init steps of scrubbing because the second dependant on the first.
      var sanitized = col
        .replace( /(\n)|(<.*?>)|(&#160;)/g , '' ) /* removes \n, any html, and weird character */
        .replace( /\[\d+\]/g , '' ) /* from the prev step, we're left with a lot of these: [999]. let's remove them  */
        .replace( /(\.)(\S)/g , '$1 $2')  /* insert spaces after periods, only if there's another word following */
        .trim() /* remove any outside whitespace */
      /* Special cases per column*/
      switch (j) {
        // throw out the first column; it's garbage
        case 0: return colCollector;
          break;

        // we might have more cases later
        default:
          break;
      }
      colCollector.push(sanitized);
      return colCollector;
      }, []);
      //console.log(colArray[1],CONFIG.visaStringValues)
      if (colArray[1] != null){
      if (colArray[1] in CONFIG.visaStringValues){
        colArray.push(CONFIG.visaStringValues[colArray[1]])
      }
      if(colArray[0] in CONFIG.nameConversions){
        console.log(colArray[0], CONFIG.nameConversions[colArray[0]])
        colArray[0] = CONFIG.nameConversions[colArray[0]]
        }
      }
      return colArray
    });
  }

  var container = document.getElementById('regions_div');
  var chart = new google.visualization.GeoChart(container);

  function drawVisualization() {
    data = google.visualization.arrayToDataTable([
      ['', '']
     ]);
    // Create and draw the visualization.
    var container = document.getElementById('regions_div');
    var chart = new google.visualization.GeoChart(container);
    var options = {
      legend: 'none',
      colorAxis: {colors: ['#B22222', 'gold']},
      datalessRegionColor: 'LightGreen',
      backgroundColor: '#81d4fa',
      tooltip: {
            isHtml: true
        },
        keepAspectRatio: false
    };

    chart.draw(data,options);
  }

  drawVisualization();

  addTravelData = function(rows){
        var data = google.visualization.arrayToDataTable(rows);
        var options = {
          legend: 'none',
          colorAxis: {colors: ['orangered']},
          defaultColor: '#f5f5f5',
          datalessRegionColor: 'LightGreen',
          backgroundColor: '#81d4fa',
          keepAspectRatio: false
        };
        $( "body" ).unbind("click");
        var myTravelClickHandler = function(){
            var selection = chart.getSelection();
            console.log(advisory[selection[0].row])
            console.log('myTravelClickHandler')
            countryAdvisoryInfo(advisory[selection[0].row])
        }
        google.visualization.events.removeAllListeners(chart)
        google.visualization.events.addListener(chart, 'select', myTravelClickHandler);
        chart.draw(data,options);

        setCurrentMapState(mapState.advisory);
  };
  addWarningData = function(rows){
        var data = google.visualization.arrayToDataTable(rows);
        var options = {
          legend: 'none',
          colorAxis: {colors: ['firebrick']},
          datalessRegionColor: 'LightGreen',
          backgroundColor: '#81d4fa',
          keepAspectRatio: false
        };
        $( "body" ).unbind("click");
        var myTravelClickHandler = function(){
            var selection = chart.getSelection();
            console.log(warnings[selection[0].row])
            console.log('myTravelClickHandler')
            countryAdvisoryInfo(warnings[selection[0].row])
        }
        google.visualization.events.removeAllListeners(chart)
        google.visualization.events.addListener(chart, 'select', myTravelClickHandler);
        chart.draw(data,options);

        setCurrentMapState(mapState.warning);
  };

  addVisaData = function(rows) {
      var data = google.visualization.arrayToDataTable(rows);
      var options = {
        legend: 'none',
        colorAxis: {colors: ['Crimson', 'white']},
        datalessRegionColor: 'navy',
        backgroundColor: '#81d4fa',
        tooltip: {
            isHtml: true
        },
        keepAspectRatio: false
      };

      var myClickHandler = function (){
          var selection = chart.getSelection();
          console.log(selection)
          console.log('myClickHandler')
          countryInfo(allTheDataINeed[selection[0].row])
      }
      google.visualization.events.removeAllListeners(chart)
      google.visualization.events.addListener(chart, 'select', myClickHandler);
      chart.draw(data,options);
      setCurrentMapState(mapState.visa);
  }

  var countryAdvisoryInfo = function(data){
    $('#animated').empty()
    $('#country-info').hide()
    $('#animated').show()
    $("#animated").animate({
        width: '750px',
      });
    var template = Handlebars.compile($('#advisory').html())
    $("#animated").append(template(data))
  };



  $("#country-info").click(function(){
    $('#country-info').hide()
  })

  $("#animated").click(function(){
    console.log('de-animation')
        $("#animated").animate({
            width:'.1px'
          });
          setTimeout(
            function(){
              $("#animated").hide();
            }, 500
          );
    })

  var countryInfo = function(data){
      $('#country-info').empty()
      $('#country-info').show()
      var dataObj = {
        country: data[0],
        stay: data[2],
        visa: data[1],
        info: data[3]
      }
      var template = Handlebars.compile($('#info-view').html())
      $("#country-info").append(template(dataObj))
    }

  loadVisaData = function(){
    addVisaData(visaRows);
    }

    $(window).resize(function() {
    if(this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function() {
        $(this).trigger('resizeEnd');
    }, 500);
});

//redraw graph when window resize is completed
$(window).on('resizeEnd', function() {
  if( currentMapState ==  mapState.visa)
    loadVisaData();
  else if( currentMapState == mapState.advisory)
    loadTravelAdvisoryData();
  else if( currentMapState == mapState.warning)
    loadTravelWarningData();
});

});
