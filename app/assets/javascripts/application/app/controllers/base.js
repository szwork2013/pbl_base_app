(function () {
    'use strict';

    angular
        .module('app.pbl')
        .controller('BaseController', BaseController);

    BaseController.$inject = [
        '$scope', '$rootScope', '$document', '$q', '$timeout', '$interval', 'modals',
        'NOTIFIES_TYPES', 'RESOURCE_TYPES', 'PATHS', 'QINIU', 'DURATION_UNITS', 'ROLES', 'DISCIPLINES', 'INTERESTS', 'GROUP_TAGS', 'GRADES',
        'Resources', 'Follows', 'Friends', 'Groups', 'Invitations', 'User', 'Users',
        'TYPE_DEFIN', 'WORK_TYPES'
    ];

    function BaseController($scope, $rootScope, $document, $q, $timeout, $interval, modals,
                            NOTIFIES_TYPES, RESOURCE_TYPES, PATHS, QINIU, DURATION_UNITS, ROLES, DISCIPLINES, INTERESTS, GROUP_TAGS, GRADES,
                            Resources, Follows, Friends, Groups, Invitations, User, Users,
                            TYPE_DEFIN, WORK_TYPES) {

        $document.on('click', function () {
            $scope.$apply(function () {
                $rootScope.$broadcast('onDocumentClick');
            });
        });

        $interval(getCount, 15 * 1000);

        angular.extend($rootScope, {
            ROLES: ROLES,
            DISCIPLINES: DISCIPLINES,
            INTERESTS: INTERESTS,
            GROUP_TAGS: GROUP_TAGS,
            GRADES: GRADES,
            DURATION_UNITS: DURATION_UNITS,
            NOTIFIES_TYPES: NOTIFIES_TYPES,
            RESOURCE_TYPES: RESOURCE_TYPES,
            TYPE_DEFIN: TYPE_DEFIN,
            WORK_TYPES: WORK_TYPES,
            PATHS: PATHS,
            QINIU: QINIU,
            UPLOAD_HANDLES: {
                onBegin: onBegin,
                onProgress: onProgress,
                onSuccess: onSuccess,
                onCompleted: onCompleted
            },
            HANDLES: {
                scrollTop: scrollTop,
                login: login,
                follow: follow,
                unFollow: unFollow,
                isFriend: isFriend,
                isFollowed: isFollowed,
                isJoined: isJoined,
                join: join,
                leave: leave,
                search: search,
                getUser: getUser,
                getResource: getResource,
                getResources: getResources,
                getInvitation: getInvitation,
                removeResource: removeResource
            },
            RegisterModals: {
                controller: 'RegisterController as vm',
                defaults: {
                    closeable: true,
                    weight: 100,
                    titleHeight: '60px',
                    bgColor: '#fcfcfc',
                    textColor: '#fff',
                    center: true
                },
                modals: [
                    {
                        title: '请选择您的角色',
                        closeable: true,
                        textColor: '#333',
                        src: 'register/step-1.html'
                    }, {
                        title: '请填写您的帐号信息',
                        closeable: true,
                        src: 'register/:type/step-2.html'
                    }, {
                        title: '欢迎开启项目学习之旅',
                        src: 'register/:type/step-3.html'
                    }, {
                        title: '欢迎开启项目学习之旅',
                        src: 'register/:type/step-4.html'
                    }, {
                        title: '欢迎开启项目学习之旅',
                        src: 'register/:type/step-5.html'
                    }, {
                        title: '欢迎开启项目学习之旅',
                        src: 'register/:type/step-6.html'
                    }, {
                        title: '欢迎开启项目学习之旅',
                        src: 'register/:type/step-7.html'
                    }, {
                        title: '欢迎开启项目学习之旅',
                        src: 'register/:type/step-8.html'
                    }, {
                        title: '欢迎开启项目学习之旅',
                        src: 'register/:type/step-9.html'
                    }
                ]
            },
            RegisterModalConfig: RegisterModalConfig
        });

        getFollows();
        getGroups();
        getCount();

        $scope.$on('onGroupsChanged', getGroups);

        var currentUser = $rootScope.currentUser;

        if(currentUser){
            currentUser.current_step = currentUser.current_step || 2;
            var steps;
            switch(currentUser.type){
                case ROLES.teacher:
                    steps = 7;
                    break;
                case ROLES.student:
                    steps = 8;
                    break;
                case ROLES.parent:
                    steps = 4;
                    break;
            }
            if(currentUser.current_step < steps){
                modals($rootScope.RegisterModals).then(function (modal) {
                    var scope = modal.scope;
                    RegisterModalConfig(scope, $rootScope.currentUser.type);
                    scope.setStep($rootScope.currentUser.current_step);
                });
            }
        }

        function RegisterModalConfig(scope, type){
            var config;
            for (var i = 1; i < $rootScope.RegisterModals.modals.length; i++) {
                config = scope.getModalConfig(i);
                config.src = config.src.replace(/register\/(.+?)\/(.+?)/, 'register/' + type.toLowerCase() + '/$2');
                switch (type) {
                    case 'Teacher':
                        scope.getModalConfig({
                            bgColor: '#4182F0'
                        }, i);
                        break;
                    case 'Student':
                        scope.getModalConfig({
                            bgColor: '#73c828'
                        }, i);
                        break;
                    case 'Parent':
                        scope.getModalConfig({
                            bgColor: '#46c8f0'
                        }, i);
                        break;
                }
            }
        }

        function onBegin(object) {
            return function (data) {
                object.$uploading = true;
            }
        }

        function onProgress(object) {
            return function (evt) {
                object.$progress = Math.round(evt.loaded / evt.total * 100);
            }
        }

        function onSuccess(object) {
            return function (data) {
                delete object.$uploading;
            }
        }

        function onCompleted(object) {
            return function (data) {
                delete object.$uploading;
            }
        }

        function scrollTop(top){
            top = top || 0;
            angular.element('body').animate({scrollTop: top});
        }

        function login(user) {
            var defer = $q.defer(),
                code = Base64.encode([['username', user.username].join('='), ['password', user.password].join('=')].join('&')),
                iframe = $('<iframe style="display:none" src="/custom_login?q=' + code + '"></iframe>').appendTo('body');

            var listener = $scope.$watch(function () {
                return $scope.logged;
            }, function (logged) {
                if(logged){
                    defer.resolve(null);
                    delete $scope.logged;
                    listener();
                    iframe.remove();
                }
            });
            return defer.promise;
        }

        function follow(user_id) {
            Follows.add({
                user_id: user_id
            }, function () {
                getFriends();
                getFollows();
            });
        }

        function unFollow(user_id) {
            var follow = $rootScope.follows.findOne(function (item) {
                return item.user_id == user_id;
            });
            if (follow) {
                Follows.remove({
                    followId: follow.id
                }, function () {
                    getFriends();
                    getFollows();
                });
            }
        }

        function isFriend(user_id) {
            return $rootScope.friends && $rootScope.friends.has(function (user) {
                return user.id == user_id;
            });
        }

        function isFollowed(user_id) {
            return $rootScope.follows && $rootScope.follows.has(function (follow) {
                return follow.user_id == user_id;
            });
        }

        function isJoined(group_id) {
            return $rootScope.groups && $rootScope.groups.has(function (group) {
                return group.id == group_id;
            });
        }

        function join(group_id) {
            Groups.add({
                groupId: group_id,
                action: 'join'
            }, getGroups);
        }

        function leave(group_id) {
            Groups.remove({
                namespace: 'user',
                groupId: group_id,
                action: 'leave'
            }, getGroups);
        }

        function search(keyword, $event){
            var code = $event.keyCode || $event.which,
                element = angular.element($event.target),
                button = element.prev();
            if(code === 13 && keyword){
                $timeout(function () {
                    button.trigger('click');
                });
            }

        }

        function getUser(user_id){
            $rootScope.users = $rootScope.users || {};
            var defer = $q.defer(),
                user = $rootScope.users[user_id];
            if(user){
                defer.resolve(user);
            }else{
                $rootScope.users[user_id] = {};
                Users.get({
                    userId: user_id
                }, function (result) {
                    $rootScope.users[user_id] = result.data;
                    defer.resolve(result.data);
                }, function () {
                    defer.resolve(null);
                });
            }
            return defer.promise;
        }

        function getResource(resources, type, id) {
            return (resources || $scope.resources || []).findOne(function (item) {
                return (id && id == item.owner_id) && item.owner_type == type;
            });
        }

        function getResources(resources, type, id) {
            return (resources || $scope.resources || []).find(function (item) {
                return item.owner_id == id && item.owner_type == type;
            });
        }

        function getInvitation(ownerType, ownerId) {
            var defer = $q.defer();
            Invitations.all({
                owner_type: ownerType,
                owner_id: ownerId
            }, function (result) {
                if (result.data && result.data[0]) {
                    defer.resolve(result.data[0].code);
                } else {
                    defer.resolve(null);
                }
            });
            return defer.promise;
        }

        function removeResource(resourceId, callback) {
            Resources.remove({
                resourceId: resourceId
            }, callback || angular.noop);
        }

        function getFriends() {
            if ($rootScope.currentUser) {
                Friends.get(function (result) {
                    result.data.sort(function (a, b) {
                        return (a.friend.realname || a.friend.username).localeCompare((b.friend.realname || b.friend.username));
                    });
                    $rootScope.friends = result.data;
                });
            }
        }

        function getFollows() {
            Follows.get(function (result) {
                $rootScope.follows = result.data;
            });
        }

        function getGroups(){
            User.get({
                action: 'groups'
            }, function (result) {
                result.data.sort(function (a, b) {
                    return !a.clazz && b.clazz ? 1 : -1;
                });
                $rootScope.groups = result.data;
            });
        }

        function getCount(){

            User.get({
                action: 'notifies_count'
            }, function(result){
                $rootScope.notifies_count = result.count;
            });

            User.get({
                action: 'sms_count'
            }, function(result){
                $rootScope.sms_count = result.count;
            });

        }

    }

})();