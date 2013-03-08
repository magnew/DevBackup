define(function(require, exports, module) {
    var _ = require("underscore");
    var mvc = require("splunkjs/mvc");
    var assert = require("../chai").assert;
    var testutil = require("../testutil");
    var resulttable = require('splunkjs/mvc/resulttable');
    var searchcontext = require('splunkjs/mvc/searchcontext');
    var mockcontext = require('../mocksearchcontext');

    var testOutput$ = $("#hook");

    var tests = {
        before: function(done) {
            var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search", {
                    type: "resulttable",
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
        
        "Result table tests": {          
            "control elements in DOM when no context present": function(done) {
               $('#hook').append("<div id='container1'></div>");
               //utils.createUniqueDiv(testOutput$, "container1", this.test.title);

                splunkjs.mvc.Components.create("appfx-resulttable", "test-resulttable", {
                    contextid: "fake-search",
                    el: $("#container1") 
                }).render();

                //check for head and body
                assert.lengthOf($('#container1 .table thead'), 1);
                assert.lengthOf($('#container1 .table tbody'), 1);

                _.delay(function(){
                    //check there are no columns or rows
                    assert.lengthOf($('#container1 .table thead th'), 0, 'not expecting table columns' );
                    // TODO
                    assert.lengthOf($('#container1 .table tbody tr'), 0, 'not expecting table rows' );
                    done();
                }, 40);                 
            }, 
            "column and row elements in DOM when valid search is bound": function(done) {
               $('#hook').append("<div id='container2'></div>");

                splunkjs.mvc.Components.create("appfx-resulttable", "test-resulttable2", {
                    contextid: "test-search",
                    el: $("#container2") 
                }).render();

                _.delay(function(){
                    //check that there are valid rows
                    assert($('#container2 .table thead th').length > 1, 'expected more than 1 column in table' );
                    assert($('#container2 .table tbody tr').length > 1, 'expected more than 1 row in table' );

                    // TODO: Check some header cell
                    // TODO: Check some row cell

                    done();
                }, 40);                 
            },            
            "setting fields works": function(done) {
                var fields = ["artist_name", "_time"];

                $('#hook').append("<div id='container3'></div>");
                var table = splunkjs.mvc.Components.create("appfx-resulttable", "test-resulttable3", {
                    contextid: "test-search",
                    fields: fields,
                    el: $("#container3") 
                }).render();
                
                //check number of fields is as expected in model
                assert.equal(table.settings.get('fields').length, fields.length);
                assert.equal(table.settings.get('fields')[0], fields[0]);

                _.delay(function(){
                    //check number of fields is as expected in DOM
                    assert.equal($('#container3 .table thead tr').children().length, fields.length+1, 'html not right');

                    // TODO: Check some header cell
                    // TODO: Check some row cell
                    done();
                }, 20); 
            },
            "row click event fires right": function(done) {
                $('#hook').append("<div id='container4'></div>");
                var table = splunkjs.mvc.Components.create("appfx-resulttable", "test-resulttable4", {
                    pageSize : 3,
                    contextid: "test-search4",
                    el: $("#container4") 
                }).render();
                var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search4", {
                    type: "resulttable",
                    search: "| inputlookup testdata.csv | head 100",
                }).start();

                table.on("clicked:row", function(e){
                    // TODO: check arguments of e
                    done(); 
                });

                context.on("search:done", function(e){
                    $('#container4 table tbody tr')[0].click();                       
                });          
            },
            "cell click event fires right": function(done) {
                 $('#hook').append("<div id='container5'></div>");
                var table = splunkjs.mvc.Components.create("appfx-resulttable", "test-resulttable5", {
                    pageSize : 3,
                    contextid: "test-search5",
                    el: $("#container5") 
                }).render();
                var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search5", {
                    type: "resulttable",
                    search: "| inputlookup testdata.csv | head 100",
                }).start();

                table.on("clicked:cell", function(e){
                    // Check values of e
                    done();
                });

                context.on("search:done", function(e){
                    //click cell [1] to get events on actual data cell
                    $('#container5 table tbody tr td')[1].click();
                });                   
            },

            "check itemCount equals datasource results": function(done) {

                $('#hook').append("<div id='container7'></div>");
                var table = splunkjs.mvc.Components.create("appfx-resulttable", "test-resulttable7", {
                    contextid: "test-search7",
                    el: $("#container7") 
                }).render();
                var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search7", {
                    type: "resulttable"
                }).start();
                context.on("search:done", function(e){
                    _.delay(function(){

                        assert.equal($('#container7 table tbody tr').length, table.settings.get('itemCount'));

                        assert.equal(table.datasource.data().rows.length, table.settings.get('itemCount'));
                        done();
                    }, 20);
                });                           
            },

            "setting pageSize works": function(done) {
                var pageSize = 2;

                $('#hook').append("<div id='container6'></div>");
                var table = splunkjs.mvc.Components.create("appfx-resulttable", "test-resulttable6", {
                    pageSize : pageSize,
                    contextid: "test-search6",
                    el: $("#container6") 
                }).render();
                var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search6", {
                    type: "resulttable",
                    search: "search index=_internal | head 10"
                }).start();

                context.on("search:done", function(e){
                    _.delay(function(){
                        //check pagesize is right in model
                        assert.equal(table.datasource.data().rows.length, pageSize);

                        //check pagesize in DOM
                        assert.equal($('#container6 table tbody tr').length, pageSize);

                        done();
                    }, 20);
                });    
            },
        },
        "Not yet implemented":{
            "check setting page": function(done) {
                done();                
            },
            // paginator
            // custom row renderer
            // custom cell formatters
            // custom header renderer
            // custom datasource name
            // change context instance
        }
    };
    
    return tests;
});
