(function () {
    'use strict';

    angular
        .module('app.routes')
        .config(configure);

    configure.$inject = ['$stateProvider'];

    function configure($stateProvider) {

        $stateProvider
            .state('base.home.projects.show', {
                abstract: true,
                url: '/:projectId',
                templateUrl: 'home/projects/show/layout.html',
                resolve: {
                    project: project
                },
                controller: 'ProjectShowController as vm'
            })
            .state('base.home.projects.show.info', {
                url: '',
                templateUrl: 'home/projects/show/views/info.html',
                controller: 'ProjectShowInfoController as vm'
            })
            .state('base.home.projects.show.members', {
                url: '/members',
                templateUrl: 'home/projects/show/views/members.html',
                controller: 'ProjectShowMembersController as vm'
            })
            .state('base.home.projects.show.knowledge', {
                url: '/knowledge',
                templateUrl: 'home/projects/show/views/knowledge.html',
                controller: 'ProjectShowKnowledgeController as vm'
            })
            .state('base.home.projects.show.scaffold', {
                url: '/scaffold',
                templateUrl: 'home/projects/show/views/scaffold.html',
                controller: 'ProjectShowScaffoldController as vm'
            })
            .state('base.home.projects.show.assignment', {
                url: '/assignment',
                templateUrl: 'home/projects/show/views/assignment.html',
                controller: 'ProjectShowAssignmentController as vm'
            })
            .state('base.home.projects.show.resources', {
                url: '/resources',
                templateUrl: 'home/projects/show/views/resources.html',
                controller: 'ProjectShowResourcesController as vm'
            })
            .state('base.home.projects.show.statistics', {
                url: '/statistics',
                templateUrl: 'home/projects/show/views/statistics.html',
                controller: 'ProjectShowStatisticsController as vm'
            });

        project.$inject = ['$q', '$state', '$stateParams', 'getProject'];

        function project($q, $state, $stateParams, getProject) {
            var defer = $q.defer();
            if ($stateParams.projectId) {
                getProject({projectId: $stateParams.projectId})
                    .then(function (project) {
                        defer.resolve(project);
                    });
            } else {
                $state.go('base.pbl');
            }
            return defer.promise;
        }

    }

})();