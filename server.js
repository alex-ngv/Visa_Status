var express = require('express'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    app = express(),
    query = require('./helpers/cartoHelper.js'),
    port = process.env.PORT || 3000;

    app.use(logger('dev'));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(express.static('public'));
    app.use('/bower_components',  express.static(__dirname + '/bower_components'));
    //Set up the port to listen
    app.listen(port, function () {
      console.log('App listening on port 3000...');
    });




    //controllers
    fs.readdirSync('./controllers').forEach(function (file) {
      if(file.substr(-3) == '.js') {
        route = require('./controllers/' + file);
        route.controller(app);
    }
});
