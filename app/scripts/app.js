'use strict';

angular.module('exquisitehuesApp', [ 'ngRoute', 'firebase' ])
.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
  })
  .when('/about', {
    templateUrl: 'views/about.html',
  })
  .when('/archive', {
    templateUrl: 'views/archive.html',
    controller: 'ArchiveCtrl'
  })
  .when('/poems/:poemid', {
    templateUrl: 'views/poem.html',
    action: 'poems.view',
    controller: 'PoemCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
})
.factory('LineService', ['$firebase', function($firebase) {
  var ref = new Firebase('https://flickering-fire-2682.firebaseio.com/poems/lastLine');
  return $firebase(ref);
}]);