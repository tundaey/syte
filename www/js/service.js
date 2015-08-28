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

    .factory('Auth', ['$http', '$q', 'AuthToken',
        function($http, $q, AuthToken){
           var authFactory = {
               register: function(data){
                   return $http.post(base + '/register', data)
               },

               verify: function(data){
                   return $http.post(base + '/verify', data)
                       .success(function(data){
                           AuthToken.setToken(data.token)
                           return data;
                       });
               },

               invite: function(data){
                   return $http.post(base + '/invite', data)
               },

               signup: function(user){
                   return $http.post(base + '/signup', user)
                       .success(function(data){
                           AuthToken.setToken(data.token)
                           return data;
                       });;
               },

               login: function(user){
                   return $http.post(base + '/login', user)
                       .success(function(data){
                           AuthToken.setToken(data.token)
                           return data;
                       });;
               },

               logout: function(){
                   AuthToken.deleteAuth();
               },

               isLoggedIn: function(){
                   if(AuthToken.getToken()){
                       return true
                   }else{
                       return false;
                   }
               },

               getUser: function(){
                   if(AuthToken.getToken()){
                       return $http.get('/api/v1/profile');
                   }else{
                       $q.reject({message: 'User has no token'});
                   }
               }
           }

            return authFactory;
    }])
    .factory('AuthToken', ['LSFactory', function(LSFactory){
        var tokenKey = 'token';
        var userKey = 'user';
        var authTokenFactory = {}
        authTokenFactory.getToken = function(){
            LSFactory.get(tokenKey);
        };

        authTokenFactory.setToken = function(token){
            LSFactory.set(tokenKey, token);
        };

        authTokenFactory.setUser = function(user){
            LSFactory.set(userKey, user);
        };

        authTokenFactory.getUser = function(){
            LSFactory.get(userKey);
        }

        authTokenFactory.deleteAuth = function(){
            LSFactory.delete(tokenKey);
            LSFactory.delete(userKey);
        }

        return authTokenFactory;
    }]).factory('AuthInterceptor',['$q','$state','AuthToken', function($q, $state, AuthToken){
        var interceptorFactory = {
            request: function(config){
                var token = AuthToken.getToken();
                var user = AuthToken.getUser();
                if(token && user){
                    config.headers['X-access-token'] = token;
                    config.headers['X-key'] = user.id;
                    config.headers['Content-type'] = "application/json"
                }

                return config;
            },

            responseError: function(response){
                if(response.status == 403){
                   AuthToken.deleteAuth();
                    $state.go('login');
                }
                $q.reject(response)
            }
        }

        return interceptorFactory;
    }]).factory('CompanyFactory', ['$http', function($http){
        var companyAPI = {
            createProject: function(project, companyId){
                return $http.post(base + '/' + companyId + '/projects')
            },

            getProjects: function(companyId){
                return $http.get(base + '/' + companyId + '/projects')
            },

            viewProject: function(companyId, projectId){
                return $http.get(base + '/' + companyId + '/projects/' + projectId);
            }
        }
    }])