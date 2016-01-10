var CONFIG= {
  // These are the visa requirement tiers
  // Visa free access
  // Electronic authorization or online payment required / eVisa
  // Visa issued upon arrival or visa-free entry upon arrival with payment of reciprocity fee
  // Visa required prior to arrival
  visaStringValues : {
    'Visa required':3,
    'Tourist Card required':3,
    'Visa required !Tourist Card required':3,
    'Access Permit required':3,
    'Visa on arrival':2,
    "Visitor's permit on arrival":2,
    'Tourist Card on arrival':2,
    'Entry Permit on arrival':2,
    "Visa on arrival !Visitor's Permit on arrival":2,
    'Visa on arrival !Tourist Card on arrival':2,
    "Visa on arrival !Visitor's permit on arrival":2,
    'Online reciprocity fee':1,
    'e-Tourist Visa':1,
    'eVisa':1,
    'e-Visa':1,
    'Electronic Travel Authorization':1,
    'Electronic Travel Authority':1,
    'Visa not required':0,
    '':3
  },
  // Minor Corrections to the WikiAPI Country names
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

  var goToBottom = function () {
    $("html, body").animate({ scrollTop: $(document).height() }, "slow");
  };
  $('#country_info').hide()
  $('#travel_info').hide()
  $('#passport_info').hide()


  var visaRows = [['Country', 'Visa Data',{role: 'tooltip', p:{html:true}}]];
  var allTheDataINeed;
  var myClickHandler = function(){};
  var myTravelClickHandler = function(){};

  function passportDropdown() {
    $.ajax({
      url:'/countries',
      dataType: 'JSON'
    }).done(function(data){
      $.each(data,function(i,item){
        var destination = $('<li><a iso2 = '+item.iso2+' href="#">'+ item.name +'</a></li>').click(function(e){
          var destination_name = $(this).find('a').text();
          var destination_iso2 = $(this).find('a').attr('iso2')
          $("#destination_button").text(destination_name);
          $("#destination_button").attr('iso2',destination_iso2)
        });
        var origin = $('<li><a iso2 = '+item.iso2+' href="#">'+ item.name +'</a></li>').click(function(e){
          var origin_name = $(this).find('a').text();
          var origin_iso2 = $(this).find('a').attr('iso2')
          $("#origin_button").text(origin_name);
          $("#origin_button").attr('iso2',origin_iso2)
        });
        $("#destination_dd").append(destination);
        $("#origin_dd").append(origin);
      })
    })
  }
  passportDropdown();

  function loadDataOnTheMap(){
    goToBottom();
    $("#loading").show();
    $.ajax({
      url:'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Visa_requirements_for_United_States_citizens&redirects&section=2',
      dataType: 'JSONP'
    }).done(function(data){
      allTheDataINeed = parseData(data.parse.text['*']);
      allTheDataINeed = allTheDataINeed.filter(function(n){ return n.length != 0 });
      $.each(allTheDataINeed, function(i, item){
        visaRows.push([item[0],item[4],item[1]])
        var c = $('<li><a row = '+i+' href="#">'+ item[0] +'</a></li>').click(function(e){
          var cname = $(this).find('a').text();
          });
          $("#nav-countries").append(c);
        });
      // loadVisaData();
      $("#loading").hide();
      })
    }

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
          //console.log(colArray[0], CONFIG.nameConversions[colArray[0]])
          colArray[0] = CONFIG.nameConversions[colArray[0]]
        }
      }
      return colArray
    });
  }


  //This will make the map show up on the page
  var container = document.getElementById('regions_div');
  var chart = new google.visualization.GeoChart(container);
  var screenHeight = $(window).height()-37
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
      height: screenHeight,
      keepAspectRatio: true
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
      keepAspectRatio: true
    };
    $( "body" ).unbind("click");
    var myTravelClickHandler = function(){
      var selection = chart.getSelection();
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
      keepAspectRatio: true
    };
    $( "body" ).unbind("click");
    var myTravelClickHandler = function(){
      var selection = chart.getSelection();
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
      colorAxis: {colors: ['LightGreen', 'gold', 'Crimson']},
      datalessRegionColor: 'navy',
      backgroundColor: '#81d4fa',
      tooltip: {
        isHtml: true
      },
      keepAspectRatio: true
    };

    var myClickHandler = function (){
      var selection = chart.getSelection();
      countryInfo(allTheDataINeed[selection[0].row])
    };

    google.visualization.events.removeAllListeners(chart);
    google.visualization.events.addListener(chart, 'select', myClickHandler);
    chart.draw(data,options);
    setCurrentMapState(mapState.visa);
    google.visualization.events.addListener(chart, 'select', function () {
      var selection = chart.getSelection();
      if (selection.length > 0) {
        var view = new google.visualization.DataView(data);
        view.setColumns([rows, {
          type: 'number',
          label: data.getColumnLabel(1),
          calc: function (dt, row) {
          return (selection[0].row == row) ? 4 : 1;
          }
        }]);
        chart.draw(view, options);
      }
      else {
        chart.draw(data, options);
      }
    });
  };


  $(".btn-group").on('click','#nav-countries li > a',function(e){
    countryInfo(allTheDataINeed[$(this).attr('row')]);
    loadVisaData();
    // goToBottom();
  });

  $(".btn-group").on('click','#nav-advisory li > a',function(e){
    countryAdvisoryInfo(advisory[$(this).attr('row')]);
    loadTravelAdvisoryData();
  });

  $(".btn-group").on('click','#nav-warning li > a',function(e){
    countryAdvisoryInfo(warnings[$(this).attr('row')]);
    loadTravelWarningData();
  });


  $("#origin_test").on('click',"#origin_dd li > a", function(e){
    var test = ([$(this).text(),3])
    console.log(test)
  })




  $('#get_countryCodes').click(function(){
    console.log($("#origin_button").attr('iso2'),$("#destination_button").attr('iso2'))
    var otherPassportLoader = new externalPassortInfo($("#origin_button").attr('iso2'),$("#destination_button").attr('iso2'));
    otherPassportLoader.loadHtml(function(data){
      $('#passport_info').show()
      $('#passport_info').append("<h6>click window to close</h6>")
      $('#passport_info').append(data)
      $('#passportdata').animate({
        top: '0px'
      })
      $('#passport_info').animate({
        height:'500px'
      })
    });
  });

  $('#passport_info').click(function(){
    $('#passport_info').animate({
      height: '0px'
    });
    setTimeout(
      function(){
        $("#passport_info").hide();
        $("#passport_info").empty();
      }, 500
    );
  })

  $('#get_passport_data').click(function(){
    // getPassportData();
    $('#passportdata').show()
    $('#passportdata').animate({
      top: '55px',
    });
  })

  var getPassportData = function(){
    //$('#passportdata').empty()
  }

  var countryAdvisoryInfo = function(data){
    $('#travel_info').empty()
    $('#country_info').hide()
    $('#travel_info').show()
    $("#travel_info").animate({
        width: '750px',
      });
    var template = Handlebars.compile($('#advisory').html())
    $("#travel_info").append(template(data))
  };

  $("#country_info").click(function(){
    $('#country_info').hide()
  })

  $("#travel_info").click(function(){
    $("#travel_info").animate({
        width:'.1px'
      });
    setTimeout(
      function(){
        $("#travel_info").hide();
      }, 500
    );
  });

  var countryInfo = function(data){
    $('#country_info').empty()
    $('#country_info').show()
    var dataObj = {
      country: data[0],
      stay: data[2],
      visa: data[1],
      info: data[3]
    }
    var template = Handlebars.compile($('#info-view').html())
    $("#country_info").append(template(dataObj))
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
    if(currentMapState ==  mapState.visa)
      loadVisaData();
    else if( currentMapState == mapState.advisory)
      loadTravelAdvisoryData();
    else if( currentMapState == mapState.warning)
      loadTravelWarningData();
  });

});
