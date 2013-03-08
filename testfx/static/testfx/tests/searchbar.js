define(function(require, exports, module) {
    var _ = require("underscore");
    var mvc = require("splunkjs/mvc");
    var assert = require("../chai").assert;
    var testutil = require("../testutil");
    var searchbar = require('splunkjs/mvc/searchbar');
    var mockcontext = require('../mocksearchcontext');

    var tests = {
        before: function(done) {
            var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search", {
                    type: "searchbar",
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
        
        "Search bar tests": {          
            "control elements in DOM": function(done) {
                $('#hook').append("<div id='container1'></div>");
                var single = splunkjs.mvc.Components.create("appfx-searchbar", "test-searchbar", {
                    contextid: "test-search",
                    timepicker: true,
                    el: $("#container1") 
                }).render();
                
                assert.lengthOf($('#container1 .search-bar-wrapper'), 1, 'wrapper failure');
                assert.lengthOf($('#container1 .search-form'), 1, 'form failure');
                assert.lengthOf($('#container1 .search-bar'), 1, 'search bar failure');
                assert.lengthOf($('#container1 .search-input'), 1, 'input area failure');
                assert.lengthOf($('#container1 .search-timerange'), 2, 'timerange failure');
                assert.lengthOf($('#container1 .search-button'), 1, 'search button failure');

                done();                
            },

            "search string appears properly": function(done) {
                $('#hook').append("<div id='container2'></div>");
                splunkjs.mvc.Components.create("appfx-searchbar", "test-searchbar2", {
                    contextid: "test-search",
                    el: $("#container2") 
                }).render();

               _.delay(function(){
                    var htmlString = $('#container2 .search-input .inner textarea')[0].value;
                    var modelString = splunkjs.mvc.Components.getInstance("test-search").query.get("search");
                    assert.equal(htmlString, modelString, 'model search string and html display are equal');
                    done();            
                }, 20);               
            },
            
            "setting timepicker to false removes timepicker": function(done) {
                $('#hook').append("<div id='container3'></div>");
                var searchbar = splunkjs.mvc.Components.create("appfx-searchbar", "test-searchbar3", {
                    timepicker: true,
                    contextid: "test-search",
                    el: $("#container3") 
                }).render();

                assert.equal($('#container3 .search-timerange')[0].children.length, 1);

                searchbar.settings.set('timepicker', false);

                _.delay(function(){
                    assert.equal($('#container3 .search-timerange')[0].children.length, 0);  
                    done();            
                }, 20);
            },

            "executing search changes context": function(done) {
                var newSearchString = "index=_internal | head 10";

                $('#hook').append("<div id='container4'></div>");
                var searchbar = splunkjs.mvc.Components.create("appfx-searchbar", "test-searchbar4", {
                    timepicker: true,
                    contextid: "test-search4",
                    el: $("#container4") 
                }).render();
                var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search4", {
                    type: "searchbar",
                    preview: "True",
                    status_buckets: 300
                }).start();
                
                context.on("search:done", function(e){

                    //change the search string and click the button
                    $('#container4 .search-input .inner textarea')[0].value=newSearchString;
                    $('#container4 .search-button button').click();
                    
                    //check that the context was changed. 
                    //We have to prepend 'search' because the searchbar does
                    assert.equal("search " +newSearchString, context.query.get("search"));
                    
                    done();
                });
            },
        },
        "Not yet implemented":{
            // ensure "search" prepending logic is correct?
            
        }
    };
    
    return tests;
});
