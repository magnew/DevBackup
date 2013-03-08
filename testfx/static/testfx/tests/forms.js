define(function(require, exports, module) {
    var _ = require("underscore");
    var mvc = require("splunkjs/mvc");
    var assert = require("../chai").assert;
    var testutil = require("../testutil");
    var forms = require('splunkjs/mvc/forms');
    var mockcontext = require('../mocksearchcontext');

    var tests = {
        before: function(done) {
            var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search", {
                    type: "forms",
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
        
        "Forms tests": {
            "static select element with no search renders properly": function(done) {
                var choices = [{label: " One", value: "One"},
                                {label:" Two", value: "Two"}, 
                                {label:" Three", value: "Three"}];

                $('#hook').append("<div id='container1'></div>");

                var select = splunkjs.mvc.Components.create("appfx-select", "test-select1", {
                    contextid: "fake-search",
                    choices : choices,
                    el: $("#container1") 
                }).render();

                
                _.delay(function(){
                    //check view for proper number of choices
                    assert.equal(select.settings.get("choices").length, choices.length);

                    //check html
                    assert.lengthOf($('#container1 .select2-container'), 1, 'select container error');
                    assert.lengthOf($('#container1 select'), 1, 'select select element error');
                    assert.lengthOf($('#container1 select').children(), choices.length, 'select choices error');
                    done(); 
                }, 20);
                      
            },
            "static select element with valid search renders properly": function(done) {
                var choices = [{label: " One", value: "One"},
                                {label:" Two", value: "Two"}, 
                                {label:" Three", value: "Three"}];

                $('#hook').append("<div id='container2'></div>");

                var select = splunkjs.mvc.Components.create("appfx-select", "test-select2", {
                    contextid: "test-search",
                    choices : choices,
                    el: $("#container2") 
                }).render();
    
                _.delay(function(){
                    //check view for proper number of choices
                    assert.equal(select.settings.get("choices").length, choices.length);

                    //check html
                    assert.lengthOf($('#container2 .select2-container'), 1, 'select container error');
                    assert.lengthOf($('#container2 select'), 1, 'select select element error');
                    assert.lengthOf($('#container2 select').children(), choices.length, 'select choices error');
                    done(); 
                }, 20);
                      
            },
            "static radio element with no search renders properly": function(done) {
                var choices = [{label: " One", value: "One"},
                                {label:" Two", value: "Two"}, 
                                {label:" Three", value: "Three"}];

                $('#hook').append("<div id='container3'></div>");

                var radio = splunkjs.mvc.Components.create("appfx-radio", "test-radio3", {
                    contextid: "fake-search",
                    choices : choices,
                    el: $("#container3") 
                }).render();
                
                _.delay(function(){
                    //check view for proper number of choices
                    assert.equal(radio.settings.get("choices").length, choices.length, 'view length error');

                    //check html
                    assert.lengthOf($('#container3 input'), choices.length, 'html choices length error')

                    done(); 
                }, 20);
                      
            },  
            "static radio element with valid search renders properly": function(done) {
                var choices = [{label: " One", value: "One"},
                                {label:" Two", value: "Two"}, 
                                {label:" Three", value: "Three"}];

                $('#hook').append("<div id='container4'></div>");

                var radio = splunkjs.mvc.Components.create("appfx-radio", "test-radio4", {
                    contextid: "test-search",
                    choices : choices,
                    el: $("#container4") 
                }).render();
                
                _.delay(function(){
                    //check view for proper number of choices
                    assert.equal(radio.settings.get("choices").length, choices.length, 'view length error');

                    //check html
                    assert.lengthOf($('#container4 input'), choices.length, 'html choices length error')

                    done(); 
                }, 20);
                      
            },  
               
            "textbox element renders properly": function(done) {
                var defaultText = "default text";

                $('#hook').append("<div id='container5'></div>");

                splunkjs.mvc.Components.create("appfx-textbox", "test-textbox5", {
                    contextid: "test-search",
                    default : defaultText,
                    el: $("#container5") 
                }).render();
                
                //check html
                assert.lengthOf($('#container5 input'), 1)
                
                done();                
            },
            "setting defaults works": function(done) {
                var defaultText = "default text";
                var choices = [{label: " One", value: "One"},
                                {label:" Two", value: "Two"}, 
                                {label:" Three", value: "Three"}];
                var defaultChoice = "Three";

                $('#hook').append("<div id='container6'></div>");
                $('#hook').append("<div id='container7'></div>");
                $('#hook').append("<div id='container8'></div>");

                var textbox = splunkjs.mvc.Components.create("appfx-textbox", "test-textbox6", {
                    contextid: "test-search",
                    default : defaultText,
                    el: $("#container6") 
                }).render();
                var select = splunkjs.mvc.Components.create("appfx-select", "test-select7", {
                    contextid: "test-search",
                    default : defaultChoice,
                    choices : choices,
                    el: $("#container7") 
                }).render();
                var radio = splunkjs.mvc.Components.create("appfx-radio", "test-radio8", {
                    contextid: "test-search",
                    default : defaultChoice,
                    choices : choices,
                    el: $("#container8") 
                }).render();
                
                _.delay(function(){
                    assert.equal(textbox.val(), defaultText, 'textbox default error');
                    assert.equal(select.val(), defaultChoice, 'select default error');
                    assert.equal(radio.val(), defaultChoice, 'radio default error');
                    done(); 
                }, 20);               
            },

            "textbox change events fired properly": function(done) {
                var defaultText = "default text";

                $('#hook').append("<hr>");
                $('#hook').append("<div id='container9'></div>");
                
                var textbox = splunkjs.mvc.Components.create("appfx-textbox", "test-textbox9", {
                    contextid: "fake-search",
                    default : defaultText,
                    el: $("#container9") 
                }).render();
                
                textbox.on("change", function(){
                    done();
                });

                _.delay(function(){
                    textbox.val("changed");  
                }, 20);               
            },
            "select change events fired properly": function(done) {
                var choices = [{label: " One", value: "One"},
                                {label:" Two", value: "Two"}, 
                                {label:" Three", value: "Three"}];
                var defaultChoice = "Three";

                $('#hook').append("<hr>");
                $('#hook').append("<div id='container10'></div>");
                
                var select = splunkjs.mvc.Components.create("appfx-select", "test-select10", {
                    contextid: "fake-search",
                    default : defaultChoice,
                    choices : choices,
                    el: $("#container10") 
                }).render();

                select.on("change", function(){
                    done();
                })
  
                _.delay(function(){
                    select.val("Two");
                    done(); 
                }, 20);               
            },
            "radio change events fired properly": function(done) {
                var choices = [{label: " One", value: "One"},
                                {label:" Two", value: "Two"}, 
                                {label:" Three", value: "Three"}];
                var defaultChoice = "Three";

                $('#hook').append("<hr>");
                $('#hook').append("<div id='container11'></div>");

                var radio = splunkjs.mvc.Components.create("appfx-radio", "test-radio11", {
                    contextid: "fake-search",
                    default : defaultChoice,
                    choices : choices,
                    el: $("#container11") 
                }).render();
                
                radio.on("change", function(){
                    done();
                })
  
                _.delay(function(){
                    radio.val("Two");
                    done(); 
                }, 20);              
            },
            "select populated by search correctly": function(done) {
                $('#hook').append("<hr>");
                $('#hook').append("<div id='container12'></div>");
                
                var select = splunkjs.mvc.Components.create("appfx-select", "test-select12", {
                    contextid: "test-search12",
                    el: $("#container12") 
                }).render();
                var context = splunkjs.mvc.Components.create("appfx-mocksearchcontext", "test-search12", {
                    type: "forms",
                    preview: "True",
                    status_buckets: 300
                }).start();
                context.on("search:done", function(e){
                    assert(false, 'this test is not working... yet...');
                    done();
                });         
            },
             
        },
        "Not yet implemented" : {

            "controls populated by search correctly": function(done) {
                done();                
            },

            "setting label field and value fields works": function(done) {
                done();                
            },
        }
    };
    
    return tests;
});
