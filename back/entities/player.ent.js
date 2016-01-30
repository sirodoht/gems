var shortid = require('shortid');
var colors = require('../etc/colors.etc');
var handSize = 3;
/**
 * User entity
 */
var UserEnt = module.exports = function() {
  this.id = shortid.generate();
  this.hand = [];
  this.points = 0;

  this.populateHand();
};

UserEnt.prototype.populateHand = function () {
  for(var i=0; i<handSize; i++) {
    var colorLength = Object.keys(colors).length;
    var colorIdx = Math.round(Math.random()*1000)%colorLength;
    var c = Object.keys(colors)[colorIdx];
    this.hand[i] = c;
  }
};

UserEnt.prototype.combine = function(color1, color2) {
  if(this.hasColor(color1) && this.hasColor(color2)) {
      if(colors[color1].basic && colors[color2].basic) {
        var colorIdx1 = this.hand.indexOf(color1);
        this.hand.splice(colorIdx1, 1);

        var colorIdx2 = this.hand.indexOf(color2);
        this.hand.splice(colorIdx2, 1);

        this.hand.push(colors[color1].combine[color2]);
        return true;
      }
    }

  return false;
};

UserEnt.prototype.drawCard = function() {
  var colorLength = Object.keys(colors).length;
  var colorIdx = Math.round(Math.random()*1000)%colorLength;
  var c = Object.keys(colors)[colorIdx];
  this.hand.push(c);
  return true;
};

UserEnt.prototype.hasColor = function(color) {
  return this.hand.indexOf(color) !== -1;
};

UserEnt.prototype.removeColor = function(color) {
  if(this.hasColor(color)) {
    var colorIdx = this.hand.indexOf(color);
    this.hand.splice(colorIdx, 1);
    return true;
  }
  return false;
};
