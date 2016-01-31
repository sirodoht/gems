var RitualEnt = require('./ritual.ent');
var ritualsLength = 3;

/**
 * Room entity
 */

var RoomEnt = module.exports = function() {
  this.players = [];
  this.curPlayer = null;
  this.rituals = [];
  this.playing = false;
  this.completedRituals = [];

  this.populateRituals();
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

  var playerIdx = Math.round(Math.random()*1000)%this.players.length;
  this.curPlayer = this.players[playerIdx];
};

RoomEnt.prototype.acceptContribution = function(playerId, ritualOrder, color) {
  if(!this.playing) {
    return false;
  }

  var player = this.findPlayerById(playerId);
  var ritual = this.findRitualByOrder(ritualOrder);

  if(ritual && player && player.id === this.curPlayer.id) {
    if(ritual.contribute(player, color)) {

      if(ritual.isComplete()) {
        this.completeRitual(ritual);
      }
      this.rotatePlayer();
      return true;
    }
  }

  return false;
};

RoomEnt.prototype.drawCard = function(playerId) {
  if(!this.playing) {
    return false;
  }

  var player = this.findPlayerById(playerId);
  if(player && playerId === this.curPlayer.id) {
    if(player.drawCard()) {
      this.rotatePlayer();
      return true;
    }
  }
  return false;
};

RoomEnt.prototype.combine = function(playerId, color1, color2) {
  if(!this.playing) {
    return false;
  }

  var player = this.findPlayerById(playerId);

  if(player && player.id === this.curPlayer.id) {
    if(player.combine(color1, color2)) {
      this.rotatePlayer();
      return true;
    }
  }

  return false;
};

RoomEnt.prototype.findPlayerById = function(playerId) {
  return this.players.find(e => e.id === playerId);
};

RoomEnt.prototype.findRitualByOrder = function(order) {
  return this.rituals.find(e => e.order === order);
};

RoomEnt.prototype.completeRitual = function(ritual) {
  var ritualIdx = this.rituals.indexOf(ritual);
  if(ritualIdx > -1 ) {
    this.rituals.splice(ritualIdx, 1);
    this.completedRituals.push(ritual);
    this.rituals.push(new RitualEnt(ritual.order));
    return true;
  }
  return false;
};

RoomEnt.prototype.getClientRituals = function() {
  var res = this.rituals.map(e => e= {
    imageLink: e.imageLink,
    order: e.order,
    requiredColors: e.requiredColors,
    isContributed: e.isContributed
  });

  return res;
};

RoomEnt.prototype.rotatePlayer = function() {
  var nextPlayerIdx = (this.players.indexOf(this.curPlayer)+1)%this.players.length;
  this.curPlayer = this.players[nextPlayerIdx];
};

RoomEnt.prototype.kickPlayer = function(playerId) {
  var p = this.findPlayerById(playerId);
  var playerIdx = this.players.indexOf(p);
  this.players.splice(playerIdx, 1);
  if(playerId === this.curPlayer.id) {
    this.rotatePlayer();
  }
};
