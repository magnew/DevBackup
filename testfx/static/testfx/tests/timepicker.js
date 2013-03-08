define(function(require, exports, module) {
    var _ = require("underscore");
    var mvc = require("splunkjs/mvc");
    var assert = require("../chai").assert;
    var testutil = require("../testutil");
    var timepicker = require('splunkjs/mvc/timepicker');
    var mockcontext = require('../mocksearchcontext');

    var tests = {
        before: function(done) {
            var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search", {
                    type: "timepicker",
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
        
        "Timepicker tests": {
            "control elements in DOM": function(done) {
                $('#hook').append("<div id='container1'></div>");

                splunkjs.mvc.Components.create("appfx-timepicker", "test-timepicker", {
                    contextid: "test-search",
                    el: $("#container1") 
                }).render();

                assert.lengthOf($('#container1 .search-timerange'), 1);
                assert.lengthOf($('#container1 .btn-primary'), 1);
                assert.lengthOf($('#container1 .dropdown-menu'), 3); //there should be 3
                // TODO: check to make sure at least one preset is there, with the right data- values.

                done();                
            },
            "proper default text": function(done) {
                $('#hook').append("<div id='container2'></div>");

                splunkjs.mvc.Components.create("appfx-timepicker", "test-timepicker2", {
                    contextid: "test-search",
                    el: $("#container2") 
                }).render();
                
                assert.include($('#container2 .search-timerange .btn').text(), "All Time");
                done();                
            },
            "setting preset sets text properly": function(done) {
                $('#hook').append("<div id='container3'></div>");

                splunkjs.mvc.Components.create("appfx-timepicker", "test-timepicker3", {
                    contextid: "test-search",
                    preset: "week",
                    el: $("#container3") 
                }).render();
                assert.include($('#container3 .search-timerange .btn').text(), "Week to date");
                done();                
            }, 
            "setting preset changes bound search timerange": function(done) {
                $('#hook').append("<div id='container4'></div>");
                splunkjs.mvc.Components.create("appfx-timepicker", "test-timepicker4", {
                    contextid: "test-search4",
                    preset: "week",
                    el: $("#container4") 
                }).render();
                
                var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search4", {
                    type : "timepicker",
                }).start();

                assert.equal(context.search.get("earliest_time"), "@w0");
                assert.equal(context.search.get("latest_time"), "now");

                done();                
            },  
            "changing selection changes text and search context": function(done) {
                $('#hook').append("<div id='container5'></div>");
                splunkjs.mvc.Components.create("appfx-timepicker", "test-timepicker5", {
                    contextid: "test-search5",
                    preset: "week",
                    el: $("#container5") 
                }).render();
                
                var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search5", {
                    type : "timepicker",
                }).start();
                context.on("search:done", function(e){
                    $('#container5 .btn-group [data-preset=ht-15m]').click();

                    assert.include($('#container5 .search-timerange .btn').text(), "Last 15 minutes", "button text correct");

                    assert.equal(context.search.get("earliest_time"), "-15m@m", "search updated");
                    assert.equal(context.search.get("latest_time"), "now", "search updated");
                    done();
                });
            },  
            "dropdown renders properly": function(done) {
                $('#hook').append("<div id='container6'></div>");
                splunkjs.mvc.Components.create("appfx-timepicker", "test-timepicker6", {
                    contextid: "test-search6",
                    preset: "week",
                    el: $("#container6") 
                }).render();
                
                var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search6", {
                    type : "timepicker",
                }).start();
                context.on("search:done", function(e){
                    $('#container6 .search-timerange .btn').click();
                    
                    assert($('#container6 .search-timerange .dropdown-menu').css('display') === 'block', "dropdown renders");
                    done();  
                });
            },           
        },
        "Not yet implemented" : {
             // add some test with searchbar
        }
    };
    
    return tests;
});
