define(function(require, exports, module) {
    var _ = require("underscore");
    var mvc = require("splunkjs/mvc");
    var assert = require("../chai").assert;
    var testutil = require("../testutil");
    var googlemap = require('splunkjs/mvc/googlemap');
    var mockcontext = require('../mocksearchcontext');

    var tests = {
        before: function(done) {
            var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search", {
                    type: "googlemap",
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
        
        "Googlemap tests": {
            "control elements in DOM": function(done) {
                $('#hook').append("<div id='container1' class='googlemap-wrapper'></div>");

                var map = splunkjs.mvc.Components.create("appfx-googlemap", "test-googlemap", {
                    contextid: "test-search",
                    el: $("#container1") 
                }).render();

                assert.notEqual($('#container1').children(), 0, 'map containter should have more than 1 child');
                assert.isDefined(map.map);
                assert.isNotNull(map.map);
                
                done();                
            },          
        },
        "Not yet implemented" : {

            "map manipulation": function(done) {
                done();                
            },
        }
    };
    
    return tests;
});
