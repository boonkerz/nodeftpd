'use strict';

// Third party dependencies
  var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

var auth   = require('../lib/auth');
var config = require('../lib/config');

// Register our authentication mechanism
auth.register('mongodb', function (username, password, done) {
  
  MongoClient.connect(config.auth.dsn, function(err, db) {
    if(err) {
      console.log(err);
      done(err, null);
      return
    };
    var col = db.collection('ftp');

    col.findOne({"username" : username }, function(col, user) {
        console.log(user);
        if(!user || user.password != password) {
            done(true, null);
            return;
        };

        user.groups = [];
        user.home = user.chroot;
        done(err, user);
    });

  })
});
