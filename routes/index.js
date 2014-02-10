/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log("Hello from controller index");
  res.render('index', { title: 'Endorser' });
};
