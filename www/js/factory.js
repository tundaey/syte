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

    .factory('UserFactory', ['$http', 'AuthFactory', function($http, AuthFactory){
        var UserAPI = {
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

            logout: function(){
                AuthFactory.deleteAuth();
            }
        }

        return UserAPI;
    }]).factory('AuthFactory', ['LSFactory', '$q',
            function(LSFactory){
                var userkey = 'user';
                var tokenKey = 'token';
                var AuthAPI = {
                    isLoggedIn: function(){
                        return this.getUser() === null ? false : true;
                    },

                    getUser: function(){
                        return LSFactory.get(userkey);
                    },

                    setUser: function(user){
                        return LSFactory.set(userkey, user)
                    },

                    getToken: function(){
                        LSFactory.get(tokenKey);
                    },

                    setToken: function(token){
                        LSFactory.set(tokenKey, token);
                    },

                    deleteAuth: function(){
                        LSFactory.delete(userkey);
                        LSFactory.delete(tokenKey);
                    }
                }
                return AuthAPI;

            }])
    .factory('TokenInterceptor', ['$q','AuthFactory', function($q, AuthFactory){
        return {
            request: function(config){
                config.headers = config.headers || {};
                var token = AuthFactory.getToken();
                var user = AuthFactory.getUser();
                if(token && user){
                    config.headers['X-access-token'] = token;
                    config.headers['X-key'] = user.id;
                    config.headers['Content-type'] = "application/json"
                }

                return config || $q.when(config);
            },

            response: function(response){
                return response || $q.when(response)
            }
        }
    }])