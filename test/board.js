var request = require('request');
var assert = require('assert');
var queryString = require('querystring');
var TEST_URL = "http://localhost:3000/board"
describe('Baord', function() {
    describe('CRUD', function() {
        it.skip('list', function(done) {
            var param = {currentPageNo : '1', pageSize : '10'};
            request.get(TEST_URL + "?" + queryString.stringify(param), function (error, rsponse, body) {
                if (error) {
                    return console.error( error);
                }

                var list = JSON.parse(body).list;
                console.log(list);
                assert.equal(3, list.length);
                done();
            });
        });
        it.skip('one', function(done) {
            var id = 3;
            request.get(TEST_URL + "/" + id, function (error, rsponse, body) {
                if (error) {
                    return console.error( error);
                }

                var one = JSON.parse(body);
                console.log(one);
                assert.equal(id, one.id);
                done();
            });
        });
        it.skip('insert success', function(done) {
            var param = {form: {
                name : 'anne',
                title : 'test',
                contents : 'this is test'
            }};
            request.post(TEST_URL, param, function (error, rsponse, body) {
                if (error) {
                    return console.error( error);
                }
                var board = JSON.parse(body);
                console.log(board);
                assert.equal('anne', board.name);
                done();
            });
        });
        it.skip('update success', function(done) {
            var param = {form: {
                title : 'test2',
                contents : 'this is test2'
            }};
            var id = 1;
            request.put(TEST_URL + "/" + id, param, function (error, rsponse, body) {
                if (error) {
                    return console.error( error);
                }
                var board = JSON.parse(body);
                console.log(board);
                assert.equal('test2', board.title);
                done();
            });
        });
        it('delete success', function(done) {
            var id = 1;
            request.del(TEST_URL + "/" + id, function (error, rsponse, body) {
                if (error) {
                    return console.error( error);
                }
                var result = JSON.parse(body).result;
                assert.equal("success", result);
                done();
            });
        });
    });
});