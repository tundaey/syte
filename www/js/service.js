/**
 * Created by Tundaey on 8/22/2015.
 */
/**
 * Created by Tundaey on 8/15/2015.
 */
//var base = 'https://syte.herokuapp.com';
var base = 'http://localhost:7000/api/v1';
angular.module('syte.factory',[])
    .factory('Loader', ['$ionicLoading', '$timeout',
        function($ionicLoading, $timeout){
            var LOADERAPI = {
                showLoading: function(text){
                    text = text || 'Loading...';
                    $ionicLoading.show({
                        template: text
                    });
                },

                hideLoading: function(){
                    $ionicLoading.hide();
                },

                toggleLoadingWithMessage: function(text, timeout){
                    var that = this;
                    that.showLoading(text);
                    $timeout(function(){
                        that.hideLoading();
                    }, timeout || 3000);
                }
            }
            return LOADERAPI
        }])

    .factory('LSFactory', [function(){
        var LSAPI = {
            clear: function(){
                return localStorage.clear();
            },

            get: function(key){
                return JSON.parse(localStorage.getItem(key))
            },

            set: function(key, data){
                return localStorage.setItem(key,JSON.stringify(data));
            },

            delete: function(key){
                return localStorage.removeItem(key);
            }
        }

        return LSAPI;
    }])

    .factory('Auth', ['$http', '$firebaseAuth', '$firebaseArray', 'FBURL','LSFactory','$rootScope',
        function($http, $firebaseAuth, $firebaseArray, FBURL, LSFactory, $rootScope){
            var FBRef = new Firebase(FBURL);
            var auth = $firebaseAuth(FBRef);
            var auth = auth.$authWithCustomToken(LSFactory.get('token'));
        var Auth = {
            register: function(data){
                return $http.post(base + '/register', data);
            },

            verify: function(data){
                return $http.post(base + '/verify', data);
            },

            invite: function(data){
                return $http.post(base + '/invite', data)
            },

            signup: function(user){
                return $http.post(base + '/signup', user);
            },

            login: function(user){
                return $http.post(base + '/login', user);
            },

            user: {}
        }

            $rootScope.$on('$firebaseAuth')
        return Auth;
    }])