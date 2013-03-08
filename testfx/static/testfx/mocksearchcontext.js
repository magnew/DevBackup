// Copyright 2012 Splunk, Inc.

define(function(require, exports, module) {
    var _ = require("underscore");
    var mvc = require('splunkjs/mvc');
    var BaseContext = require('splunkjs/mvc/basecontext');
    var MockDataSource = require('./mockdatasource');
    var SingleMockDataSource = require('./singlemockdatasource');
    var ResultTableMockDataSource = require('./resulttablemockdatasource');
    var SearchBarMockDataSource = require('./searchbarmockdatasource');
    var TimepickerMockDataSource = require('./timepickermockdatasource');
    var TimelineMockDataSource = require('./timelinemockdatasource');
    var EventTableMockDataSource = require('./eventtablemockdatasource');
    var FormsMockDataSource = require('./formsmockdatasource');
    var ChartMockDataSource = require('./chartmockdatasource');
    var GoogleMapDataSource = require('./googlemapmockdatasource');
    var SearchModels = require('splunkjs/mvc/searchmodel');
    
    var MockSearchContext = BaseContext.extend({

        constructor: function(options) {
            // This has to be in the constructor, otherwise
            // we will call Model.set before we have created these sub-models.
            this.query = options.queryModel || new SearchModels.SearchQuery();
            this.search = options.searchModel || new SearchModels.SearchJob({label: options.name});
            
            // No need to set it on our model
            delete options.queryModel;
            delete options.searchModel;
            
            return BaseContext.prototype.constructor.apply(this, arguments);
        },

        initialize: function(options) {
            this.type = "standard";
            if('type' in options){
                this.type = options['type'];
                this.query.set({"search":"mock context - dummy search string"});
            }
        },
        
        start: function() {  
            var that = this;
            _.defer(function(){
                that.trigger("search:done"); 
            })    
            return this;
        },
        
        data: function(source, attrs) {
            attrs = attrs || {};
            attrs.context = this;
            attrs.source = source;

            var datasource = null;
            switch(this.type){
                case "single":
                    datasource = new SingleMockDataSource(attrs);
                    break;
                case "resulttable":
                    datasource = new ResultTableMockDataSource(attrs);
                    break;
                case "searchbar":
                    datasource = new SearchBarMockDataSource(attrs);
                    break;
                case "timepicker":
                    datasource = new TimepickerMockDataSource(attrs);
                    break;
                case "timeline":
                    datasource = new TimelineMockDataSource(attrs);
                    break;
                case "eventtable":
                    datasource = new EventTableMockDataSource(attrs);
                    break;
                case "forms":
                    datasource = new FormsMockDataSource(attrs);
                    break;
                case "chart":
                    datasource = new ChartMockDataSource(attrs);
                    break;
                case "googlemap":
                    datasource = new GoogleMapDataSource(attrs);
                    break;
                default:
                    datasource = new MockDataSource(attrs);
                    break;
            }
            return datasource;
        },

        set: function(key, value, options) {
            var attrs;

            // Normalize the key-value into an object
            if ((_.isObject(key) && !_.isArray(key)) || key == null) {
                attrs = key;
                options = value;
            } else {
                attrs = {};
                attrs[key] = value;
            }
            
            var search = {};
            var query = {};
            
            // If the 'search' or 'query' input attributes are present
            // then use them as the base set of output attributes for
            // each respective model (and filter them out of the original
            // input attributes).
            if (_.has(attrs, "search") && _.isObject(attrs.search)) {
                search = attrs.search;
                delete attrs.search;
            }
            if (_.has(attrs, "query") && _.isObject(attrs.query)) {
                query = attrs.query;
                delete attrs.query;
            }
            
            // Partition all remaining input attributes based on whether they
            // are destined for the job model or the query model.
            // Ignore input attributes that are unrecognized.
            search = _.extend(search, _.pick(attrs, SearchModels.SearchJob.ALLOWED_ATTRIBUTES));
            query = _.extend(query, _.pick(attrs, SearchModels.SearchQuery.ALLOWED_ATTRIBUTES));
                
            // Finally, we set it on the child models, if there is anything to
            // set
            if (!_.isEmpty(search)) {
                this.search.set(search, options);
            }
            if (!_.isEmpty(query)) {
                this.query.set(query, options);
            }
            
            return BaseContext.prototype.set.call(this, attrs, options);
        },

        switchData: function(type) {
            
        },
    });

    splunkjs.mvc.Components.registerType('appfx-mocksearchcontext', MockSearchContext);
    
    return MockSearchContext;
});
