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
    $scope.lines = $firebase(new Firebase('https://flickering-fire-2682.firebaseio.com/'));
    $scope.lines.$on('child_changed', function(dataSnapshot) {
      var current = dataSnapshot;
      var lines = current.snapshot.value;
      for(var line in lines) {
        console.log(line);
      }
      // current.snapshot.value
      // $scope.name = current.snapshot.value.text;
    });
  }
  ]);