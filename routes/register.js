exports.create = function(req, res){
  res.render('register', { title: 'Endorser' });
};

exports.login = function(req, res){
  res.render('login', { title: 'Endorser' });
};
