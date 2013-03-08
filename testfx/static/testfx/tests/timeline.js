define(function(require, exports, module) {
    var _ = require("underscore");
    var mvc = require("splunkjs/mvc");
    var assert = require("../chai").assert;
    var testutil = require("../testutil");
    var timeline = require('splunkjs/mvc/timeline');
    var mockcontext = require('../mocksearchcontext');

    var tests = {
        before: function(done) {
            var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search", {
                    type: "timeline",
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
        
        "Timeline tests": {
            "control elements in DOM": function(done) {

                $('#hook').append("<div id='container1'></div>");

                splunkjs.mvc.Components.create("appfx-timeline", "test-timeline", {
                    contextid: "test-search",
                    el: $("#container1") 
                }).render();

                _.delay(function(){
                    assert.lengthOf($('#container1 .timeline-wrapper'), 1);
                    assert.lengthOf($('#container1 .timeline-controls'), 1);
                    assert.lengthOf($('#container1 .timeline-container'), 1);
                    assert.lengthOf($('#container1 .timeline-container canvas'), 10);
                    
                    done();            
                }, 40);    
            },         
        },
        "Not yet implemented" : {
            // add tests for zoom to selection
            // add tests for zoom out
            // add tests for deselect 
        }
    };
    
    return tests;
});
