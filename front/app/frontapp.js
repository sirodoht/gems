/* globals io */

var socket = io('localhost:3000');
var userid = null;
var rituals = null;
var hand = null;

socket.on('userid', function (data) {
  userid = data.userid;
  console.log(userid);
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
}


$('#drawcard').on('click', function() {
  console.log(userid);
  drawCard();
});

$('#contribute').on('click', function() {
  contribute($('#contribute-order').val(), $('#contribute-color').val());
});

$('#combine').on('click', function() {
  combine($('#combine-color-1').val(), $('#combine-color-2').val());
});

