define(function(require, exports, module) {
    var _ = require("underscore");
    var mvc = require("splunkjs/mvc");
    var d3chart = require('splunkjs/mvc/d3chart/d3chart');
    var mockcontext = require('../mocksearchcontext');

    var tests = {
        before: function(done) {
            var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search", {
                    search: "| inputlookup testdata.csv | head 100",
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
        
        "D3 tests": {
            "control elements in DOM": function(done) {
                $('#hook').append("<div id='container1' class='d3chart-wrapper'></div>");

               

                
                done();                
            },          
        },
        "Not yet implemented" : {

            "click events fired properly": function(done) {
                //need to know how to do this programatically
                done();                
            },
        }
    };
    
    return tests;
});
