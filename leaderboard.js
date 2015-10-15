// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Players = new Meteor.Collection("players");

/**
 * Separate player logic into an own service singleton for better testability and reusability.
 * @type {{}}
 */
PlayersService = {
  getPlayerList: function () {
    return Players.find({}, {sort: {score: -1, name: 1}});
  },
  getPlayer: function (playerId) {
    return Players.findOne(playerId);
  },
  rewardPlayer: function (playerId) {
    Players.update(playerId, {$inc: {score: 5}});
  },
  punishPlayer: function(playerId){
      Players.update(playerId, {$inc: {score: -5}});
  },
  playersExist: function () {
    return Players.find().count() > 0;
  },
  addPlayer: function(name){
    Players.insert({name: name, score: 0});
  },
  deletePlayer: function(playerId){
    Players.remove(playerId);
  },
  resetScore: function(playerId){
    Players.update(playerId, {$set: {score:0}});
  },
  generateRandomPlayers: function () {
    var names = ["Ada Lovelace",
                 "Grace Hopper",
                 "Marie Curie",
                 "Carl Friedrich Gauss",
                 "Nikola Tesla",
                 "Claude Shannon"];
    for (var i = 0; i < names.length; i++) {
      Players.insert({name: names[i], score: this._randomScore()});
    }
  },
  _randomScore: function () {
    return Math.floor(Random.fraction() * 10) * 5
  },
};

if (Meteor.isClient) {
  Template.leaderboard.helpers({
    players: function () {
      return PlayersService.getPlayerList();
    },

    selected_name: function () {
      var player = PlayersService.getPlayer(Session.get("selected_player"));
      return player && player.name;
    }
  });

  Template.leaderboard.events({
    'click input.inc': function () {
      PlayersService.rewardPlayer(Session.get("selected_player"));
    },
    'click input.dec': function () {
      PlayersService.punishPlayer(Session.get("selected_player"));
    },
    'click input.add': function () {
      var name = $('#name').val();
      PlayersService.addPlayer(name);
    },
    'click input.del': function () {
      PlayersService.deletePlayer(Session.get("selected_player"));
    },
    'click input.reset': function () {
      PlayersService.resetScore(Session.get("selected_player"));
    },
    'click input.resetall': function () {
      Meteor.call("resetAllScores");
    }
  });


  Template.player.helpers({
    selected: function () {
      return Session.equals("selected_player", this._id) ? "selected" : '';
    }
  });

  Template.player.events({
    'click': function () {
      Session.set("selected_player", this._id);
    }
  });

  Meteor.subscribe("players");

}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (!PlayersService.playersExist()) {
      PlayersService.generateRandomPlayers();
    }

    Meteor.publish('players', function(){
      return Players.find();
    });

    Meteor.methods({
      'resetAllScores': function(){
          Players.update({}, {$set:{score:0}}, {multi: true});
      }
    });

  });
}
