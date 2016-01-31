/* globals io */

var socket = io('localhost:3000');
var userid = null;
var rituals = null;
var hand = null;
var colors = require('../../back/etc/colors.etc');

socket.on('userid', function (data) {
  userid = data.userid;
  console.log(userid);
});

socket.on('colors', function(data) {
  colors = data.colors;
});

var cellTmpl = _.template('<div class="ritual-cell"></div>');
var rowTmpl = _.template('<div class="ritual-row"></div>');
var gridTmpl = _.template('<div class="ritual-grid"'+
                          ' style="background-image:url(/image/<% print(shape) %>.png)">'+
                          '</div>');
function createGrid(shape) {
  var grid = $(gridTmpl({shape:shape}));
  var cells = [];

  var coordinates = {
    triangle: {
      x: [1,4,4],
      y: [2,0,4]
    },
    pentagon: {
      x:[0,2,2,4,4],
      y:[2,0,4,1,3]
    },
    circle: {
      x:[0,1,1,2,2,3,3,4],
      y:[2,0,4,0,4,0,4,2]
    }
  };

  for(var i=0; i<5; i++) {
    var row = $(rowTmpl());
    grid.append(row);
    cells[i] = [];
    for(var j=0; j<5; j++) {
      var cell = $(cellTmpl());
      cells[i][j] = cell;
      $(row).append(cell);
    }
  }
  var y = coordinates[shape].y;
  coordinates[shape].x.forEach((x,i)=>cells[x][y[i]].addClass('ritual-holder '+shape));
  return grid;
}

$('.ritual-grids').append([createGrid('triangle'), createGrid('pentagon'), createGrid('circle')]);

socket.on('rituals', function(data) {
  rituals = data;
  console.log(data);

  rituals.forEach(function(r) {
    var orderShapeMap = {3:'triangle', 5:'pentagon', 8:'circle'};
    var holders = $('.ritual-holder.'+orderShapeMap[r.order]);
    r.requiredColors.forEach(function(c, i) {
      holders.eq(i).data({
        color:c,
        isContributed: r.isContributed[i]
      })
      .css({'background-color': colors[c].rgb});
    });
  });
});

var cardTmpl = _.template('<div class="card" '+
                          'style="'+
                          'background-color:<% print(colors[c].rgb) %>"></div>');

socket.on('hand', function(data) {
  hand = data;
  console.log(data);
  $cards = $('.cards');
  $cards.html('');
hand.forEach(function(c) {
    var $card = $(cardTmpl({c:c, colors: colors}));
    $cards.append($card);
    $card.data('color', c);
  });
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

function begin() {
  socket.emit('begin');
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

$('#begin').on('click', function() {
  begin();
});

