define(function(require, exports, module) {
    var _ = require("underscore");
    var mvc = require("splunkjs/mvc");
    var assert = require("../chai").assert;
    var testutil = require("../testutil");
    var eventtable = require('splunkjs/mvc/eventtable/eventtable');
    var mockcontext = require('../mocksearchcontext');

    var tests = {
        before: function(done) {
            this.timeout(5000);
            var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search", {
                    type: "eventtable",
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
        
        "Eventtable tests": {
            "control elements in DOM": function(done) {
                $('#hook').append("<div id='container1'></div>");

                splunkjs.mvc.Components.create("appfx-eventtable", "test-eventtable", {
                    contextid: "test-search",
                    el: $("#container1") 
                }).render();
                
                done();                
            },          
        },
        "Not yet implemented" : {

        }
    };
    
    return tests;
});
