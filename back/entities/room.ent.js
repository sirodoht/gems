var RitualEnt = require('ritual.ent');
var ritualsLength = 3;

/**
 * Room entity
 */

var RoomEnt = module.exports = function() {
  this.players = [];
  this.curPlayer = null;
  this.rituals = [];
  this.playing = false;
};

RoomEnt.prototype.populateRituals = function() {
  var orders = [3, 5, 8];
  for(var i=0; i<ritualsLength; i++) {
    this.rituals[i] = new RitualEnt(orders[i]);
  }
};

RoomEnt.prototype.addPlayer = function(player) {
  if(!this.playing) {
    this.players.push(player);
    return true;
  }

  return false;
};

RoomEnt.prototype.begin = function() {
  this.playing = true;

  var playerIdx = Math.round(Math.random*1000)%this.players.length;
  this.curPlayer = this.players[playerIdx];
};

RoomEnt.prototype.acceptContribution = function(playerId, ritualIdx, color) {
  var player = this.findPlayerById(playerId);

  if(ritualIdx > -1 && ritualIdx < ritualsLength && player) {
    this.rituals[ritualIdx].contribute(player, color);
    return true;
  }

  return false;
};

RoomEnt.prototype.findPlayerById = function(playerId) {
  return this.players.find(e => e.id === playerId);
};
