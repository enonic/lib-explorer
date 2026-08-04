var errorToThrow = null;
var responseToReturn = null;

exports.request = function () {
    if (errorToThrow) {
        throw errorToThrow;
    }
    return responseToReturn;
};

exports.__throw = function (error) {
    errorToThrow = error;
    responseToReturn = null;
};

exports.__respondWith = function (response) {
    responseToReturn = response;
    errorToThrow = null;
};

exports.__reset = function () {
    errorToThrow = null;
    responseToReturn = null;
};
