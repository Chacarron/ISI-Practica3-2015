describe('Tester', function () {
  'use strict';

  describe('punishPlayer', function () {
    it('should decrease 5 points to the player score with the given id', function () {
      var playerId = 1;
      spyOn(Players, 'update');

      PlayersService.punishPlayer(playerId);
      expect(Players.update.calls.argsFor(0)).toEqual([playerId, {$inc: {score: -5}}]);
    });
  });

  describe('New Player', function () {
    it('should create new player', function () {
      var name = "chaca";
      spyOn(Players, 'insert');

      PlayersService.addPlayer(name);
      expect(Players.insert.calls.argsFor(0)).toEqual([{name: name, score: 0}]);
    });
  });

 describe('Delete Player', function () {
    it('should remove a player given name', function () {
      var name = "Grace Hopper";
      spyOn(Players, 'remove');

      PlayersService.deletePlayer(name);
      expect(Players.remove.calls.argsFor(0)).toEqual([name]);
    });
  });

 describe('Reset Score', function () {
    it('should set score to 0 ', function () {
      var playerId = 1;
      spyOn(Players, 'update');

      PlayersService.resetScore(playerId);
      expect(Players.update.calls.argsFor(0)).toEqual([playerId, {$set: {score: 0}}]);
    });
  });
  

});
