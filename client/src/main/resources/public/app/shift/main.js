'use strict';


angular.module('app.shift').controller('dayShiftsCtrl', DayShiftsCtrl);

angular.module('app.shift').directive('shiftItem', ShiftItemDirective);

function DayShiftsCtrl($scope, $log, $timeout, currentDayService, shiftEditorService, shiftRepository) {
    var vm = this;
    vm.dayDate = currentDayService.getDate();
    vm.dayShifts = currentDayService.dayShifts;
    vm.isActive = isActive;
    vm.select = shiftEditorService.setShift;
    vm.remove = remove;
    vm.addNew = addNew;

    $timeout(function () {
        if (shiftEditorService.shift) {
            shiftEditorService.refreshView();
        } else {
            initSelected();
        }
    });

    function addNew() {
        var shift = create();
        shiftEditorService.setShift(shift);
    }

    function initSelected() {
        if (currentDayService.dayShifts.length > 0) {
            shiftEditorService.setShift(currentDayService.dayShifts[0]);
        } else {
            shiftEditorService.setShift(create());
        }
    }

    function isActive(shift) {
        return (shiftEditorService.shift && shiftEditorService.shift.id == shift.id);
    }

    function create() {
        return {
            name: "Смена " + (currentDayService.dayShifts.length + 1),
            day: currentDayService.day,
            employees: [],
            works: [],
            orders: []
        }
    }

    function remove(shift) {
        currentDayService.dayShifts.splice(currentDayService.dayShifts.indexOf(shift), 1);
        initSelected();
        shiftRepository.remove({
            id: shift.id
        });
    }

    $scope.$on("$destroy", function () {
        shiftEditorService.listeners.clean();
    });

}


function ShiftItemDirective() {
    var directive = {};
    directive.restrict = 'E';
    directive.scope = {
        shift: '=shift',
        active: '=active',
        select: '=select',
        remove: '=remove'
    };
    directive.templateUrl = 'app/shift/ShiftItem.html';
    return directive;
}