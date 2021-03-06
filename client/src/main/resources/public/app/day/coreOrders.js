'use strict';

angular.module('app.day').controller('coreOrdersCtrl', CoreOrdersCtrl);

function CoreOrdersCtrl($scope, $http, $filter, $timeout, $log, commonUtils, orderRepository, dayService, dayEditorService) {
    var vm = this;
    var dataLoading = false;
    vm.moment = momentFrom;
    vm.collapsed = dayEditorService.dayOrders.length > 0;
    vm.getStatusClass = getStatusClass;
    vm.openCoreOrderDetails = openCoreOrderDetails;
    vm.search = {
        orderNumber: null
    };
    vm.searchOrders = searchOrders;

    initOrderDate();

    initOrderGrid();

    function momentFrom(localDate) {
        return moment(new Date(localDate[0], localDate[1] - 1, localDate[2]));
    }

    function initOrderDate() {
        vm.orderDate = {
            date: dayEditorService.getDate(),
            opened: false,
            format: 'dd-MM-yyyy',
            open: function ($event) {
                vm.orderDate.opened = true;
            },
            disabled: function (date, mode) {
                return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            },
            getDayClass: function (date, mode) {
                return $filter('filter')(vm.orderDate.orderCountsPerDay, {date: moment(date).format("YYYY-MM-DD")}).length ? "has-orders" : "";
            },
            options: {
                formatYear: 'yy',
                startingDay: 1
            }
        };

        dayService.getClosestWorkingDate().then(function (data) {
            vm.orderDate.date = dayEditorService.dateOf(data.data);
            loadData();
        });


        dayService.getOrderCountsPerDay().success(function (data) {
            vm.orderDate.orderCountsPerDay = data;
        }).error(function (data) {
            $log.log(data);
        });

        vm.dateChanged = function () {
            loadData();
        };
    }

    function initOrderGrid() {
        vm.gridOptions = {
            data: [],
            appScopeProvider: vm
        };

        vm.gridOptions.columnDefs = [
            {
                field: "orderNumber",
                displayName: "Номер",
                enableColumnMenu: false,
                cellTemplate: "app/day/COrderNumberCell.html",
                width: "50%",
            },
            {
                field: "createdDailySheet.date",
                displayName: "Дата",
                enableColumnMenu: false,
                cellTemplate: "<div>{{grid.appScope.moment(row.entity.createdDailySheet.date).toDate() | date:'yyyy-MM-dd'}}</div>",
                width: "22%"
            },
            {
                field: "name",
                displayName: "Название",
                enableColumnMenu: false,
                cellTemplate: "<div>{{row.entity.name}}</div>",
                width: "25%"
            }
        ];

        vm.gridOptions.onRegisterApi = function (gridApi) {
            vm.gridApi = gridApi;
            commonUtils.registerRowSelection($scope, gridApi, rowSelectionChanged);
        };
    }

    function rowSelectionChanged(row) {
        if (dataLoading) {
            return;
        }
        if (row.isSelected) {
            dayEditorService.selectCoreOrder(row.entity);
        } else {
            dayEditorService.deselectCoreOrder(row.entity);
        }
    }

    function updateSelection() {
        dataLoading = true;
        $timeout(function () {
            angular.forEach(vm.gridOptions.data, function (order) {
                var dayOrder = dayEditorService.getDayOrderByCoreOrderId(order.id);
                if (dayOrder) {
                    vm.gridApi.selection.selectRow(order);
                }
            });
            dataLoading = false;
        });
    }

    function loadData() {
        dataLoading = true;
        dayService.getOrders(vm.orderDate.date).success(function (data) {
            vm.gridOptions.data = data;
            updateSelection();
        }).error(function (data) {
            $log.log(data);
            dataLoading = false;
        });
    }

    function getStatusClass(status) {
        return status == "design" ? "order-status-design" : "order-status-production";
    }

    function openCoreOrderDetails(entity) {
        $log.log(entity);
    }

    function searchOrders() {
        dataLoading = true;
        orderRepository.getAllBy({orderNumber: vm.search.orderNumber}, function (data) {
            vm.gridOptions.data = data._embedded.order;
            updateSelection();
            dataLoading = false;
        }, function (data) {
            $log.log(data)
        })
    }
}
