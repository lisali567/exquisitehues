'use strict';

angular.module('exquisitehuesApp')
.controller('MainCtrl', function($scope) {
  $scope.cool = 'cool';
})
.controller('AddCtrl', ['$scope', '$firebase',
  function($scope, $firebase) {
    $scope.author = 'Guest ' + Math.round(Math.random()*101);
    $scope.lines = $firebase(new Firebase('https://flickering-fire-2682.firebaseio.com/angulartest'));
    $scope.addLine = function() {
      $scope.lines.$add({author: $scope.author, text: this.text});
      $scope.text = '';
    };
  }
  ])
.controller('LineCtrl', ['$scope', '$firebase',
  function($scope, $firebase) {
    $scope.lines = $firebase(new Firebase('https://flickering-fire-2682.firebaseio.com/poems'));
    $scope.lines.$on('child_changed', function(snap) {
      var poem = snap.snapshot;
      var lines = poem.value;
      var ref;
      for (var line in lines) {
        if(line !== 'counter') {
          ref = line;
        }
      }
      $scope.name = lines[ref].text;
    });
  }
  ]);