'use strict';

angular.module('app.shift').controller('shiftWorkListCtrl', ShiftWorkListCtrl);

function ShiftWorkListCtrl($scope, commonUtils, workRepository, shiftEditorService) {
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
                    shiftEditorService.addWork(row.entity);
                } else {
                    shiftEditorService.removeWork(row.entity);
                }
            }
        });
    };


    vm.gridOptions.columnDefs = [
        {
            field: "name",
            displayName: "Услуга",
            enableColumnMenu: false
        },
        {
            field: "unit",
            displayName: "Единица изм.",
            enableColumnMenu: false
        }
    ];

    shiftEditorService.listeners.shift.push(shiftChanged);

    initData();


    function shiftChanged(shift) {
        vm.sendEvents = false;
        commonUtils.selectEntityRows(shift ? shift.works : [], vm.gridOptions, vm.gridApi);
        vm.sendEvents = true;
    }

    function initData() {
        workRepository.getAll().success(function (data) {
            vm.gridOptions.data = data._embedded.work;
        }).error(function (data) {
            $log.log(data);
        });
    }

}

