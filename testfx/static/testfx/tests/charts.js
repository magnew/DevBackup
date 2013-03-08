define(function(require, exports, module) {
    var _ = require("underscore");
    var mvc = require("splunkjs/mvc");
    var assert = require("../chai").assert;
    var testutil = require("../testutil");
    var chart = require('splunkjs/mvc/chart');
    var mockcontext = require('../mocksearchcontext');

    var tests = {
        before: function(done) {
            var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search", {
                    type: "chart",
                    preview: "True",
                    status_buckets: 300
            }).start();
            context.on("search:done", function(e){
                done();
            });
        },
        
        beforeEach: function(done) {
            done();
        },
        
        after: function(done) {
            done();
        },
        
        afterEach: function(done) {
            done();
        },
        
        "Charts tests": {
            "control elements in DOM": function(done) {
                $('#hook').append("<div id='container1' class='chart-wrapper'></div>");

                splunkjs.mvc.Components.create("appfx-chart", "test-chart", {
                    contextid: "test-search",
                    el: $("#container1") 
                }).render();
                
                _.delay(function(){
                    assert.lengthOf($('#container1 .highcharts-container'), 1);
                    done(); 
                }, 200);       
            },  
            "setting type changes chart type": function(done) {
                $('#hook').append("<div id='container2' class='chart-wrapper'></div>");

                splunkjs.mvc.Components.create("appfx-chart", "test-chart2", {
                    contextid: "test-search",
                    type : "bar",
                    el: $("#container2") 
                }).render();
                
                _.delay(function(){
                    assert.lengthOf($('#container2 .bar-chart'), 1);
                    done(); 
                }, 200);                   
            },   
            "clicked:chart events fired properly": function(done) {
                $('#hook').append("<div id='container3' class='chart-wrapper'></div>");

                var chart = splunkjs.mvc.Components.create("appfx-chart", "test-chart3", {
                    contextid: "test-search",
                    el: $("#container3") 
                }).render();
                
                chart.on("clicked:chart", function(){
                    console.log("BOOYAH");
                    done();
                });

                _.delay(function(){
                    var el = $('#container3 .highcharts-tracker path')[3];
                    console.log(el);
                    $($('#container3 .highcharts-tracker path')[3]).click();
                }, 200);                   
            },       
        },
        "Not yet implemented" : {

            "clicked:legend events fired properly": function(done) {
                
                done();                
            },
        }
    };
    
    return tests;
});
