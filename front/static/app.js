(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* globals io */

var socket = io('localhost:3000');
var userid = null;
var rituals = null;
var hand = null;

socket.on('userid', function (data) {
  userid = data;
  console.log(data);
});

socket.on('rituals', function(data) {
  rituals = data;
  console.log(data);
});

socket.on('hand', function(data) {
  hand = data;
  console.log(data);
});

function drawCard() {
  socket.emit('drawcard', {userid: userid});
}

function combine(color1, color2) {
  socket.emit('combine', {
    userid: userid,
    color1: color1,
    color2: color2
  });
}

function contribute(ritual, color) {
  socket.emit('contribute', {
    userid: userid,
    ritual: ritual,
    color: color
  });

  document.getElementById('drawcard').addEventListener('click', function() {
    drawCard();
  });
}


},{}]},{},[1]);
