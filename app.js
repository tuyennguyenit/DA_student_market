var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
const Passport=require('passport')
const LocalStrategy=require('passport-local').Strategy
const fs=require('fs')




var sessionOptions = {
  secret: "secret",
  cookie:{
    maxAge: 1000*60*5
  },
  resave : true,
  saveUninitialized : true};
 


var routes = require('./routes/index');

var http = require("http");
var app = express();

app.use(session(sessionOptions));



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

app.use(Passport.initialize())
app.use(Passport.session())

//!sign in -authenticate
app.route('/login1')
.get((req,res) => res.render('login1'))
.post(Passport.authenticate('local',{failureRedirect: '/loginloi',successRedirect:'/loginOK'}))
var User = require.main.require("./models/user");
Passport.use(new LocalStrategy(
  ( email, password,done )=>{
		User.findOne({email:email,password:password},function(err,user){
      if(err) throw err
      else{
        if(user){
          return done(null,user)//chứng thực ok
        }
        else
        return done(null,false); //chứng thực lỗi
      }
    })
  }
));




Passport.serializeUser((user,done)=>{
  done(null,user) 
})
Passport.deserializeUser((user,done)=>{
  done(null,user) 
})
app.get('/loginOK',(req,res)=>res.send("bạn đã đăng nhập thành công"))


// catch 404 and forward to error handler
app.use(function(req, res, next) {

  var err = new Error('Not Found');
  err.status = 404;
   console.log(err);
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
   cc
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
   console.log("Error 500");
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;


var server = http.createServer(app);




/** sử dụng cái này thì ko thể dùng đc socketio
 * Listen on provided port, on all network interfaces.
 */

// var server = app.listen((process.env.PORT || 3000), function () {

//   var host = server.address().address
//   var port = server.address().port

//   console.log("app listening at http://%s:%s", host, port)

// });
//!chat
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);
//dùng cái này thì ko chạy đc heroku
server.listen('3000', () => {
  console.log('Server listening on Port 3000');
})

io.on('connection',function(client){
  console.log('Client connected...');
  client.on('join',function(data){
      console.log(data);
  });
  client.on('messages',function(data){
      client.emit('thread',data);
      client.broadcast.emit('thread',data);
  })
});

//!--end chat



server.on('error', onError);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
    
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
  //process.exit(1);
}
