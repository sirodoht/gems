var debug = require('debug')('gems:server');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var PlayerEnt = require('./back/entities/player.ent');
var RoomEnt = require('./back/entities/room.ent');
var routes = require('./back/routes/index');
var colors = require('./back/etc/colors.etc');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var rooms = [];
rooms[0] = new RoomEnt();

io.on('connection', function (socket) {
  var emitHand = function(userid) {
    var player = rooms[0].findPlayerById(userid);
    if(player) {
      var hand = player.hand;
      socket.emit('hand', hand);
      return true;
    }
    return false;
  };
  var emitRituals = function() {
    socket.emit('rituals', rooms[0].getClientRituals());
  };

  var p = new PlayerEnt();
  rooms[0].addPlayer(p);
  emitRituals(p.id);
  socket.emit('userid', {userid: p.id});
  emitHand(p.id);
  socket.emit('colors', {colors: colors});

  socket.on('begin', function() {
    rooms[0].begin();
  });
  socket.on('drawcard', function (data) {
    rooms[0].drawCard(data.userid);
    emitHand(data.userid);
  });
  socket.on('combine', function (data) {
    rooms[0].combine(data.userid, data.color1, data.color2);
    emitHand(data.userid);
  });
  socket.on('contribute', function (data) {
    rooms[0].acceptContribution(data.userid, parseInt(data.ritual), data.color);
    emitHand(data.userid);
    emitRituals(data.userid);
  });

  socket.on('disconnect', function() {
    var playerIdx = rooms[0].players.indexOf(p);
    rooms[0].players.splice(playerIdx, 1);
  })

});

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
var port = normalizePort(process.env.PORT || '3000');

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port
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
  var bind = typeof addr === 'string' ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

app.set('port', port);
app.on('error', onError);
app.on('listening', onListening);
server.listen(port);

// view engine setup
app.set('views', path.join(__dirname, 'front/views'));
app.set('view engine', 'jade');

// Enable CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// app.use(favicon(path.join(__dirname, 'front/static', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, '/front/static')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
