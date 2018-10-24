'use strict';

var assert = require('assert');
var explain = require('../');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/explaintest');

describe('mongoose-explain', function() {
  var schema = new Schema({
    title: String,
    author: String,
    options: String
  });
  var Author = mongoose.model('Author', schema, 'author');

  beforeEach(function(done) {
    Author.remove({}, function(error) {
      if (error) {
        return done(error);
      }

      var doc = {
        title: 'Professional AngularJS',
        author: 'Val'
      };

      Author.create(doc, function(error) {
        done(error);
      });
    });
  });

  it('explain with find (gh-2572)', function(done) {
    var explainResults = [];

    schema.plugin(explain, {
      callback: function(res) { explainResults.push(res); }
    });

    var Author = mongoose.model('Author1', schema, 'author');

    Author.find({ title: 'Professional AngularJS' }, { author: 1 }, function(error, docs) {
      assert.ifError(error);
      assert.equal(docs.length, 1);
      assert.equal(docs[0].author, 'Val');
      assert.equal(explainResults.length, 1);
      done();
    });
  });

  it('explain with findOne (gh-2572)', function(done) {
    var explainResults = [];

    schema.plugin(explain, {
      callback: function(res, query) { explainResults.push([res, query]); }
    });

    var Author = mongoose.model('Author2', schema, 'author');

    Author.findOne({ title: 'Professional AngularJS' }, { author: 1 }, function(error, doc) {
      assert.ifError(error);
      assert.equal(doc.author, 'Val');
      assert.equal(explainResults.length, 1);
      assert.equal(explainResults[0][1].model, Author);
      assert.equal(explainResults[0][1].op, 'findOne');
      done();
    });
  });

  it('explain with aggregate()', function(done) {
    var explainResults = [];

    schema.plugin(explain, {
      callback: function(res, query) { explainResults.push([res, query]); }
    });

    var Author = mongoose.model('Author3', schema, 'author');

    Author.aggregate([{ $match: { title: 'Professional AngularJS' } }], function(error, res) {
      assert.ifError(error);
      assert.equal(res.length, 1);
      assert.equal(explainResults.length, 1);
      assert.equal(explainResults[0][1]._model, Author);
      done();
    });
  });
});
