'use strict';

angular.module('app.order.assign', ['ui.grid', 'app.service.order'])
    .controller('AssignOrdersController', ['$scope', '$http', 'OrderService',  function ($scope, $http, OrdersService) {

        function initOrdersGrid() {
            $scope.gridOptions = {};
            $http.get('/app/orders/assign/config/columns.json')
                .success(function (data) {
                    $scope.gridOptions.columnDefs = data;
                });
            $scope.gridOptions.onRegisterApi = function (gridApi) {
                $scope.gridApi = gridApi;
            };

            OrdersService.getAll().success(function (data) {
                $scope.gridOptions.data = data._embedded.order;
            }).error(function (data) {

            });
        }
        initOrdersGrid();
    }]);
