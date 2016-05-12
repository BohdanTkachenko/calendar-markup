window.app = window.app || {};
(function () {
    'use strict';

    /**
     * Create new Calendar.
     *
     * @param {HTMLElement} renderTo DOM element that calendar events will be rendered to.
     */
    function Calendar(renderTo) {
        this.renderTo = renderTo;
    }

    /**
     * Calendar events.
     *
     * @type {Period[]}
     */
    Calendar.prototype.events = [];

    /**
     * DOM element that calendar events will be rendered to.
     *
     * @type {HTMLElement}
     */
    Calendar.prototype.renderTo = undefined;

    /**
     * Clear calendar from events.
     */
    Calendar.prototype.clear = function () {
        this.events = [];
        this.renderTo.innerHTML = '';
    };

    /**
     * Set data and render events.
     *
     * @param {Object[]} data
     * @param {Number} data.start Event start time.
     * @param {Number} data.end Event end time.
     */
    Calendar.prototype.setData = function (data) {
        var i;

        this.clear();

        for (i = 0; i < data.length; i++) {
            this.events.push(new window.app.Period(data[i]));
        }

        this.doLayout();
    };

    /**
     * Add one single event to DOM.
     *
     * @param {window.app.Period} event Event to render.
     * @param {Number} columnsCount Total count of events that will be rendered on the same level.
     * @param {Number} column Horizontal position to render event.
     */
    Calendar.prototype.renderItem = function (event, columnsCount, column) {
        var
            width, style,
            itemDiv, borderDiv, contentDiv;

        // determine width of event element
        width = 600 / columnsCount;

        // simply generate style string
        style = [
            'width: ' + width + 'px',
            'height: ' + event.getDuration() + 'px',
            'top: ' + event.getStartTime() + 'px',
            'left: ' + (10 + (width * column)) + 'px'
        ].join('; ');

        // add element to DOM

        itemDiv = document.createElement('div');
        itemDiv.setAttribute('class', 'item');
        itemDiv.setAttribute('style', style);

        borderDiv = document.createElement('div');
        borderDiv.setAttribute('class', 'border');

        contentDiv = document.createElement('div');
        contentDiv.setAttribute('class', 'content');
        contentDiv.setAttribute('style', 'width: ' + (width-5   ) + 'px;');
        contentDiv.innerHTML = '<h3>Sample Item</h3><h4>Sample Location</h4>';

        itemDiv.appendChild(borderDiv);
        itemDiv.appendChild(contentDiv);

        this.renderTo.appendChild(itemDiv);
    };

    /**
     * Put events as DOM elements to page.
     */
    Calendar.prototype.doLayout = function () {
        var i, j, pockets;

        pockets = byPockets(this.events);

        for (i = 0; i < pockets.length; i++) {
            for (j = 0; j < pockets[i].length; j++) {
                if (!pockets[i][j]) {
                    continue;
                }

                this.renderItem(pockets[i][j], pockets[i].length, j);
            }
        }

        /**
         * Group events by intersection.
         *
         * So all events that intersect width each other will be in
         * one group (pocket).
         *
         * @param {window.app.Period[]} events Events that should be grouped.
         * @return {Array} Two-demensional array of pockets and periods in every pocket.
         */
        function byPockets(events) {
            var
                pockets = [],
                pocket,
                period,
                i,
                pocketPushFn;

            pocketPushFn = function (pocket) {
                if (pocket) {
                    pockets.push(pocket);
                }
            };

            if (events.length === 0) {
                return [];
            }

            if (events.length === 1) {
                return [ events ];
            }

            pocket = [ events[0] ];

            // create initial period for pocket
            period = events[0].clone();

            for (i = 1; i < events.length; i++) {
                if (!events[i].intersectsWith(period)) {
                    fixPocket(pocket).forEach(pocketPushFn);

                    pocket = [];

                    // create new period for pocket
                    period = events[i].clone();
                } else {
                    // make period bigger to include periods of all events in pocket

                    if (events[i].getStartTime() < period.getStartTime()) {
                        period.setStartTime(events[i].getStartTime());
                    }

                    if (events[i].getEndTime() > period.getEndTime()) {
                        period.setEndTime(events[i].getEndTime());
                    }
                }

                pocket.push(events[i]);
            }

            if (pocket.length > 0) {
                fixPocket(pocket).forEach(pocketPushFn);
            }

            return pockets;
        }

        function fixPocket(pocket) {
            var
                period, notIntersected,
                atLeastOneIntersection = false,
                result = [ [], [] ];

            if (pocket.length === 1) {
                return [ pocket ];
            }

            while (pocket.length > 0) {
                period = pocket.shift();

                if (period === undefined) {
                    continue;
                }

                result[0].push(period);
                notIntersected = period.notIntersectsWithArray(pocket);

                if (notIntersected.length > 0) {
                    delete pocket[pocket.indexOf(notIntersected[0])];

                    atLeastOneIntersection = true;
                    result[1].push(notIntersected[0]);
                } else {
                    result[1].push(undefined);
                }
            }

            if (!atLeastOneIntersection) {
                result = [ result[0] ];
            }

            return result;
        }
    };

    // add Calendar to window.app namespace
    window.app.Calendar = Calendar;
})();
