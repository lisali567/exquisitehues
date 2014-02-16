'use strict';

angular.module('exquisitehuesApp')
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
    $scope.lines = $firebase(new Firebase('https://flickering-fire-2682.firebaseio.com/angulartest'));
    $scope.lines.$on('child_added', function(dataSnapshot) {
      var current = dataSnapshot;
      $scope.name = current.snapshot.value.text;
    });
  }
  ]);