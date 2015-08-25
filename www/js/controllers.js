angular.module('syte.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, currentAuth, $state, Loader, $ionicPlatform, $rootScope) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});
        $ionicPlatform.ready(function () {
            Loader.hideLoading();
            $rootScope.$on('showDashboard', function () {
                $state.go('app.browse');
            });
            /*if (currentAuth) {
                $scope.$broadcast('showDashboard');
            }*/


        })
    })

.controller('AuthCtrl', function($scope, Loader, UserFactory, LSFactory, $state, currentAuth, $ionicPlatform, FirebaseFactory, $rootScope) {
      $ionicPlatform.ready(function(){
          Loader.hideLoading();
          $rootScope.$on('showDashboard', function(){
              $state.go('app.browse');
          });

          if(currentAuth){
            $rootScope.$broadcast('showDashboard');
          }


          $scope.user = {};
          $scope.requestTrial = function(){
              Loader.showLoading('Registering....');
              UserFactory.register($scope.user).success(function(data){
                  Loader.hideLoading();
                  console.log(data);
                  console.log(data.phone);
                  LSFactory.set('number', data.phone);
                  $state.go('verify');
              }).error(function(message){
                  Loader.hideLoading();
                  console.log(message);
                  Loader.toggleLoadingWithMessage(message);
                  $state.go('home');
              })
          }

          $scope.code = {};
          $scope.number = LSFactory.get('number');
          $scope.verify = function(){
              Loader.showLoading();
              UserFactory.verify($scope.code).success(function(data){
                  console.log(data);
                  Loader.hideLoading();
                  LSFactory.set('token', data.token);
                  FirebaseFactory.auth().then(function(authData){
                      console.log(authData);
                     $rootScope.$broadcast('showDashboard');
                      LSFactory.delete('token');
                  }).catch(function(error){
                      console.log(error);
                  })
              }).error()
          }

      })
})

