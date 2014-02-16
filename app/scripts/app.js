'use strict';

angular.module('exquisitehuesApp', [ 'ngRoute', 'firebase' ])
.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .when('/about', {
    templateUrl: 'views/about.html',
    controller: 'MainCtrl'
  })
  .when('/archive', {
    templateUrl: 'views/archive.html',
    controller: 'MainCtrl'
  })
  .when('/addline', {
    templateUrl: 'views/addline.html',
    controller: 'AddCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
})
.factory('LineService', ['$firebase', function($firebase) {
  var ref = new Firebase('https://flickering-fire-2682.firebaseio.com/angulartest');
  return $firebase(ref);
}]);
// .factory('AddLineService', ['$firebase', function($firebase) {
//   var ref = new Firebase('https://flickering-fire-2682.firebaseio.com/angulartest');
//   return $firebase(ref);
// }]);