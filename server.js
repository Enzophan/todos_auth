var express = require ('express');
var bodyParser = require('body-parser');  
var morgan = require('morgan');  
var passport = require('passport');
var mongoose = require('mongoose');
var flash    = require('connect-flash');
var cookieParser = require('cookie-parser');
var session      = require('express-session');  
var jwt = require('jsonwebtoken');  

var configDB = require('./config/database.js');
var User = require('./app/models/userModel');

mongoose.connect(configDB.getDbConnectionString());

var app = express();
var port = process.env.PORT || 3000;

app.use ('/assets', express.static (__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());

// Log requests to console
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());   
// We will add a quick home page route so I can give a quick demonstration of what morgan does. Add this next.

app.set('view engine', 'ejs'); 

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function(req, res, next){
    if(req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT'){
        jwt.verify(req.headers.authorization.split(' ')[1], 'RESTFULAPIs', function(err, decode){
            if (err) 
                req.userapi = undefined;
                req.userapi = decode;
                next();
        });
    } else {
        req.userapi = undefined;
        next();
    }
});

require('./app/todosRoutes.js')(app);
require('./app/routes.js')(app, passport);
require('./config/passport')(passport);
require ('./app/controllers/todoController')(app);
// Home route. We'll end up changing this to our main front end index later.



app.listen (port, function (){
    console.log ("App listening on port: " + port);
});