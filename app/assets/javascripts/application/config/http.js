(function () {
    'use strict';

    angular
        .module('app.config')
        .config(configure);

    configure.$inject = ['$httpProvider'];

    function configure($httpProvider) {

        $httpProvider.defaults.headers.common['X-CSRF-Token'] = angular.element('meta[name="csrf-token"]').attr('content');
        $httpProvider.interceptors.push(interceptors);

        interceptors.$injector = ['$q'];
        function interceptors($q){
            return {
                responseError: responseError,
                response: response
            };

            function responseError(rejection){
                switch(rejection.status){
                    case 401:
                    case 422:
                        window.location.reload();
                        break;
                    case 500:

                        break;
                }
                return $q.reject(rejection);
            }

            function response(response){
                /*if(response.data){
                    switch(response.data.code){
                        case 401:
                        case 422:
                            window.location.reload();
                            break;
                    }
                }*/
                return response || $q.when(response);
            }
        }

    }
})();