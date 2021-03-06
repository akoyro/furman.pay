'use strict';

angular.module('app.shift').controller('shiftEmployeeListCtrl', ShiftEmployeeListCtrl);

function ShiftEmployeeListCtrl($scope, $log, commonUtils, employeeRepository, shiftEditorService) {
    var vm = this;
    vm.sendEvents = true;
    vm.gridOptions = {
        data: []
    };

    vm.gridOptions.onRegisterApi = function (gridApi) {
        vm.gridApi = gridApi;
        vm.gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            if (vm.sendEvents) {
                if (row.isSelected) {
                    shiftEditorService.addEmployee(row.entity);
                } else {
                    shiftEditorService.removeEmployee(row.entity);
                }
            }
        });
    };


    vm.gridOptions.columnDefs = [
        {
            field: "name",
            displayName: "Имя",
            enableColumnMenu: false
        },
        {
            field: "lastName",
            displayName: "Фамилия",
            enableColumnMenu: false
        }
    ];

    shiftEditorService.listeners.shift.push(shiftChanged);

    initData();

    function shiftChanged(shift) {
        vm.sendEvents = false;
        commonUtils.selectEntityRows(shift ? shift.employees : [], vm.gridOptions, vm.gridApi);
        vm.sendEvents = true;
    }

    function initData() {
        employeeRepository.getAllVisible().$promise.then(function (data) {
            vm.gridOptions.data = data._embedded.employee;
        }, function (data) {
            $log.log(data);
        });
    }
}
