var assert = require('/lib/xp/testing');
var httpClientMock = require('/lib/http-client');
var smartRequest = require('/lib/explorer/http/client/smartRequest').smartRequest;

var ConnectException = Java.type('java.net.ConnectException');
var SocketTimeoutException = Java.type('java.net.SocketTimeoutException');
var NullPointerException = Java.type('java.lang.NullPointerException');
var RuntimeException = Java.type('java.lang.RuntimeException');

exports.before = function () {
    httpClientMock.__reset();
};

exports.testConnectExceptionIsHandledAndRethrown = function () {
    httpClientMock.__throw(new ConnectException('simulated connect failure'));
    var thrown = assert.assertThrows(function () {
        smartRequest({url: 'http://localhost/', retries: 0, delay: 0});
    });
    assert.assertTrue(thrown instanceof ConnectException, 'expected the ConnectException to propagate');
};

exports.testSocketTimeoutExceptionIsHandledAndRethrown = function () {
    httpClientMock.__throw(new SocketTimeoutException('connect timed out'));
    var thrown = assert.assertThrows(function () {
        smartRequest({url: 'http://localhost/', retries: 0, delay: 0});
    });
    assert.assertTrue(thrown instanceof SocketTimeoutException, 'expected the SocketTimeoutException to propagate');
};

exports.testNullPointerExceptionIsHandledAndRethrown = function () {
    httpClientMock.__throw(new NullPointerException('simulated npe'));
    var thrown = assert.assertThrows(function () {
        smartRequest({url: 'http://localhost/', retries: 0, delay: 0});
    });
    assert.assertTrue(thrown instanceof NullPointerException, 'expected the NullPointerException to propagate');
};

exports.testUnhandledErrorIsRethrown = function () {
    httpClientMock.__throw(new RuntimeException('simulated unhandled error'));
    var thrown = assert.assertThrows(function () {
        smartRequest({url: 'http://localhost/', retries: 0, delay: 0});
    });
    assert.assertTrue(thrown instanceof RuntimeException, 'expected the RuntimeException to propagate');
};

exports.testSuccessfulRequestReturnsResponse = function () {
    httpClientMock.__respondWith({status: 200, body: 'ok'});
    var response = smartRequest({url: 'http://localhost/', retries: 0, delay: 0});
    assert.assertEquals(200, response.status);
    assert.assertEquals('ok', response.body);
};
