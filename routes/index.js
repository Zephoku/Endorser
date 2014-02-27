/*
 * GET home page.
 */

exports.index = function(req, res){
  console.log("Hello from controller index");
  res.render('index', { title: 'Endorser' });
};

/*
 * GET profile page.
 */
exports.profile = function(req, res){
  console.log("Hello from controller profile");
  res.render('profile', { title: 'Endorser\'s Profile' });
};
