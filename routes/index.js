
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('global', {
  	title: 'Drought' 
  });
};