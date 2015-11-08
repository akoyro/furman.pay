'use strict';

angular.module('app.service').service('currentDayService', CurrentDayService);

function CurrentDayService(dayOrderService, dayShiftService) {
    var service = {};
    var listeners = [];

    service.day = null;
    service.changeDay = changeDay;
    service.addListener = addListener;
    service.getDate = getDate;
    service.dateOf = dateOf;
    service.dayOrders = [];
    service.dayShifts = [];

    function changeDay(newDay) {
        service.day = newDay;
        dayOrderService.findAllForDay(newDay).then(function (data) {
            service.dayOrders = data.data;
        });
        dayShiftService.findAllForDay(newDay).then(function (data) {
            service.dayShifts = data.data;
        });
        listeners.forEach(function (l) {
            l(newDay);
        });
    }

    function getDate() {
        return dateOf(service.day.date);
    }

    function dateOf(date) {
        return moment({year: date[0], month: date[1] - 1, day: date[2]}).toDate();
    }


    function addListener(listener) {
        listeners.push(listener);
    }

    return service;
}

