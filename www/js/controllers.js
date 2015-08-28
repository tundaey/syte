angular.module('syte.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, Loader, $ionicPlatform, $rootScope) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});
        $ionicPlatform.ready(function () {
            $scope.items = [
                {title: 'Pencom GFI', description: 'hello there this my new project as you can see we are live at the project', update:3},
                {title: 'Leptons', description: 'hello there this my new project as you can see we are live at the project', update:3},
                {title: 'MEED', description: 'hello there this my new project as you can see we are live at the project', update:3}
            ]

            $scope.createProject = function(){
                console.log('clicked!')
            }
        })
    })

.controller('AuthCtrl', function($scope, Loader, AuthToken, Auth, LSFactory, $state, $location, $ionicPlatform, $rootScope) {
      $ionicPlatform.ready(function(){
          Loader.hideLoading();
          $rootScope.$on('$stateChangeStart', function(){
              $rootScope.isAuthenticated = Auth.isLoggedIn();
          })

          $scope.user = {};
          $scope.invited = {};
          $scope.loginData = {};
          $scope.signupData = {};

          //request Trial will now be on the web. verify will now be through mail confirmation
          $scope.requestTrial = function(){
              Loader.showLoading('Registering....');
              Auth.register($scope.user).success(function(data){
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

          $scope.invite = function(){
              Loader.showLoading('Inviting...');
              Auth.invite().success(function(data){
                  Loader.hideLoading();
                  $location.path('/app/browse');
              }).error(function(message){
                  Loader.hideLoading();

              })
          }

          $scope.login = function(){
              Loader.showLoading('Authenticating....');
              Auth.login($scope.loginData).success(function(data){
                  Loader.hideLoading();
                  console.log(data);
                  AuthToken.setToken(data.token)
                  $location.path('/app/browse');
              })
          }

          $scope.signup = function(){
              Loader.showLoading('Please Wait....');
              Auth.signup($scope.signupData).success(function(data){
                  Loader.hideLoading();
                  console.log(data);
                  AuthToken.setToken(data.token)
                  $location.path('/app/browse');
              })
          }

      })
})

