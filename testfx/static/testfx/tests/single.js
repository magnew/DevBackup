define(function(require, exports, module) {
    var _ = require("underscore");
    var mvc = require("splunkjs/mvc");
    var assert = require("../chai").assert;
    var testutil = require("../testutil");
    var single = require('splunkjs/mvc/single');
    var mockcontext = require('../mocksearchcontext');

    var BEFORE = 'before';
    var AFTER = 'after';
    
    var tests = {
        before: function(done) {
            $('#hook').append("<div id='container1'></div>");
            var single = splunkjs.mvc.Components.create("appfx-single", "test-single", {
              contextid: "test-search",
              beforeLabel: BEFORE,
              afterLabel: AFTER,
              el: $("#container1") 
            }).render();
            var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search", {
                type : "single",
            }).start();
            context.on("search:done", function(e){
                done();
            });
        },
        
        beforeEach: function(done) {
            //this.single = ...;
            //this.name = ...;
            //this.container = ...;

            done();
        },
        
        after: function(done) {
            done();
        },
        
        afterEach: function(done) {
            done();
        },
        
        "Single tests": {

            "result is valid with valid search": function(done) {
                //this.container.find(".appfx-single-result")

                assert($('#container1 .appfx-single-result')[0], 'result does not exist');
                done();
            },
            "result is not empty with valid search": function(done) {
                var result = $('.appfx-single-result');                
                assert.notEqual(result.text(), '...');
                done();
            },
            "labels render consistent with settings": function(done) {
                var bl = $('#container1 .appfx-single-label-before');
                var al = $('#container1 .appfx-single-label-after');

                var single = splunkjs.mvc.Components.getInstance("test-single");

                //check that labels are what we set them to
                assert.equal(bl.text(), BEFORE);  
                assert.equal(al.text(), AFTER);  

                //check that labels are consistent with settings
                assert.equal(bl.text(), single.settings.get('beforeLabel'), 'before label same as settings'); 
                assert.equal(al.text(), single.settings.get('afterLabel'), 'after label same as settings'); 

                done();
            },
            "labels change with settings change": function(done) {
                var bl = $('#container1 .appfx-single-label-before');
                var al = $('#container1 .appfx-single-label-after');

                var single = splunkjs.mvc.Components.getInstance("test-single");

                var preChangeBefore = bl.text();
                var postChangeBefore = 'new label';
                var preChangeAfter = al.text();
                var postChangeAfter = 'new after label';

                //check the values are unequal
                assert.notEqual(preChangeBefore, postChangeBefore, 'values equal before change');
                assert.notEqual(preChangeAfter, postChangeAfter, 'values equal before change');

                //make the change
                single.settings.set('beforeLabel', postChangeBefore);
                single.settings.set('afterLabel', postChangeAfter);

                //check values after a wait
                _.delay(function(){
                    bl = $('#container1 .appfx-single-label-before');
                    assert.equal(postChangeBefore, bl.text(), 'before lable changed successfully');

                    al = $('#container1 .appfx-single-label-after');
                    assert.equal(postChangeAfter, al.text(), 'after lable changed successfully');
                    done();
                }, 20);
            },

            "model result matches display": function(done) {
                var divName = testutil.createUniqueDiv($('#hook'));
                var single = splunkjs.mvc.Components.create("appfx-single", "test-single3", {
                  contextid: "test-search",
                  beforeLabel: "single",
                  el: $("#"+divName) 
                }).render();

                _.delay(function(){
                    //get html value
                    var htmlResult = $('#'+divName+' .appfx-single-result').text();

                    //get the datasource value
                    var modelResult =single.datasource.data().rows[0][0];

                    //compare
                    assert.equal(htmlResult, modelResult);
                    done();
                }, 20);
            },
            "control renders empty with invalid search": function(done){
                $('#hook').append("<div id='container2'></div>");
                var single = splunkjs.mvc.Components.create("appfx-single", "test-single4", {
                  contextid: "fake-search",
                  beforeLabel: BEFORE,
                  afterLabel: AFTER,
                  el: $("#container2") 
                }).render();

                var result = $('#container2 .appfx-single-result');   

                var bl = $('#container2 .appfx-single-label-before');
                var al = $('#container2 .appfx-single-label-after');

                //check that labels are what we set them to
                assert.equal(bl.text(), BEFORE);  
                assert.equal(al.text(), AFTER);  

                assert.equal(result.text(), '...');

                done();
            },

            "setting field works": function(done) {
                $('#hook').append("<div id='container3'></div>");
                var single = splunkjs.mvc.Components.create("appfx-single", "test-single5", {
                  contextid: "test-search3",
                  beforeLabel: "different field",
                  field: "other",
                  el: $("#container3") 
                }).render();
                var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search3", {
                    type : "single",
                }).start();

                context.on("search:done", function(e){
                    _.delay(function(){

                        //get result and data from model
                        var htmlResult = $('#container3 .appfx-single-result').text(); 
                        var modelResult = single.datasource.data().rows[0][1];

                        //compare
                        assert.equal(htmlResult, modelResult);

                        done();
                    }, 20);
                });
            },
            
        },
        "Not yet implemented":{
            // what should it display before it is done?

            "setting classfield works for a supported search": function(done) {
                
                done();
            },
            
        }
    };
    
    return tests;
});
