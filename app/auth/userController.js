var mongoose = require ('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var User = mongoose.model('UserAPI');

var Todos = require ('../models/todoModel');

exports.listTodos = function(req, res){
    Todos.find (function (err, todos){
        if (err) {
            res.status(500).json(err);
        }else {
            res.json(todos);
        }
    });
};

exports.register = function(req, res) {
    var newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    newUser.save(function(err, user) {
      if (err) {
        return res.status(400).send({
          message: err
        });
      } else {
        user.hash_password = undefined;
        return res.json(user);
      }
    });
  };
  

  exports.sign_in = function(req, res) {
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.status(401).json({ message: 'Authentication failed. User not found.' });
      } else if (user) {
        var passwordIsValid = bcrypt.compare(req.body.password, user.password);
        
        if (!passwordIsValid) {
          res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        } else {
          return res.json({token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id}, 'RESTFULAPIs')});
        }
      }
    });
  };
  

  exports.loginRequired = function(req, res, next) {
    if (req.userapi) {
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized user!' });
    }
  };
