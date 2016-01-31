var colors = require('../etc/colors.etc');
var imgMap = {
  3: '/image/triangle.png',
  5: '/image/pentagon.png',
  8: '/image/circle.png'
};

/**
 * Room entity
 */
var RitualEnt = module.exports = function(order) {
  this.id = null;
  this.imageLink = imgMap[order];
  this.requiredColors = [];
  this.isContributed = [];
  this.contributor = [];
  this.order = order;

  this.populate();
};

RitualEnt.prototype.populate = function () {
  for(var i=0; i<this.order; i++) {
    var colorLength = Object.keys(colors).length;
    var colorIdx = Math.round(Math.random()*1000)%colorLength;
    var c = Object.keys(colors)[colorIdx];
    this.requiredColors[i] = c;
    this.isContributed[i] = false;
  }
};

RitualEnt.prototype.contribute = function(player, color) {
  var colorIdx = this.indexOfNonContributedColor(color);

  if( colorIdx > -1) {
    this.contributor[colorIdx] = player;
    this.isContributed[colorIdx] = true;

    player.points += this.order * 100;

    if(player.removeColor(color)) {
      return true;
    }
  }

  return false;
};

RitualEnt.prototype.indexOfNonContributedColor = function(color) {
  return this.requiredColors.findIndex((e,i)=>e===color && !this.isContributed[i]);
};


RitualEnt.prototype.isComplete = function() {
  return this.isContributed.reduce((p,c)=> p&&c);
};
