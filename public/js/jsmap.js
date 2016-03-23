$(document).ready(function(){


  jQuery('#vmap').vectorMap({
    map: 'world_en',
    backgroundColor: 'black',
    borderColor: 'gold',
    borderOpacity: 0.25,
    borderWidth: 1,
    enableZoom: true,
    color: 'white',
    hoverColor: 'red',
    hoverOpacity: null,
    normalizeFunction: 'linear',
    scaleColors: ['#b6d6ff', '#005ace'],
    selectedColor: '#c9dfaf',
    selectedRegions: [],
    multiSelectRegion: true,
    showTooltip: true,
    onRegionClick: function(element, code, region)
    {
        var message = 'You clicked "'
            + region
            + '" which has the code: '
            + code.toUpperCase();

        console.log(highlight[code]);
    }
  });
});
