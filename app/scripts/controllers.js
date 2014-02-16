'use strict';

angular.module('exquisitehuesApp')
.controller('PoemCtrl', function($scope, $route, $routeParams) {
  var render = function() {
    if($route.current.action) {
      var renderAction = $route.current.action;
      var renderPath = renderAction.split( '.' );
      var poemid = ($routeParams.poemid || '');
      var ref = new Firebase('https://flickering-fire-2682.firebaseio.com/poems/'+ poemid);
      ref.on('value', function(snapshot) {
        var text = snapshot.val().fulltext;
        text = text.split('\n');
        $scope.$apply(function () {
          $scope.poemtext = text;
        });
      });
      var isPoems= (renderPath[ 0 ] === 'poems');
      $scope.renderAction = renderAction;
      $scope.renderPath = renderPath;
      $scope.isPoems = isPoems;
      console.log($scope.poemid);
    }
  };
  $scope.$on('$routeChangeSuccess', function() {
    render();
  });
})
.controller('LineCtrl', ['$scope', 'LineService',
  function($scope, service) {
    service.$bind($scope, 'lastLine');
  }
  ])
.controller('ArchiveCtrl', function($scope) {
  $scope.poems = ['one', 'two'];
  // var ref = new Firebase('https://flickering-fire-2682.firebaseio.com/poems');
  // debugger;
  // ref.on('value', function(snapshot) {
  //   var text = snapshot.val().fulltext;
  //   text = text.split('\n');
  //   $scope.$apply(function () {
  //     $scope.poemtext = text;
  //   });
  // });
  // var isPoems= (renderPath[ 0 ] === 'poems');
  // $scope.renderAction = renderAction;
  // $scope.renderPath = renderPath;
  // $scope.isPoems = isPoems;
  // console.log($scope.poemid);
});