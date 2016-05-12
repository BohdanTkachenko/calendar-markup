window.app = window.app || {};
(function () {
    'use strict';

    /**
     * Create new period.
     *
     * @constructor
     * @param {Object} params Initial params.
     * @param {Number} params.start Period start time.
     * @param {Number} params.end Period end time.
     */
    function Period(params) {
        this.setStartTime(parseInt(params.start, 10));
        this.setEndTime(parseInt(params.end, 10));
    }

    /**
     * Period start time.
     *
     * @type {Number}
     */
    Period.prototype.startTime = undefined;

    /**
     * Period end time.
     *
     * @type {Number}
     */
    Period.prototype.endTime = undefined;

    /**
     * Clone current period into the new one.
     *
     * @return {window.app.Period} New period.
     */
    Period.prototype.clone = function () {
        var period = new Period({
            start: this.getStartTime(),
            end: this.getEndTime()
        });

        return period;
    };

    /**
     * Getter for startTime field.
     *
     * @return {Number}
     */
    Period.prototype.getStartTime = function () {
        return this.startTime;
    };

    /**
     * Setter for startTime field.
     *
     * @param {Number} time New start time.
     */
    Period.prototype.setStartTime = function (time) {
        if (typeof time !== 'number') {
            throw new TypeError('time shoud be a number');
        }

        if (time < 0) {
            throw new RangeError('period cannot be started before 9 AM');
        }

        if (this.getEndTime() !== undefined && time >= this.getEndTime()) {
            throw new RangeError('period start time must be before end time');
        }


        this.startTime = time;
    };

    /**
     * Getter for endTime field.
     *
     * @return {Number}
     */
    Period.prototype.getEndTime = function () {
        return this.endTime;
    };

    /**
     * Setter for endTime field.
     *
     * @param {Number} time New end time.
     */
    Period.prototype.setEndTime = function (time) {
        if (typeof time !== 'number') {
            throw new TypeError('time shoud be a number');
        }

        if (time > 720) {
            throw new RangeError('period cannot be ended after 9 PM');
        }

        if (this.getStartTime() !== undefined && time <= this.getStartTime()) {
            throw new RangeError('period end time must be after start time');
        }

        this.endTime = time;
    };

    /**
     * Get period duration.
     *
     * Just subtracts period start time from period end time.
     *
     * @return {Number}
     */
    Period.prototype.getDuration = function () {
        return this.endTime - this.startTime;
    };

    /**
     * Check if period intersects with another one.
     *
     * @param {window.app.Period} period
     * @return {Boolean}
     */
    Period.prototype.intersectsWith = function (period) {
        if (! period instanceof Period) {
            throw new TypeError('period argument must be a Period');
        }

        if (this.getStartTime() > period.getEndTime()) {
            return false;
        }

        if (this.getEndTime() < period.getStartTime()) {
            return false;
        }

        return true;
    };

    /**
     * Check if period is not intersects with another one.
     *
     * @param {window.app.Period} period
     * @return {Boolean}
     */
    Period.prototype.notIntersectsWith = function (period) {
        return !this.intersectsWith(period);
    };

    /**
     * Find periods that are not have no intersection with current one.
     *
     * @param {window.app.Period[]} periods
     * @return {window.app.Period[]}
     */
    Period.prototype.notIntersectsWithArray = function (periods) {
        var i, result = [];

        for (i = 0; i < periods.length; i++) {
            if (!periods[i]) {
                continue;
            }

            if (this.notIntersectsWith(periods[i])) {
                result.push(periods[i]);
            }
        }

        return result;
    };

    // add Period to app namespace
    window.app.Period = Period;
})();