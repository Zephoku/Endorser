/*
 * GET GitHub page.
 */

exports.page = function(req, res){
  res.render('github', { title: 'Endorser GitHub' });
};
