/* TIMESERIES - A simple D3.js timeseries.
*   call timeseries(<classd>, <data>, <enableBrush>) with the following parameters
*   classd - the class name of your container div for the timeseries to attach to
*   enableBrush - whether to enable the brush
*/

import * as _ from 'lodash';
import moment from 'moment';
import * as d3 from 'd3';

var timeseries = function(spaced, data, enableBrush) {
    render(spaced, data, enableBrush);
}

// ---------------------------------------------------------------------------------------------
// ---------------------------------- Time Manipulation ----------------------------------------
// ---------------------------------------------------------------------------------------------

function lessThanDay(d) {
    return (d === "hours" || d === "minutes" || d === "seconds") ? true : false;
}

function getDate(d) {
    var date = moment(d);
    date.hour(1);
    date.minute(0);
    date.second(0);
    return date.valueOf();
}

function getTime(d) {
    var date = moment(d);
    date.date(1);
    date.month(0);
    date.year(2012);
    return date.valueOf();
}

/* 
  Given a list of time stamps, compute the minimum and maxium dates. Return a padded
  version of the min and max dates based on the temporal distance between them.
*/
function timeRangePad(dates) {
    var minDate, maxDate, pad;
    if (dates.length > 1) {
        minDate = moment(_.min(dates));
        maxDate = moment(_.max(dates));
        pad = getDatePadding(minDate, maxDate);
        minDate.subtract(1, pad);
        maxDate.add(1, pad);
    } else {
        minDate = moment(dates[0]).subtract(1, 'hour');
        maxDate = moment(dates[0]).add(1, 'hour');
    }
    return {
        'minDate': minDate,
        'maxDate': maxDate,
        'pad': pad
    };
};

function getDatePadding(minDate, maxDate) {
    if (maxDate.diff(minDate, 'years') > 0)
        return 'months';
    else if (maxDate.diff(minDate, 'months') > 0)
        return 'days';
    else if (maxDate.diff(minDate, 'days') > 0)
        return 'days';
    else if (maxDate.diff(minDate, 'hours') > 0)
        return 'hours';
    else if (maxDate.diff(minDate, 'minutes') > 0)
        return 'minutes';
    else
        return 'seconds';
}

// ---------------------------------------------------------------------------------------------
// ------------------------------------- Rendering ---------------------------------------------
// ---------------------------------------------------------------------------------------------

function render(spaced, data, enableBrush) {

    var padding = timeRangePad(_.map(data, 'value'));

    var margin = {
        top: 10,
        right: 25,
        bottom: 15,
        left: 35
    }
    var width = +getComputedStyle(document.querySelector(`.${spaced}`)).width.slice(0, -2);
    // var height = (lessThanDay(padding.pad)) ? (100 - margin.top - margin.bottom) : (300 - margin.top - margin.bottom);
    var height = +getComputedStyle(document.querySelector(`.${spaced}`)).height.slice(0, -2);

    var x = d3.scaleLinear().range([0 + margin.left, width - margin.right]),
        y = d3.scaleLinear()
        .range([margin.top, height - margin.bottom]);

    var ticks = width > 800 ? 8 : 4;


    x.domain(d3.extent([padding.minDate, padding.maxDate]));


    var xFormat, yFormat;
    if (lessThanDay(padding.pad)) {
        xFormat = "%H:%M";
        yFormat = "%m/%d/%y";
        y.domain(d3.extent([padding.minDate]));
    } else {
        xFormat = "%m/%d/%y";
        yFormat = "%H:%M";
        var start = new Date(2012, 0, 1, 0, 0, 0, 0).getTime();
        var stop = new Date(2012, 0, 1, 23, 59, 59, 59).getTime();
        y.domain(d3.extent([start, stop]));
    }

    console.warn(width, height, x.domain(), x.range(), y.domain(), y.range())


    var xAxis = d3.axisBottom(x)
        .ticks(ticks)
        .tickSize(-height, 0)
        .tickFormat(d3.timeParse(xFormat));

    var yAxis = d3.axisLeft(y)
        .ticks(5)
        .tickSize(-width + margin.right, margin.left)
        .tickFormat(d3.timeParse(yFormat));

    var svg = d3.select("." + spaced).append("svg")
        .attr("width", width)
        .attr("height", height);

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    context.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + margin.left + "," + ((height - margin.bottom)) + ")")
        .call(xAxis);

    context.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(yAxis);

    var circles = context.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    circles.selectAll(".circ")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "circ")
        .attr("cx", function(d) {
            return (lessThanDay(padding.pad)) ? x(d.value) : x(getDate(d.value));
        })
        .attr("cy", function(d, i) {
            return (lessThanDay(padding.pad)) ? y(getDate(d.value)) : y(getTime(d.value));
        })
        .attr("r", 9)
        .on("click", function(d) {
            console.log(new Date(d.value));
        })

    // ----------------------------------------- Brush ---------------------------------------------

    if (enableBrush) {
        var brush = d3.brushX()
            .on("brush", _.throttle(brushed, 200));

        circles.append("g")
            .attr("class", "brush")
            .call(brush)
            .selectAll("rect")
            .attr("y", -6)
            .attr("height", height - margin.bottom);

        var brushEl = '<div class="brush-control"><div class="brush-info"><i>Click and drag on the timeseries to create a brush.</i></div><button class="clear-brush">Clear brush</button></div>';
        window.document.getElementsByClassName(spaced)[0].insertAdjacentHTML('beforeend', brushEl);

        function brushed() {
            if (!d3.event) return; // Only transition after input.
            if (!d3.event.selection) return; // Ignore empty selections.
            var d0 = d3.event.selection.map(x.invert),
                d1 = d0.map(d3.timeDay.round);
                console.warn(d0, d1);

        }

        d3.select('.clear-brush').on("click", function(d) {
            if (!brush.empty()) {
                d3.selectAll("g.brush").call(brush.clear());
                d3.select('.brush-info')[0][0].innerText = "";
                d3.select('.clear-brush').style("display", "none");
            }
            var d0 = d3.event.selection.map(x.invert),
            d1 = d0.map(d3.timeDay.round);
            console.warn(d0, d1);
        })

        timeseries.getBrushExtent = function() {
            if (brush)
                return brush.extent();
        }
    }
}

/* Use this function, in conjunction to setting a time element to 'selected', to highlight the 
data point on the timeseries. */
function redraw() {
    d3.selectAll(".circ")
        .transition(10)
        .style("opacity", function(d) {
            return d.selected ? 1 : 0.6;
        })
        .attr("r", function(d) {
            return d.selected ? 15 : 7;
        });
}

export default timeseries;
