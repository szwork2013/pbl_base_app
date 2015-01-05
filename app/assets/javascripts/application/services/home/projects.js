(function () {
    'use strict';

    angular
        .module('app.services')
        .service('Projects', Projects)
        .service('ProjectStandards', ProjectStandards)
        .service('ProjectTechniques', ProjectTechniques)
        .service('ProjectProducts', ProjectProducts)
        .service('ProjectGauges', ProjectGauges)
        .service('ProjectMembers', ProjectMembers)
        .service('ProjectTeachers', ProjectTeachers)
        .service('ProjectGroupings', ProjectGroupings);


    Projects.$inject = ['$resource', 'RESOURCE_ACTIONS'];

    function Projects($resource, RESOURCE_ACTIONS) {
        return $resource('/projects/:projectId', {
            projectId: '@projectId'
        }, RESOURCE_ACTIONS);
    }

    ProjectStandards.$inject = ['$resource', 'RESOURCE_ACTIONS'];

    function ProjectStandards($resource, RESOURCE_ACTIONS) {
        return $resource('/project/standard_items/:action/:standardItemId', {
            action: '@action',
            standardItemId: '@standardItemId',
            include: 'standard_items'
        }, RESOURCE_ACTIONS);
    }

    ProjectTechniques.$inject = ['$resource', 'RESOURCE_ACTIONS'];

    function ProjectTechniques($resource, RESOURCE_ACTIONS) {
        return $resource('/project/techniques/:action/:techniqueId', {
            action: '@action',
            techniqueId: '@techniqueId',
            include: 'techniques'
        }, RESOURCE_ACTIONS);
    }

    ProjectProducts.$inject = ['$resource', 'RESOURCE_ACTIONS'];

    function ProjectProducts($resource, RESOURCE_ACTIONS) {
        return $resource('/project/products/:action/:productId', {
            action: '@action',
            productId: '@productId',
            include: 'product_forms'
        }, RESOURCE_ACTIONS);
    }

    ProjectGauges.$inject = ['$resource', 'RESOURCE_ACTIONS'];

    function ProjectGauges($resource, RESOURCE_ACTIONS) {
        return $resource('/project/rules/:gaugeId', {
            action: '@action',
            gaugeId: '@gaugeId',
            include: 'techniques'
        }, RESOURCE_ACTIONS);
    }

    ProjectMembers.$inject = ['$resource', 'ROLES', 'RESOURCE_ACTIONS'];

    function ProjectMembers($resource, ROLES, RESOURCE_ACTIONS) {
        return $resource('/projects/:projectId/assignments/:assignmentId', {
            projectId: '@projectId',
            assignmentId: '@assignmentId',
            name: ROLES.student,
            limit: 100
        }, RESOURCE_ACTIONS);
    }

    ProjectTeachers.$inject = ['$resource', 'ROLES', 'RESOURCE_ACTIONS'];

    function ProjectTeachers($resource, ROLES, RESOURCE_ACTIONS) {
        return $resource('/projects/:projectId/assignments/:assignmentId', {
            projectId: '@projectId',
            assignmentId: '@assignmentId',
            name: ROLES.teacher
        }, RESOURCE_ACTIONS);
    }

    ProjectGroupings.$inject = ['$resource', 'RESOURCE_ACTIONS'];

    function ProjectGroupings($resource, RESOURCE_ACTIONS) {
        return $resource('/groupings/:projectId', {
            projectId: '@projectId'
        }, RESOURCE_ACTIONS);
    }

})();