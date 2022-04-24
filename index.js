var express = require("express");
var app = express();
var server = require("http").createServer(app);
var sock = null;
var osc = require("node-osc");
const bci = require("bcijs");

// Creates Server
var Server = function(browserPort) {
  this.io = require("socket.io")(server); //Creates my http server
  app.use(express.static(__dirname));
  server.listen(browserPort, function() {
    console.log("Server listening at port %d", browserPort);
  });

  //EEG Data Management
  this.buffer = [];
  this.channels = {};
  this.SECONDS = 0.25;
  this.sampleRate = 256;
  this.BUFFER_SIZE = this.SECONDS * this.sampleRate;
};

Server.prototype.handleConnection = function(socket) {
  sock = socket;
  server.start();
  //console.log(sock);
};

Server.prototype.init = function() {
  console.log("Server initialized!");
  this.io.on("connection", this.handleConnection);
};

Server.prototype.sendClientMsg = function(id, msg) {
  if (sock) {
    //console.log("sending msg");
    sock.emit(id, { msg: msg });
  }
};

Server.prototype.start = function() {
  console.log("Starting");
  interval = 3000;
  setInterval(function() {
    var t = new Date().getTime();
    var random = Math.random() * 10;
    server.sendClientMsg("channel1", random);
  }, interval);
};

/*

Server.prototype.addData = function(sample, channel) {
  if (!server.channels[channel]) server.channels[channel] = [];
  var t = new Date().getTime();
  if (server.channels[channel].length > this.BUFFER_SIZE) {
    server.channels[channel].shift();
  }
  server.channels[channel].push([t++, sample]);
};

Server.prototype.getPowers = function(powers) {
  let currentPowers = bci.signalBandPower(
    server.channels[1],
    server.sampleRate,
    powers
  );
  return currentPowers;
};
*/

// Handles OSC Data
/*
var oscServer = new osc.Server(12345, "127.0.0.1");

// FFT -> [ChannelD, 1hz - 125hz]
oscServer.on("/openbci", function(data, rinfo) {
  for (var i in data) {
    if (isNaN(data[i])) continue;
    server.addData(data[i], i);
  }

  if (server.channels[1].length >= server.BUFFER_SIZE) {
    let powers = server.getPowers([8, 12]);
    //console.log("powers", powers);
  }
  //console.log(server.channels);
  server.sendClientMsg("eeg", server.channels);
});
*/

server = new Server("8080");
server.init();
//server.start();