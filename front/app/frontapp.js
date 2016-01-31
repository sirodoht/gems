/* globals io */

require('./view.js');

var socket = io(window.location);
var userid = null;
var rituals = null;
var hand = null;
var colors = require('../../back/etc/colors.etc');
var firstRituals = true;



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
  var orderShapeMap = {'triangle':3, 'pentagon':5, 'circle':8};
  grid.data('order', orderShapeMap[shape]);

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
      }).html((r.isContributed[i])?'C':'')
      .css({'background-color': colors[c].rgb});
    });
  });
  var $ritualGrids = $('.ritual-grid');

  if(firstRituals) {
    $ritualGrids.on('dragover', function(e) {
      var dtObj = e.originalEvent.dataTransfer;

      dtObj.effectAllowed = 'all';

      this.style.borderStyle = 'dashed';
    });

    $ritualGrids.on('dragleave', function() {
      this.style.borderStyle = 'none';
    });

    $ritualGrids.on('drop', function(e) {
      if (e.stopPropagation) {
        e.stopPropagation();
      }

      var dtObj = e.originalEvent.dataTransfer;

      var color = dtObj.getData('text/json');

      var order = $(this).data('order');

      contribute(order, color);

      this.style.borderStyle = 'none';
    });

    $ritualGrids.on('dragover', function(e) {
      if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
      }
      return false;
    });

    firstRituals = false;
  }
});

var cardTmpl = _.template('<div class="card" '+
                          'style="'+
                          'background-color:<% print(colors[c].rgb) %>" draggable="true"></div>');

socket.on('hand', function(data) {
  hand = data;
  console.log(data);
  var $cards = $('.cards');
  $cards.html('');
  hand.forEach(function(c) {
    var $card = $(cardTmpl({c:c, colors: colors}));
    $cards.append($card);
    $card.data('color', c);
  });
  var $cardElems = $('.card');

  var $cellSize = $('.ritual-cell').css('width');
  var $cardSize = $('.card').css('width');

  $cardElems.on('dragstart', function(e) {

    var dtObj = e.originalEvent.dataTransfer;

    var dragElem = document.createElement('img');
    dragElem.style.height = $cellSize;
    dragElem.style.width = $cellSize;
    dragElem.style.backgroundColor =  this.style.backgroundColor;


    dtObj.setDragImage(dragElem, -10, -10);

    dtObj.setData('text/json', $(e.target).data('color'));
  });

  $cardElems.on('dragend', function() {

    this.style.width = $cardSize;
    this.style.height = $cardSize;
    this.style.opacity = 1;
  });

  $cardElems.on('dragover', function() {
    return false;
  });

  $cardElems.on('dragenter', function() {
    this.style.borderStyle = 'dashed';
  });

  $cardElems.on('dragleave', function() {
    this.style.borderStyle = 'none';
  });

  $cardElems.on('drop', function(e) {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    var dtObj = e.originalEvent.dataTransfer;

    var color2 = dtObj.getData('text/json');
    var color1 = $(this).data('color');

    combine(color1, color2);

    this.style.borderStyle = 'none';


  });
});

socket.on('disconnect', function() {
  socket.close();
});


$('#drawcard').on('click', function() {
  console.log(userid);
  drawCard();
});

$('#begin').on('click', function() {
  begin();
});
