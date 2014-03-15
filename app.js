
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var socket = require('socket.io');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
var server = http.createServer(app).listen((1234), function(){
  console.log("Express server on");
});

var io = socket.listen(server);

app.get('/', function(req, res){
  res.sendfile(__dirname + '/index.html');
});

app.get('/controller.html', function(req, res){
  res.sendfile(__dirname + '/controller.html');
});

app.get('/gyro.html', function(req, res){
  res.sendfile(__dirname + '/gyro.html');
});
app.get('/fly.html', function(req, res){
  res.sendfile(__dirname + '/fly.html');
});

app.get('/cordova-2.0.0.js', function(req, res){
  res.sendfile(__dirname + '/cordova-2.0.0.js');
});

var nextId = 0;

var display;
var sockets = [];

io.sockets.on('connection', function(socket){
console.log("*Connected started");
  socket.on('init', function(data){
    if(data === 0){
      display = socket;
    }
    else if(data == null){
      display = socket;
    }
    else
    {
      sockets[nextId] = socket;
      sockets[nextId].emit('ID', nextId);
      display.emit('newController', nextId);
      nextId++;
      
    }
  });

  socket.on('input', function(input){
    console.log("*******Input " +  JSON.stringify(input));
    display.emit('update', input);
  });

  socket.on('disconnect', function(){
    var socketIndex = sockets.indexOf(socket);

    display.emit('destroy', socketIndex);
    console.log("DESTROY: " + socketIndex);
    sockets.splice(socketIndex, 1);
  });

});
