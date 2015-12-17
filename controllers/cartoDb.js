var query = require('../helpers/cartoHelper.js')

module.exports.controller = function(app){
  app.get('/advisory',function(req,res){
    query.advisory(function(data){
      res.send(data)
    })
  }),
  app.get('/warning',function(req,res){
    query.warning(function(data){
      res.send(data)
    })
  })
};
