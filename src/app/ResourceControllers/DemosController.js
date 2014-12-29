'use strict';

var _ = require('underscore');

var demos = require('../../../demo/demos.js'),
    DemoProject = require('../models/DemoProject.js'),
    utils = require('../utils.js'),
    settings = require('../settings.js'),
    LOCAL_STORES = settings.LOCAL_STORE;


module.exports = Ember.ArrayController.extend({

    itemController: 'demo',


    syncDemos: function(){
        utils.setLocalStorage(LOCAL_STORES.DEMOS, this.get('demos')
            .map(function(model){
                return model.getProperties(model.get('storedProperties'));
            }));
    },


    /**
     * Recover demos from LocalStorage and demos configuration
     */
    init: function(){

        this._super();

        var data = utils.getLocalStorage(LOCAL_STORES.DEMOS),
            recovered = [];

        if (_.isArray(data)) {
            recovered = data.map(function(p){
                return DemoProject.create(p);
            });
        }

        var additional = demos
            .filter(function(d){
                return !recovered.findBy('name', d.name);
            })
            .map(function(d){
                return DemoProject.create(d)
            });

        this.set('model', recovered.concat(additional));

    }

});