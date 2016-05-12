window.app = window.app || {};

window.app.defaultData = [
    { start: 30, end: 150 },
    { start: 540, end: 600 },
    { start: 560, end: 620 },
    { start: 610, end: 670 }
];

window.app.init = function () {
    'use strict';

    // create new calendar
    var cal = new window.app.Calendar(document.getElementById('calendar'));

    // set default data
    cal.setData(window.app.defaultData);

    // make a global function for window.app.Calendar.setData
    window.layOutDay = function () {
        cal.setData.apply(cal, arguments);
    };
};