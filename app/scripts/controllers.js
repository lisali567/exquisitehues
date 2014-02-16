'use strict';

angular.module('exquisitehuesApp')
.controller('MainCtrl', function($scope) {
  $scope.cool = 'cool';
})
.controller('LineCtrl', ['$scope', 'LineService',
    function($scope, service) {
      service.$bind($scope, 'lastLine');
    }
  ]);