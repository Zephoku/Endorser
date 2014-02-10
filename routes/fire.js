/* 
 * GET Firebase Example Page
 */

exports.page = function(req, res) {
  console.log("Hello from controller``");
  var hi = 2 + 2;
  console.log(hi);
  res.render('firebase_example', {title: 'Firebase Setup'});
};
