'use strict';

angular.module('app.day').controller('DayOrdersCtrl', DayOrdersCtrl);

function DayOrdersCtrl($scope, $log, uiGridConstants, commonUtils, dayOrderService, dayService, dayEditorService, payOrderInfoService) {
    var vm = this;
    vm.round = commonUtils.round;
    vm.getStatusClass = getStatusClass;
    vm.payOrderInfoService = payOrderInfoService;

    initGridOptions();

    vm.gridOptions.data = dayEditorService.dayOrders;


    function initGridOptions() {
        vm.gridOptions = {
            data: [],
            appScopeProvider: vm,
            minRowsToShow: 15,
            showGridFooter: true,
            showColumnFooter: true,
            columnFooterHeight: 22,
            enableSorting: true,
            rowHeight: 22
        };
        vm.gridOptions.columnDefs = [];
        vm.gridOptions.columnDefs.push({
                field: "order",
                displayName: "Заказ",
                enableCellEdit: false,
                cellTemplate: "app/day/POrderNumberCell.html",
                pinnedLeft: true,
                enableColumnMenu: false,
                enableSorting: false,
                width: 200,
                sort: {
                    direction: uiGridConstants.ASC
                },
                sortingAlgorithm: function (a, b, rowA, rowB, direction) {
                    if (rowA.entity.payOrder && rowB.entity.payOrder)
                        return rowA.entity.payOrder.number > rowB.entity.payOrder.number ? 1 : -1;
                    else
                        return 0;
                }
            }
        );

        angular.forEach(dayService.works, function (work) {
            vm.gridOptions.columnDefs.push(createColumnDef(work));
        });

        vm.gridOptions.onRegisterApi = function (gridApi) {
            vm.gridApi = gridApi;

            vm.gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
                $log.log(rowEntity);
                dayOrderService.update(rowEntity);
            });
        };
    }

    function aggregationType(visibleRows, self) {
        var result = 0;
        angular.forEach(visibleRows, function (row) {
            var value = eval("row.entity." + self.colDef.editModelField);
            result += value;
        });
        result = vm.round(result, 3);
        self.rateValue = vm.round(result * self.colDef.work.rate, 3);
        return result;
    }

    function createColumnDef(work) {
        return {
            name: work.type,
            work: work,
            displayName: work.name + " (" + work.unit + ")",
            editModelField: "orderValues[" + work.index + "].value",
            cellTemplate: "<div>{{grid.appScope.round(row.entity.orderValues[" + work.index + "].value, 3)}}</div>",
            footerCellTemplate: "<div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><div> {{ col.getAggregationText() + ( col.getAggregationValue() CUSTOM_FILTERS )}}</div></div>",
            aggregationType: aggregationType,
            aggregationHideLabel: true,
            enableCellEdit: true,
            type: "number",
            enablePinning: false,
            enableColumnMenu: false,
            enableSorting: false,
            width: 90
        };
    }

    function getStatusClass(status) {
        return status == "design" ? "order-status-design" : "order-status-production";
    }
}
