(function () {
    'use strict';

    angular
        .module('app.pbl')
        .controller('ProjectShowAssignmentController', ProjectShowAssignmentController);

    ProjectShowAssignmentController.$inject = ['$scope', 'RESOURCE_TYPES', 'Resources', 'project',
        'Disciplines', 'Knowledge', 'Tasks', 'ProjectProducts', 'ProjectGauges', 'ProjectMembers',
        'Groupings', 'Discussions', 'Works', 'Scores', 'TYPE_DEFIN'];

    function ProjectShowAssignmentController($scope, RESOURCE_TYPES, Resources, project,
                                             Disciplines, Knowledge, Tasks, ProjectProducts, ProjectGauges, ProjectMembers,
                                             Groupings, Discussions, Works, Scores, TYPE_DEFIN) {

        var vm = this;
        vm.project = project;
        vm.showTask = showTask;
        vm.showtask = [];
        vm.disciplines = [];
        vm.isgroup = isgroup;
        vm.dateFormat = dateFormat;
        vm.getResources = getResources;
        vm.getResourcesWork = getResourcesWork;

        getProjectGauges();
        onProjectTasks();
        onProjectProducts();
        getMembers();
        getDiscussions();

        Disciplines.all(function (data) {
            vm.disciplines = data.data;
            //测试ng-model绑定
            //vm.disciplines.push(vm.project.tasks[0].test.discipline);
        });

        $scope.$watch(function () {
            return vm.project.rule_head;
        }, function (heads) {

            vm.project.ruleHeads = (heads || '11111').substr(0, 5).split('').map(function (v, i) {
                return {
                    disabled: v == 0
                }
            });
        });

        function getMembers() {
            ProjectMembers.all({
                projectId: project.id
            }, function (result) {
                vm.members = result.data;
                vm.usersHash = {};
                angular.forEach(vm.members, function (member) {
                    vm.usersHash[member.user.id] = member.user;
                });
            });
        }

        function getProjectGauges() {
            ProjectGauges.all({
                project_id: project.id
            }, function (result) {
                project.rules = result.data;
            });
        }

        function getDiscussions() {
            Discussions.all({
                project_id: project.id
            }, function (result) {
                var discussions = result.data,
                    count = discussions.length;
                if (count) {
                    vm.released = true;
                    vm.count = count;
                    vm.groups = discussions;
                } else {
                    getGroupings();
                }
            });
        }

        function onProjectTasks() {
            Tasks.all({
                project_id: vm.project.id
            }, function (result) {
                vm.tasks = result.data;

                for (var i = 0; i < vm.tasks.length; i++) {
                    vm.tasks[i].rule_ids = vm.tasks[i].rule_ids || [];
                    getTaskRules(vm.tasks[i]);
                    getTaskWorks(vm.tasks[i]);
                }
                getTaskResources();
            });
        }

        function getTaskResources() {
            Resources.all({
                owner_types: RESOURCE_TYPES.project.task,
                owner_ids: vm.tasks.map(function (task) {
                    return task.id;
                }).join(',')
            }, function (result) {
                vm.resources = result.data;
            });
        }

        function getTaskRules(task) {
            task.rules = [];
            for (var i = 0, rule; i < task.rule_ids.length; i++) {
                rule = vm.project.rules.findOne(function (item) {
                    return item.id == task.rule_ids[i];
                });
                task.rules.push(rule);
            }

        }

        function getTaskWorks(task) {
            Works.all({taskId: task.id}, function (result) {
                task.works = result.data;
                for (var i = 0; i < task.works.length; i++) {
                    task.works[i].usersHash = {};
                    if (task.works[i].acceptor_type == TYPE_DEFIN.Group) {
                        var group = vm.groups.find(function (item) {
                            return task.works[i].acceptor_id = item.id;
                        });
                        angular.forEach(group.members, function (member) {
                            task.works[i].usersHash[member.user.id] = vm.usersHash[member.user.id];
                            task.works[i].usersHash[member.user.id].scores = getWorkScores(task.works[i], vm.usersHash[member.user.id]);
                        });
                        //task.works[i].submitter =vm.usersHash[task.works[i].acceptor_id];
                    } else {
                        task.works[i].submitter = vm.usersHash[task.works[i].acceptor_id];
                        task.works[i].scores = getWorkScores(task.works[i], vm.usersHash[task.works[i].acceptor_id]);
                    }
                }
            });
        }

        function getWorkScores(work, user) {
            Scores.all({workId: work.id, userId: user.id}, function (result) {
                return result;
            });
        }

        function onProjectProducts() {
            ProjectProducts.all({
                project_id: vm.project.id
            }, function (result) {
                var products = result.data,
                    findFinal = function (product) {
                        return product.is_final;
                    };
                //vm.project.final_product = products.findOne(findFinal);
                if (vm.project.final_product) {
                    products.remove(findFinal);
                }
                vm.products = products;

                console.log(vm.products);
            });
        }

        vm.showTask(0);

        function showTask(id) {
            //for (var i=0;i<vm.project.tasks.length;i++){
            //    vm.showtask[i]=false;
            //}
            vm.showtask[id] = !vm.showtask[id];
        }

        function isgroup(id, ids) {
            return ids.has(function (item) {
                return item == id;
            })
        }

        function dateFormat(date) {
            if (date == null) {
                date = new Date();
            } else {
                date = new Date(date)
            }

            var datetime;
            datetime = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours()
            + ":" + date.getMinutes() + ":00";
            return (datetime);
        }

        function getResources(task) {
            return (vm.resources || []).find(function (resource) {
                return resource.owner_type == RESOURCE_TYPES.project.task && resource.owner_id == task.id;
            });
        }

        function getResourcesWork(work) {
            return (vm.resources || []).find(function (resource) {
                return resource.owner_type == RESOURCE_TYPES.project.work && resource.owner_id == work.id;
            });
        }

    }

})();